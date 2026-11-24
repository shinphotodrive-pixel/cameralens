import React, { useEffect, useRef } from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from 'lucide-react';
import { CONFIG_CAMERAS, CONFIG_LENSES } from '../data/procurementData';
import type { PresetKey } from './OverviewSection';

interface SystemConfiguratorProps {
  cameraKey: string;
  lensKey: string;
  distance: number;
  onCameraChange: (val: string) => void;
  onLensChange: (val: string) => void;
  onDistanceChange: (val: number) => void;
  onApplyPreset: (preset: PresetKey) => void;
}

interface DiagnosticItem {
  type: 'ok' | 'warn' | 'danger' | 'info';
  label: string;
  text: string;
}

export const SystemConfigurator: React.FC<SystemConfiguratorProps> = ({
  cameraKey,
  lensKey,
  distance,
  onCameraChange,
  onLensChange,
  onDistanceChange,
  onApplyPreset,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const cam = CONFIG_CAMERAS[cameraKey] ?? CONFIG_CAMERAS.econ_24cug_board;
  const lens = CONFIG_LENSES[lensKey] ?? CONFIG_LENSES.arducam_m1812;

  const hfovRad = 2 * Math.atan(cam.w / (2 * lens.f));
  const vfovRad = 2 * Math.atan(cam.h / (2 * lens.f));
  const hfovDeg = (hfovRad * 180) / Math.PI;
  const vfovDeg = (vfovRad * 180) / Math.PI;

  const targetW = 2 * distance * Math.tan(hfovRad / 2);
  const targetH = 2 * distance * Math.tan(vfovRad / 2);

  const diagnostics: DiagnosticItem[] = [];

  // Strobe output diagnostics (primary requirement)
  if (cam.strobeSupport === 'official') {
    diagnostics.push({
      type: 'ok',
      label: '스트로브 공식 지원',
      text: cam.strobeDetail,
    });
  } else if (cam.strobeSupport === 'conditional') {
    diagnostics.push({
      type: 'warn',
      label: '스트로브 조건부 주의',
      text: cam.strobeDetail,
    });
  } else {
    diagnostics.push({
      type: 'danger',
      label: '스트로브 미지원',
      text: cam.strobeDetail,
    });
  }

  if (cam.usb2) {
    diagnostics.push({
      type: 'warn',
      label: '대역폭 주의',
      text: 'USB 2.0 인터페이스 한계: 1920×1200 비압축 전송 시 약 6~8fps로 제한되며, 고속 촬영 시 손실 압축(MJPEG)만 가능합니다.',
    });
  } else {
    diagnostics.push({
      type: 'ok',
      label: '대역폭 적합',
      text: 'USB 3.0 이상 고속 전송 지원: 비압축(UYVY/YUY2/RAW8) 고속 스트리밍이 가능합니다.',
    });
  }

  if (lens.unknownF) {
    diagnostics.push({
      type: 'warn',
      label: '사양 미기재',
      text: '조리개(F값) 사양 미기재: 공식 스펙상 F2.8 이상 여부를 확인할 수 없어 정밀 광학 설계 시 주의가 필요합니다.',
    });
  } else {
    diagnostics.push({
      type: 'ok',
      label: '조리개 충족',
      text: `조리개 사양(${lens.aperture}) 충족: F2.8 이상 조건을 만족하며 1/2.3" 이하 센서에서 비네팅 없이 동작합니다.`,
    });
  }

  if (lens.bulky && cam.isCase) {
    diagnostics.push({
      type: 'danger',
      label: '간섭 경고',
      text: '기구물 간섭 경고: Edmund Optics #33-878(외경 22mm, 길이 38mm)은 완제품 케이스 개구부와 간섭할 수 있으므로 보드형 바디를 선택하세요.',
    });
  } else if (cam.isCase && cameraKey !== 'elp_l12') {
    diagnostics.push({
      type: 'info',
      label: '기구 확인',
      text: '케이스 모델 유의: 기본 장착된 광각 렌즈를 탈거해야 하며, 12mm 렌즈 돌출 길이와 홀더 높이(10~13mm) 간섭 여부를 확인하세요.',
    });
  }

  if (lens.hasIrCut === 'no') {
    diagnostics.push({
      type: 'warn',
      label: 'IR 필터 없음',
      text: 'IR-Cut 필터 미포함 렌즈: 주간 컬러 촬영 시 적외선 유입으로 색감이 왜곡될 수 있습니다(야간 IR 조명용 적합).',
    });
  } else if (lens.hasIrCut === 'yes') {
    diagnostics.push({
      type: 'ok',
      label: 'IR-Cut 내장',
      text: '650nm IR-Cut 필터 내장: 주간 컬러 촬영 시 정확한 색 재현이 가능합니다.',
    });
  } else if (lens.hasIrCut === 'ir_corr') {
    diagnostics.push({
      type: 'ok',
      label: 'IR 초점 보정',
      text: 'IR 보정 광학계: 가시광선과 근적외선(850~940nm) 대역의 초점 이동이 보정된 렌즈입니다.',
    });
  } else {
    diagnostics.push({
      type: 'info',
      label: '필터 확인 필요',
      text: 'IR-Cut 필터 여부 미기재: 기존 기본 렌즈에서 필터가 분리되므로 주간 컬러 촬영 시 필터 유무를 판매처에 확인하세요.',
    });
  }

  if (cam.ndaa) {
    diagnostics.push({
      type: 'ok',
      label: 'NDAA 준수',
      text: 'NDAA 제889조 준수 모델로 공공·교통·보안 인프라 조달에 적합합니다.',
    });
  }

  useEffect(() => {
    const drawCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1;
      for (let x = 48; x < w; x += 48) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      const startX = 48;
      const centerY = h / 2;
      ctx.strokeStyle = '#334155';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(startX, centerY);
      ctx.lineTo(w - 20, centerY);
      ctx.stroke();
      ctx.setLineDash([]);

      const maxDrawDist = Math.max(120, w - 165);
      const drawDist = Math.max(64, (distance / 30) * maxDrawDist);
      const endX = startX + drawDist;
      const halfSpan = Math.min(h * 0.38, Math.tan(hfovRad / 2) * drawDist * 1.45);

      const grad = ctx.createLinearGradient(startX, centerY, endX, centerY);
      grad.addColorStop(0, 'rgba(37, 99, 235, 0.42)');
      grad.addColorStop(1, 'rgba(13, 148, 136, 0.16)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(startX, centerY);
      ctx.lineTo(endX, centerY - halfSpan);
      ctx.lineTo(endX, centerY + halfSpan);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#60A5FA';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(startX, centerY);
      ctx.lineTo(endX, centerY - halfSpan);
      ctx.moveTo(startX, centerY);
      ctx.lineTo(endX, centerY + halfSpan);
      ctx.stroke();

      ctx.strokeStyle = '#2DD4BF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(endX, centerY - halfSpan);
      ctx.lineTo(endX, centerY + halfSpan);
      ctx.stroke();

      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(startX - 18, centerY - 10, 18, 20);
      ctx.fillStyle = '#2563EB';
      ctx.fillRect(startX, centerY - 6, 6, 12);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = '600 11px "JetBrains Mono", monospace';
      ctx.fillText(`거리 ${distance.toFixed(1)}m`, startX + drawDist / 2 - 28, centerY - 8);

      ctx.fillStyle = '#2DD4BF';
      ctx.font = '700 12px "JetBrains Mono", monospace';
      ctx.fillText(`폭 ${targetW.toFixed(2)}m`, Math.min(endX + 10, w - 85), centerY + 4);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '500 11px Pretendard, sans-serif';
      ctx.fillText(`${cam.name} + ${lens.name}`, 12, h - 10);
    };

    drawCanvas();
    window.addEventListener('resize', drawCanvas);
    return () => window.removeEventListener('resize', drawCanvas);
  }, [cam.name, lens.name, distance, hfovRad, targetW]);

  const badgeStyles: Record<DiagnosticItem['type'], string> = {
    ok: 'bg-teal-50 border-teal-200 text-teal-950',
    warn: 'bg-amber-50 border-amber-200 text-amber-950',
    danger: 'bg-rose-50 border-rose-200 text-rose-950',
    info: 'bg-blue-50 border-blue-200 text-blue-950',
  };

  const renderIcon = (type: DiagnosticItem['type']) => {
    switch (type) {
      case 'ok':
        return <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />;
      case 'warn':
        return <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />;
      case 'danger':
        return <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" aria-hidden="true" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" aria-hidden="true" />;
    }
  };

  return (
    <section id="sec-configurator" className="scroll-mt-20">
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-semibold text-teal-700 mb-1">조합 및 화각 시뮬레이터</div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              카메라 바디 × 12mm 렌즈 조합 검증 및 스트로브 호환성 진단
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              조달 후보 카메라 바디와 12mm(또는 12.5mm) M12 렌즈를 선택하고 촬영 거리를 조절하여, 실제 화각(FOV), 목표 거리 촬영 영역, 그리고 조명 제어용 스트로브 출력·필터·기구 간섭 여부를 실시간으로 검증합니다.
            </p>
          </div>

          <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0 self-start lg:self-auto">
            <button
              type="button"
              onClick={() => onApplyPreset('arducam')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                cameraKey === 'econ_24cug_board' && lensKey === 'arducam_m1812'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              스트로브 가성비
            </button>
            <button
              type="button"
              onClick={() => onApplyPreset('industrial')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                cameraKey === 'basler_160' && lensKey === 'commonlands_cil125_irc'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              산업용 · 고속
            </button>
            <button
              type="button"
              onClick={() => onApplyPreset('elp')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                cameraKey === 'elp_p02' && lensKey === 'elp_stock'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ELP P02 비교
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Panel */}
          <div className="lg:col-span-5 space-y-5 bg-slate-50 p-5 rounded-lg border border-slate-200">
            <div>
              <label htmlFor="cfg-camera" className="block text-xs font-semibold text-slate-700 mb-1.5">
                1. 카메라 바디 선택
              </label>
              <select
                id="cfg-camera"
                value={cameraKey}
                onChange={(e) => onCameraChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              >
                <option value="econ_24cug_board">e-con See3CAM_24CUG 보드형 CH_TC (AR0234 / Pin5 STROBE / NDAA)</option>
                <option value="ids_u3">IDS uEye+ U3-3561XLS (AR0234 / 102fps / Pin3 Flash Out)</option>
                <option value="basler_160">Basler dart daA1920-160uc S-Mount (IMX392 / 160fps / ExposureActive)</option>
                <option value="alvium_u240">Allied Vision Alvium 1800 U-240 S-Mount (IMX392 / 176fps / GPIO)</option>
                <option value="tis_dfm37ux265">The Imaging Source DFM 37UX265-ML (IMX265 3.1MP / STROBE_OUT)</option>
                <option value="flir_bfs23s3">Teledyne FLIR BFS-U3-23S3-BD + M12홀더 (163fps / 옵토절연 Strobe)</option>
                <option value="econ_20cug">e-con See3CAM_20CUG 흑백 보드형 (OV2311 / 90fps / Strobe)</option>
                <option value="econ_24cug_case">e-con See3CAM_24CUG 케이스형 _BX (스트로브 미지원 주의)</option>
                <option value="elp_p02">ELP-USBGS1200P02-L12 (Flash 개정판 / USB 2.0 / F값 미상)</option>
                <option value="arducam_b0495">Arducam B0495 보드형 (국내즉시 / 기본 UVC 스트로브 미동작)</option>
                <option value="arducam_b0495c">Arducam B0495C 케이스형 (국내즉시 / 기본 UVC 스트로브 미동작)</option>
                <option value="elp_l12">ELP-USBGS1200P01-L12 구형 (USB 2.0 / 스트로브 미지원)</option>
              </select>
            </div>

            <div>
              <label htmlFor="cfg-lens" className="block text-xs font-semibold text-slate-700 mb-1.5">
                2. 12mm M12 렌즈 선택
              </label>
              <select
                id="cfg-lens"
                value={lensKey}
                onChange={(e) => onLensChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              >
                <option value="arducam_m1812">Arducam M1812ZH03S (12mm / F2.8 / 국내즉시 52,800원)</option>
                <option value="commonlands_cil125_irc">Commonlands CIL125 IRC (12.5mm / F3.6 / 650nm IR-Cut 내장 / $39)</option>
                <option value="commonlands_cil125_nir">Commonlands CIL125 NIR (12.5mm / F3.6 / 무필터 야간IR용 / $39)</option>
                <option value="edmund_33878">Edmund Optics #33-878 UCi (12mm / f/4.0 / IR필터 없음 / $270)</option>
                <option value="edmund_uav">Edmund Optics #56710 UAV (12mm / f/2.8 / 초저왜곡)</option>
                <option value="azure_ir">Azure Photonics IR1228B5M (12mm / F2.8 / IR 보정)</option>
                <option value="elp_stock">ELP 기본 동봉 12mm 옵션 렌즈 (F값 미기재)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="cfg-distance" className="text-xs font-semibold text-slate-700">
                  3. 피사체 촬영 거리 (m)
                </label>
                <span className="text-sm font-bold text-blue-700 font-mono-tabular">
                  {distance.toFixed(1)} m
                </span>
              </div>
              <input
                type="range"
                id="cfg-distance"
                min={2}
                max={30}
                step={0.5}
                value={distance}
                onChange={(e) => onDistanceChange(parseFloat(e.target.value))}
                className="w-full accent-blue-700 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1 font-mono-tabular">
                <span>2m (근거리)</span>
                <span>10m (표준)</span>
                <span>15m (원거리)</span>
                <span>30m</span>
              </div>
            </div>

            {/* Live Calculation Summary */}
            <dl className="bg-white rounded-lg p-4 border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500 shrink-0">탑재 센서 / 유효 크기</dt>
                <dd className="font-semibold text-slate-900 text-right font-mono-tabular">
                  {cam.sensor} ({cam.w.toFixed(2)}×{cam.h.toFixed(2)}mm)
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500 shrink-0">산출 화각 (HFOV × VFOV)</dt>
                <dd className="font-semibold text-blue-700 text-right font-mono-tabular">
                  {hfovDeg.toFixed(2)}° × {vfovDeg.toFixed(2)}° (f={lens.f}mm)
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500 shrink-0">설정 거리 촬영 영역</dt>
                <dd className="font-bold text-teal-700 text-right font-mono-tabular">
                  {targetW.toFixed(2)} m × {targetH.toFixed(2)} m (@{distance.toFixed(1)}m)
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500 shrink-0">조명 제어 스트로브 출력</dt>
                <dd
                  className={`font-semibold text-right ${
                    cam.strobeSupport === 'official'
                      ? 'text-teal-700'
                      : cam.strobeSupport === 'conditional'
                      ? 'text-amber-700'
                      : 'text-rose-700'
                  }`}
                >
                  {cam.strobeSupport === 'official'
                    ? '공식 지원 (노출 동기화)'
                    : cam.strobeSupport === 'conditional'
                    ? '조건부 (커스텀 FW/P02 확인)'
                    : '미지원'}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-slate-500 shrink-0">USB 전송 규격 및 속도</dt>
                <dd className="font-semibold text-slate-900 text-right">{cam.usb}</dd>
              </div>
              <div className="flex justify-between gap-2 pt-2 border-t border-slate-100">
                <dt className="text-slate-500 shrink-0">예상 바디 + 렌즈 단가</dt>
                <dd className="font-semibold text-slate-900 text-right font-mono-tabular">
                  {cam.priceEstimate} + {lens.priceEstimate}
                </dd>
              </div>
            </dl>
          </div>

          {/* Visual Cone Canvas & Engineering Diagnostics */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 rounded-lg p-4 text-white border border-slate-800">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-xs font-medium text-slate-300">
                  광학 화각(FOV) 및 촬영 폭 실시간 시각화 (평면도)
                </span>
                <span className="text-xs text-slate-400 font-mono-tabular">
                  Rectilinear 기준
                </span>
              </div>
              <div className="w-full h-52 sm:h-60 relative">
                <canvas
                  ref={canvasRef}
                  aria-label="선택된 카메라와 렌즈의 화각 및 거리별 촬영 폭 시각화"
                  className="w-full h-full rounded bg-slate-950 border border-slate-800 block"
                />
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h3 className="text-xs font-bold text-slate-800 mb-3">
                엔지니어링 호환성 및 스트로브 연동 진단
              </h3>
              <div className="space-y-2 text-xs">
                {diagnostics.map((d, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${badgeStyles[d.type]} flex items-start gap-2.5`}
                  >
                    {renderIcon(d.type)}
                    <div className="leading-relaxed">
                      <span className="font-bold mr-1.5">[{d.label}]</span>
                      <span>{d.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
