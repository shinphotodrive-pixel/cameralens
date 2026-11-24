import React, { useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';
import {
  CAMERA_DATA,
  LENS_DATA,
  type CameraRecord,
  type LensRecord,
} from '../data/procurementData';

interface QuoteCombination {
  cameraId: string;
  lensId: string; // LensRecord.id or 'included_elp'
}

interface QuoteComparisonProps {
  onLoadToSimulator?: (cameraId: string, lensId: string) => void;
}

interface ComputedQuote {
  camera: CameraRecord;
  lens: LensRecord | null;
  isElpIncluded: boolean;
  unitKrwMin: number | null;
  unitKrwMax: number | null;
  hasQuotePendingPart: boolean;
  hfovDeg: number;
  width10m: number;
  effectiveFpsLabel: string;
  availabilityScoreLabel: string;
}

const INCLUDED_ELP_LENS_ID = 'included_elp';

function formatKrw(amount: number): string {
  return `${Math.round(amount).toLocaleString('ko-KR')}원`;
}

function formatKrwRange(min: number | null, max: number | null, hasPending: boolean): string {
  if (min === null || max === null) return '별도 견적 필요';
  const suffix = hasPending ? ' + 렌즈 견적 별도' : '';
  if (Math.abs(min - max) < 100) {
    return `${formatKrw(min)}${suffix}`;
  }
  return `${formatKrw(min)} ~ ${formatKrw(max)}${suffix}`;
}

function mapToSimulatorCamera(cameraId: string): string {
  switch (cameraId) {
    case 'econ_24cug':
      return 'econ_24cug_board';
    case 'ids_u3':
      return 'ids_u3';
    case 'basler_160':
      return 'basler_160';
    case 'alvium_u240':
      return 'alvium_u240';
    case 'tis_dfm37ux265':
      return 'tis_dfm37ux265';
    case 'flir_bfs23s3':
      return 'flir_bfs23s3';
    case 'econ_20cug':
      return 'econ_20cug';
    case 'elp_p02':
      return 'elp_p02';
    case 'arducam_b0495':
      return 'arducam_b0495';
    case 'elp_l12':
      return 'elp_l12';
    default:
      return 'econ_24cug_board';
  }
}

function mapToSimulatorLens(lensId: string): string {
  switch (lensId) {
    case 'arducam_m1812':
      return 'arducam_m1812';
    case 'commonlands_cil125':
      return 'commonlands_cil125_irc';
    case 'edmund_33878':
      return 'edmund_33878';
    case 'edmund_uav':
      return 'edmund_uav';
    case 'azure_ir':
      return 'azure_ir';
    case INCLUDED_ELP_LENS_ID:
      return 'elp_stock';
    default:
      return 'arducam_m1812';
  }
}

function isElpCamera(cameraId: string): boolean {
  return cameraId === 'elp_l12' || cameraId === 'elp_p02';
}

function computeQuote(
  combo: QuoteCombination,
  exchangeRate: number
): ComputedQuote {
  const camera = CAMERA_DATA.find((c) => c.id === combo.cameraId) ?? CAMERA_DATA[2];
  const isElpIncluded =
    isElpCamera(camera.id) && combo.lensId === INCLUDED_ELP_LENS_ID;
  const lens = isElpIncluded
    ? null
    : LENS_DATA.find((l) => l.id === combo.lensId) ?? LENS_DATA[0];

  const camKrwMin =
    camera.krwMin !== null
      ? camera.krwMin
      : camera.usdMin !== null
      ? camera.usdMin * exchangeRate
      : null;
  const camKrwMax =
    camera.krwMax !== null
      ? camera.krwMax
      : camera.usdMax !== null
      ? camera.usdMax * exchangeRate
      : null;

  let lensKrwMin: number | null = 0;
  let lensKrwMax: number | null = 0;
  let hasQuotePendingPart = false;

  if (!isElpIncluded && lens) {
    if (lens.krwFixed !== null) {
      lensKrwMin = lens.krwFixed;
      lensKrwMax = lens.krwFixed;
    } else if (lens.usdMin !== null && lens.usdMax !== null) {
      lensKrwMin = lens.usdMin * exchangeRate;
      lensKrwMax = lens.usdMax * exchangeRate;
    } else {
      lensKrwMin = null;
      lensKrwMax = null;
      hasQuotePendingPart = true;
    }
  }

  const unitKrwMin =
    camKrwMin !== null ? camKrwMin + (lensKrwMin ?? 0) : null;
  const unitKrwMax =
    camKrwMax !== null ? camKrwMax + (lensKrwMax ?? 0) : null;

  const focalLength = lens ? lens.focalLengthMm : 12;
  const hfovRad = 2 * Math.atan(camera.sensorWidthMm / (2 * focalLength));
  const hfovDeg = (hfovRad * 180) / Math.PI;
  const width10m = 2 * 10 * Math.tan(hfovRad / 2);

  const effectiveFpsLabel = camera.isUsb3
    ? `비압축 최대 ${camera.maxUncompressedFps} fps (${camera.fps})`
    : `비압축 ~${camera.maxUncompressedFps} fps 제한 (${camera.fps})`;

  let availabilityScoreLabel = '해외 직구·발주';
  if (
    camera.tags.includes('korea') &&
    lens?.id === 'arducam_m1812'
  ) {
    availabilityScoreLabel = '국내 재고 즉시 출고 (최단 납기)';
  } else if (hasQuotePendingPart) {
    availabilityScoreLabel = '해외 발주 + 렌즈 별도 견적 필요';
  } else if (camera.tags.includes('korea')) {
    availabilityScoreLabel = '카메라 국내 즉시 + 렌즈 해외 주문';
  }

  return {
    camera,
    lens,
    isElpIncluded,
    unitKrwMin,
    unitKrwMax,
    hasQuotePendingPart,
    hfovDeg,
    width10m,
    effectiveFpsLabel,
    availabilityScoreLabel,
  };
}

export const QuoteComparison: React.FC<QuoteComparisonProps> = ({
  onLoadToSimulator,
}) => {
  const [comboA, setComboA] = useState<QuoteCombination>({
    cameraId: 'econ_24cug',
    lensId: 'arducam_m1812',
  });
  const [comboB, setComboB] = useState<QuoteCombination>({
    cameraId: 'basler_160',
    lensId: 'commonlands_cil125',
  });
  const [quantity, setQuantity] = useState<number>(1);
  const [exchangeRate, setExchangeRate] = useState<number>(1380);

  const quoteA = useMemo(
    () => computeQuote(comboA, exchangeRate),
    [comboA, exchangeRate]
  );
  const quoteB = useMemo(
    () => computeQuote(comboB, exchangeRate),
    [comboB, exchangeRate]
  );

  const handleCameraChange = (side: 'A' | 'B', newCamId: string) => {
    const updater = (prev: QuoteCombination): QuoteCombination => {
      if (isElpCamera(newCamId)) {
        return { cameraId: newCamId, lensId: INCLUDED_ELP_LENS_ID };
      }
      const nextLens =
        prev.lensId === INCLUDED_ELP_LENS_ID ? 'arducam_m1812' : prev.lensId;
      return { cameraId: newCamId, lensId: nextLens };
    };
    if (side === 'A') setComboA(updater);
    else setComboB(updater);
  };

  const handleSwap = () => {
    setComboA(comboB);
    setComboB(comboA);
  };

  const applyComparisonPreset = (preset: 'econ_vs_basler' | 'ids_vs_flir' | 'econ_vs_elp_p02') => {
    if (preset === 'econ_vs_basler') {
      setComboA({ cameraId: 'econ_24cug', lensId: 'arducam_m1812' });
      setComboB({ cameraId: 'basler_160', lensId: 'commonlands_cil125' });
    } else if (preset === 'ids_vs_flir') {
      setComboA({ cameraId: 'ids_u3', lensId: 'commonlands_cil125' });
      setComboB({ cameraId: 'flir_bfs23s3', lensId: 'edmund_33878' });
    } else {
      setComboA({ cameraId: 'econ_24cug', lensId: 'commonlands_cil125' });
      setComboB({ cameraId: 'elp_p02', lensId: INCLUDED_ELP_LENS_ID });
    }
  };

  const totalAMin = quoteA.unitKrwMin !== null ? quoteA.unitKrwMin * quantity : null;
  const totalAMax = quoteA.unitKrwMax !== null ? quoteA.unitKrwMax * quantity : null;
  const totalBMin = quoteB.unitKrwMin !== null ? quoteB.unitKrwMin * quantity : null;
  const totalBMax = quoteB.unitKrwMax !== null ? quoteB.unitKrwMax * quantity : null;

  const midA =
    totalAMin !== null && totalAMax !== null ? (totalAMin + totalAMax) / 2 : null;
  const midB =
    totalBMin !== null && totalBMax !== null ? (totalBMin + totalBMax) / 2 : null;

  const priceWinner: 'A' | 'B' | 'tie' | null =
    midA !== null && midB !== null && !quoteA.hasQuotePendingPart && !quoteB.hasQuotePendingPart
      ? Math.abs(midA - midB) < 5000
        ? 'tie'
        : midA < midB
        ? 'A'
        : 'B'
      : null;

  const priceDeltaText =
    midA !== null && midB !== null
      ? midA < midB
        ? `조합 A가 평균 약 ${formatKrw(midB - midA)} 절감`
        : midB < midA
        ? `조합 B가 평균 약 ${formatKrw(midA - midB)} 절감`
        : '예상 금액 거의 동일'
      : '별도 견적 품목 포함으로 직접 비교 불가';

  const fpsWinner: 'A' | 'B' | 'tie' =
    quoteA.camera.maxUncompressedFps === quoteB.camera.maxUncompressedFps
      ? 'tie'
      : quoteA.camera.maxUncompressedFps > quoteB.camera.maxUncompressedFps
      ? 'A'
      : 'B';

  const renderStrobeCell = (q: ComputedQuote) => {
    const { strobeSupport, strobeSpec, strobePinout } = q.camera;
    return (
      <div>
        <div className="flex items-center gap-1.5 font-semibold text-xs">
          {strobeSupport === 'official' && (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0" aria-hidden="true" />
              <span className="text-teal-800">{strobeSpec}</span>
            </>
          )}
          {strobeSupport === 'conditional' && (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
              <span className="text-amber-800">{strobeSpec}</span>
            </>
          )}
          {strobeSupport === 'none' && (
            <>
              <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" aria-hidden="true" />
              <span className="text-rose-700">{strobeSpec}</span>
            </>
          )}
        </div>
        <div className="text-xs text-slate-600 mt-1 leading-relaxed">{strobePinout}</div>
      </div>
    );
  };

  return (
    <section id="sec-quote-compare" className="scroll-mt-20">
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
        {/* Header & Presets */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-semibold text-blue-700 mb-1">
              견적 및 사양 대조 · CameraDatabase × LensDatabase 연동
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              두 가지 조달 조합 가격 · 성능 · 스트로브 · 가용성 비교
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              카메라 DB와 12mm 렌즈 DB에 수록된 공식 단가, 비압축 프레임 속도, 조명 제어용 스트로브 핀 사양, 수급 경로 및 규정 준수 정보를 바탕으로 두 조합을 나란히 대조합니다.
            </p>
          </div>

          <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0 self-start lg:self-auto">
            <button
              type="button"
              onClick={() => applyComparisonPreset('econ_vs_basler')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                comboA.cameraId === 'econ_24cug' && comboB.cameraId === 'basler_160'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              e-con vs Basler
            </button>
            <button
              type="button"
              onClick={() => applyComparisonPreset('ids_vs_flir')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                comboA.cameraId === 'ids_u3' && comboB.cameraId === 'flir_bfs23s3'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              IDS vs FLIR 옵토스트로브
            </button>
            <button
              type="button"
              onClick={() => applyComparisonPreset('econ_vs_elp_p02')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                comboA.cameraId === 'econ_24cug' && comboB.cameraId === 'elp_p02'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              e-con vs ELP P02
            </button>
          </div>
        </div>

        {/* Quantity & Exchange Rate Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mb-6">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <label htmlFor="quote-qty" className="font-semibold text-slate-700 whitespace-nowrap">
                조달 수량 (세트)
              </label>
              <div className="inline-flex items-center gap-1 bg-white border border-slate-300 rounded-md p-0.5">
                {[1, 5, 10].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuantity(q)}
                    className={`px-2 py-1 rounded text-xs font-mono-tabular cursor-pointer transition-colors ${
                      quantity === q
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {q}대
                  </button>
                ))}
                <input
                  id="quote-qty"
                  type="number"
                  min={1}
                  max={500}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Math.min(500, Number(e.target.value) || 1)))
                  }
                  aria-label="직접 수량 입력"
                  className="w-14 px-2 py-1 text-xs font-mono-tabular text-right text-slate-900 border-l border-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="quote-fx" className="font-semibold text-slate-700 whitespace-nowrap">
                적용 환율 (1 USD)
              </label>
              <div className="inline-flex items-center bg-white border border-slate-300 rounded-md px-2 py-1">
                <input
                  id="quote-fx"
                  type="number"
                  min={900}
                  max={2000}
                  step={10}
                  value={exchangeRate}
                  onChange={(e) =>
                    setExchangeRate(Math.max(900, Math.min(2000, Number(e.target.value) || 1380)))
                  }
                  className="w-16 text-xs font-mono-tabular text-right text-slate-900 focus:outline-none"
                />
                <span className="text-xs text-slate-500 ml-1">원</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSwap}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
            <span>조합 A ↔ B 맞바꾸기</span>
          </button>
        </div>

        {/* Combination A & B Selectors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Selector A */}
          <div className="bg-slate-50 rounded-lg border border-blue-200 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-blue-700">조합 A 구성 선택</span>
              {onLoadToSimulator && (
                <button
                  type="button"
                  onClick={() =>
                    onLoadToSimulator(
                      mapToSimulatorCamera(comboA.cameraId),
                      mapToSimulatorLens(comboA.lensId)
                    )
                  }
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-900 whitespace-nowrap cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>시뮬레이터에서 보기</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="quote-cam-a" className="block text-xs font-medium text-slate-600 mb-1">
                  카메라 바디
                </label>
                <select
                  id="quote-cam-a"
                  value={comboA.cameraId}
                  onChange={(e) => handleCameraChange('A', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                >
                  {CAMERA_DATA.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.model} ({c.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="quote-lens-a" className="block text-xs font-medium text-slate-600 mb-1">
                  12mm M12 렌즈
                </label>
                <select
                  id="quote-lens-a"
                  value={comboA.lensId}
                  onChange={(e) =>
                    setComboA((prev) => ({ ...prev, lensId: e.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                >
                  {isElpCamera(comboA.cameraId) && (
                    <option value={INCLUDED_ELP_LENS_ID}>
                      기본 12mm(-L12) 옵션 포함 ($0 추가)
                    </option>
                  )}
                  {LENS_DATA.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.model} ({l.focalAperture} · {l.price})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Selector B */}
          <div className="bg-slate-50 rounded-lg border border-teal-200 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-teal-800">조합 B 구성 선택</span>
              {onLoadToSimulator && (
                <button
                  type="button"
                  onClick={() =>
                    onLoadToSimulator(
                      mapToSimulatorCamera(comboB.cameraId),
                      mapToSimulatorLens(comboB.lensId)
                    )
                  }
                  className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-900 whitespace-nowrap cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>시뮬레이터에서 보기</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="quote-cam-b" className="block text-xs font-medium text-slate-600 mb-1">
                  카메라 바디
                </label>
                <select
                  id="quote-cam-b"
                  value={comboB.cameraId}
                  onChange={(e) => handleCameraChange('B', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-900 focus:border-teal-700 focus:outline-none"
                >
                  {CAMERA_DATA.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.model} ({c.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="quote-lens-b" className="block text-xs font-medium text-slate-600 mb-1">
                  12mm M12 렌즈
                </label>
                <select
                  id="quote-lens-b"
                  value={comboB.lensId}
                  onChange={(e) =>
                    setComboB((prev) => ({ ...prev, lensId: e.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-900 focus:border-teal-700 focus:outline-none"
                >
                  {isElpCamera(comboB.cameraId) && (
                    <option value={INCLUDED_ELP_LENS_ID}>
                      기본 12mm(-L12) 옵션 포함 ($0 추가)
                    </option>
                  )}
                  {LENS_DATA.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.model} ({l.focalAperture} · {l.price})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary Strip for Quote Delta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
            <div className="text-xs text-slate-500 font-medium mb-1">
              비용 차이 ({quantity}세트 기준)
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-900 font-mono-tabular">
              {priceDeltaText}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              1 USD = {exchangeRate.toLocaleString('ko-KR')}원 환산 (관세·배송비 제외)
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
            <div className="text-xs text-slate-500 font-medium mb-1">
              비압축 전송 성능 비교
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-900 font-mono-tabular">
              {fpsWinner === 'tie'
                ? `동일 (${quoteA.camera.maxUncompressedFps} fps)`
                : fpsWinner === 'A'
                ? `조합 A 우위 (${quoteA.camera.maxUncompressedFps} vs ${quoteB.camera.maxUncompressedFps} fps)`
                : `조합 B 우위 (${quoteB.camera.maxUncompressedFps} vs ${quoteA.camera.maxUncompressedFps} fps)`}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              1920×1200+ 비압축 실효 출력 기준
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
            <div className="text-xs text-slate-500 font-medium mb-1">
              수급 및 가용성 요약
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-900">
              A: {quoteA.availabilityScoreLabel}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">
              B: {quoteB.availabilityScoreLabel}
            </div>
          </div>
        </div>

        {/* Structured Side-by-Side Comparison Matrix */}
        <div className="overflow-x-auto custom-scrollbar border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
            <thead className="bg-slate-100 text-slate-800">
              <tr>
                <th className="px-4 py-3 text-left font-semibold w-44 whitespace-nowrap">
                  비교 항목
                </th>
                <th className="px-4 py-3 text-left font-bold text-blue-800 min-w-[260px]">
                  조합 A · {quoteA.camera.model.split('(')[0].trim()}
                </th>
                <th className="px-4 py-3 text-left font-bold text-teal-800 min-w-[260px]">
                  조합 B · {quoteB.camera.model.split('(')[0].trim()}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {/* Group 1: Pricing */}
              <tr className="bg-slate-50/80">
                <td colSpan={3} className="px-4 py-2 text-xs font-bold text-slate-700">
                  1. 가격 비교 (단가 및 총 견적)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-600">카메라 바디 단가</td>
                <td className="px-4 py-3 font-mono-tabular text-slate-900">{quoteA.camera.price}</td>
                <td className="px-4 py-3 font-mono-tabular text-slate-900">{quoteB.camera.price}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-600">12mm M12 렌즈 단가</td>
                <td className="px-4 py-3 font-mono-tabular text-slate-900">
                  {quoteA.isElpIncluded
                    ? '기본 포함 ($0 추가 · F값 미상)'
                    : `${quoteA.lens?.model} (${quoteA.lens?.price})`}
                </td>
                <td className="px-4 py-3 font-mono-tabular text-slate-900">
                  {quoteB.isElpIncluded
                    ? '기본 포함 ($0 추가 · F값 미상)'
                    : `${quoteB.lens?.model} (${quoteB.lens?.price})`}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-600">1세트 환산 단가</td>
                <td className="px-4 py-3 font-semibold font-mono-tabular text-slate-900">
                  {formatKrwRange(quoteA.unitKrwMin, quoteA.unitKrwMax, quoteA.hasQuotePendingPart)}
                </td>
                <td className="px-4 py-3 font-semibold font-mono-tabular text-slate-900">
                  {formatKrwRange(quoteB.unitKrwMin, quoteB.unitKrwMax, quoteB.hasQuotePendingPart)}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-800">
                  총 {quantity}세트 예상 합계
                </td>
                <td className="px-4 py-3 font-mono-tabular">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-slate-900">
                      {formatKrwRange(totalAMin, totalAMax, quoteA.hasQuotePendingPart)}
                    </span>
                    {priceWinner === 'A' && (
                      <span className="text-xs font-semibold text-teal-700">[비용 절감]</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono-tabular">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-slate-900">
                      {formatKrwRange(totalBMin, totalBMax, quoteB.hasQuotePendingPart)}
                    </span>
                    {priceWinner === 'B' && (
                      <span className="text-xs font-semibold text-teal-700">[비용 절감]</span>
                    )}
                  </div>
                </td>
              </tr>

              {/* Group 2: Performance & Strobe */}
              <tr className="bg-slate-50/80">
                <td colSpan={3} className="px-4 py-2 text-xs font-bold text-slate-700">
                  2. 성능 및 스트로브 비교 (센서 · 프레임 속도 · 광학 화각 · Strobe Out)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-600">조명 제어용 스트로브 출력</td>
                <td className="px-4 py-3">{renderStrobeCell(quoteA)}</td>
                <td className="px-4 py-3">{renderStrobeCell(quoteB)}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-600">센서 및 해상도</td>
                <td className="px-4 py-3 text-slate-900 font-mono-tabular">{quoteA.camera.sensor}</td>
                <td className="px-4 py-3 text-slate-900 font-mono-tabular">{quoteB.camera.sensor}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-600">USB 규격 및 전송 속도</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{quoteA.camera.usb}</div>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs font-mono-tabular">
                    {quoteA.camera.isUsb3 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0" aria-hidden="true" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
                    )}
                    <span className={quoteA.camera.isUsb3 ? 'text-teal-700 font-semibold' : 'text-amber-800 font-semibold'}>
                      {quoteA.effectiveFpsLabel}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{quoteB.camera.usb}</div>
                  <div className="flex items-center gap-1.5 mt-0.5 text-xs font-mono-tabular">
                    {quoteB.camera.isUsb3 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0" aria-hidden="true" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
                    )}
                    <span className={quoteB.camera.isUsb3 ? 'text-teal-700 font-semibold' : 'text-amber-800 font-semibold'}>
                      {quoteB.effectiveFpsLabel}
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-600">렌즈 초점거리 / 조리개</td>
                <td className="px-4 py-3 font-mono-tabular">
                  {quoteA.isElpIncluded ? (
                    <span className="text-amber-800 font-semibold">12mm / F값 미기재</span>
                  ) : (
                    <span className="font-semibold text-slate-900">
                      {quoteA.lens?.focalAperture} ({quoteA.lens?.sensorFormat})
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono-tabular">
                  {quoteB.isElpIncluded ? (
                    <span className="text-amber-800 font-semibold">12mm / F값 미기재</span>
                  ) : (
                    <span className="font-semibold text-slate-900">
                      {quoteB.lens?.focalAperture} ({quoteB.lens?.sensorFormat})
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-600">수평 화각 / 10m 촬영 폭</td>
                <td className="px-4 py-3 font-mono-tabular text-slate-900">
                  HFOV <strong className="text-blue-700">{quoteA.hfovDeg.toFixed(2)}°</strong> · 10m 폭{' '}
                  <strong>{quoteA.width10m.toFixed(2)}m</strong>
                </td>
                <td className="px-4 py-3 font-mono-tabular text-slate-900">
                  HFOV <strong className="text-teal-700">{quoteB.hfovDeg.toFixed(2)}°</strong> · 10m 폭{' '}
                  <strong>{quoteB.width10m.toFixed(2)}m</strong>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-600">하드웨어 트리거 입력</td>
                <td className="px-4 py-3 text-xs">
                  {quoteA.camera.hardwareTrigger
                    ? '지원 (GPIO / USB3 Vision / GenICam I/O)'
                    : '미지원 / 별도 커스텀 FW 필요'}
                </td>
                <td className="px-4 py-3 text-xs">
                  {quoteB.camera.hardwareTrigger
                    ? '지원 (GPIO / USB3 Vision / GenICam I/O)'
                    : '미지원 / 별도 커스텀 FW 필요'}
                </td>
              </tr>

              {/* Group 3: Availability & Compliance */}
              <tr className="bg-slate-50/80">
                <td colSpan={3} className="px-4 py-2 text-xs font-bold text-slate-700">
                  3. 가용성 및 조달 적합성 (수급 · 필터 · 규제)
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-600">수급 경로 및 유의사항</td>
                <td className="px-4 py-3 text-xs leading-relaxed">
                  <div className="font-semibold text-slate-900">{quoteA.availabilityScoreLabel}</div>
                  <div className="text-slate-600 mt-0.5">{quoteA.camera.leadTimeNote}</div>
                </td>
                <td className="px-4 py-3 text-xs leading-relaxed">
                  <div className="font-semibold text-slate-900">{quoteB.availabilityScoreLabel}</div>
                  <div className="text-slate-600 mt-0.5">{quoteB.camera.leadTimeNote}</div>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-600">IR-Cut 필터 및 기구 호환</td>
                <td className="px-4 py-3 text-xs leading-relaxed">
                  <div>
                    {quoteA.isElpIncluded
                      ? '필터 사양 상세 확인 필요 (일체형 출하)'
                      : `렌즈 필터: ${quoteA.lens?.irCut}`}
                  </div>
                  {quoteA.lens?.bulkyWarning && quoteA.camera.isCaseOptionAvailable && (
                    <div className="text-rose-700 font-semibold mt-1">
                      주의: 외경 22mm 렌즈로 케이스 개구부 간섭 가능 (보드형 권장)
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-xs leading-relaxed">
                  <div>
                    {quoteB.isElpIncluded
                      ? '필터 사양 상세 확인 필요 (일체형 출하)'
                      : `렌즈 필터: ${quoteB.lens?.irCut}`}
                  </div>
                  {quoteB.lens?.bulkyWarning && quoteB.camera.isCaseOptionAvailable && (
                    <div className="text-rose-700 font-semibold mt-1">
                      주의: 외경 22mm 렌즈로 케이스 개구부 간섭 가능 (보드형 권장)
                    </div>
                  )}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-600">NDAA 제889조 준수</td>
                <td className="px-4 py-3 text-xs font-semibold">
                  {quoteA.camera.ndaaCompliant === true
                    ? '준수 명시 (공공·인프라 조달 적합)'
                    : quoteA.camera.ndaaCompliant === false
                    ? '미인증 (민간·프로토타입 권장)'
                    : '별도 적합 여부 확인 필요'}
                </td>
                <td className="px-4 py-3 text-xs font-semibold">
                  {quoteB.camera.ndaaCompliant === true
                    ? '준수 명시 (공공·인프라 조달 적합)'
                    : quoteB.camera.ndaaCompliant === false
                    ? '미인증 (민간·프로토타입 권장)'
                    : '별도 적합 여부 확인 필요'}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-600">구매처 바로가기</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {quoteA.camera.urls.slice(0, 2).map((u) => (
                      <a
                        key={u.url}
                        href={u.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded border border-blue-200 bg-blue-50/70 text-blue-700 hover:bg-blue-700 hover:text-white text-xs font-medium transition-colors"
                      >
                        <span>바디: {u.label}</span>
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    ))}
                    {quoteA.lens?.urls.slice(0, 1).map((u) => (
                      <a
                        key={u.url}
                        href={u.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-800 hover:text-white text-xs font-medium transition-colors"
                      >
                        <span>렌즈: {u.label}</span>
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {quoteB.camera.urls.slice(0, 2).map((u) => (
                      <a
                        key={u.url}
                        href={u.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded border border-teal-200 bg-teal-50/70 text-teal-800 hover:bg-teal-700 hover:text-white text-xs font-medium transition-colors"
                      >
                        <span>바디: {u.label}</span>
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    ))}
                    {quoteB.lens?.urls.slice(0, 1).map((u) => (
                      <a
                        key={u.url}
                        href={u.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-800 hover:text-white text-xs font-medium transition-colors"
                      >
                        <span>렌즈: {u.label}</span>
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
