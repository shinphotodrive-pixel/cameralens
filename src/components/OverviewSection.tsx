import React from 'react';
import { ArrowRight } from 'lucide-react';

export type PresetKey = 'arducam' | 'industrial' | 'elp';

interface OverviewSectionProps {
  onApplyPreset: (preset: PresetKey) => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ onApplyPreset }) => {
  return (
    <section id="sec-overview" className="scroll-mt-20 space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-3">
          <span className="font-semibold text-blue-700">조달 분석 핵심 결론 · 스트로브 출력 재조사 반영</span>
          <span>요구 사양: ≥2MP · Global Shutter · USB · M12 · 12mm · ≥F2.8 · 조명용 Strobe Out</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3 max-w-4xl">
          스트로브 출력 포함 2MP+ 글로벌셔터 USB M12 카메라 재조사 및 최적 조달 전략
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl mb-8">
          조명 제어용{' '}
          <strong className="text-slate-900 font-semibold">하드웨어 스트로브 출력(Strobe / Flash Out)</strong>
          {' '}조건을 추가해 재조사한 결과, 12mm F2.8+ 렌즈가 기본 장착된 완제품 기성품은 여전히 부재하며(ELP P02 개정판은 F값 미기재·USB 2.0 한계), 기존 국내 즉시 조달 후보였던{' '}
          <strong className="text-slate-900 font-semibold">Arducam B0495는 기본 UVC 펌웨어가 프리런 전용이라 즉시 스트로브 출력이 불가</strong>
          함을 확인했습니다. 따라서 스트로브 동기화가 필수라면{' '}
          <strong className="text-slate-900 font-semibold">전용 STROBE/GPIO 출력을 공식 지원하는 보드형·S-Mount USB 3.0 산업용 바디 7종</strong>
          과 <strong className="text-slate-900 font-semibold">12mm F2.8 이상 M12 렌즈</strong>를 분리 조달해 결합해야 합니다.
        </p>

        {/* 4-Column Key Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-8 border-b border-slate-200">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="text-xs text-slate-500 font-medium mb-1">스트로브 공식 지원 바디</div>
            <div className="text-2xl font-bold text-blue-700 font-mono-tabular">7 종</div>
            <div className="text-xs text-slate-500 mt-1">e-con(보드형) · IDS · Basler · Alvium · TIS · FLIR</div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="text-xs text-slate-500 font-medium mb-1">전용 스트로브 신호 방식</div>
            <div className="text-2xl font-bold text-slate-900 font-mono-tabular">ExposureActive</div>
            <div className="text-xs text-slate-500 mt-1">센서 노출 구간 동기화 펄스(3.3V~5V/옵토)</div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="text-xs text-slate-500 font-medium mb-1">케이스형·UVC 보드 주의</div>
            <div className="text-2xl font-bold text-amber-700 font-mono-tabular">핀 미노출</div>
            <div className="text-xs text-slate-500 mt-1">See3CAM _BX 제외 · Arducam 커스텀 FW 필요</div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="text-xs text-slate-500 font-medium mb-1">USB 3.0 비압축 실효 대역폭</div>
            <div className="text-2xl font-bold text-teal-700 font-mono-tabular">~380 MB/s</div>
            <div className="text-xs text-slate-500 mt-1">무손실 고속 전송 + μs 단위 스트로브 동기화</div>
          </div>
        </div>

        {/* 3 Recommended Procurement Pathways */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6">
          <article className="rounded-lg border border-blue-200 bg-blue-50/40 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs mb-2">
                <span className="font-semibold text-blue-800">경로 A · 스트로브 가성비 최적</span>
                <span className="text-slate-500">UVC + 6핀 STROBE</span>
              </div>
              <h2 className="font-bold text-slate-900 text-base mb-2">
                e-con See3CAM_24CUG (보드형) + 12mm F2.8
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                6핀 GPIO 헤더의 Pin 5(STROBE)와 Pin 4(TRIG, 최대 6.5V)를 즉시 사용할 수 있으며 NDAA를 준수합니다. 케이스형(_BX)은 GPIO 핀이 없으므로 반드시 보드형(CH_TC/CHL_TC)에 M1812ZH03S 또는 CIL125를 결합하세요.
              </p>
            </div>
            <div className="pt-3 border-t border-blue-200/70 flex items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-slate-800 font-mono-tabular">예상 합산: $223 ~ $252</span>
              <button
                type="button"
                onClick={() => onApplyPreset('arducam')}
                className="inline-flex items-center gap-1 text-blue-700 font-semibold hover:text-blue-900 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>시뮬레이터 적용</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </article>

          <article className="rounded-lg border border-slate-200 bg-white p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs mb-2">
                <span className="font-semibold text-teal-800">경로 B · 머신비전 표준·초고속</span>
                <span className="text-slate-500">USB3 Vision · 102~176fps</span>
              </div>
              <h2 className="font-bold text-slate-900 text-base mb-2">
                Basler / IDS / Alvium / TIS / FLIR + M12 렌즈
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                GenICam/USB3 Vision 표준 `ExposureActive` 또는 옵토절연 `STROBE_OUT`을 공식 제공합니다. Basler daA1920-160uc(160fps), IDS U3-3561XLS(Pin 3 Flash), Alvium 1800 U-240(176fps), TIS DFM 37UX265-ML, FLIR BFS-U3-23S3-BD 중 선택할 수 있습니다.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-slate-800 font-mono-tabular">예상 합산: $328 ~ $926</span>
              <button
                type="button"
                onClick={() => onApplyPreset('industrial')}
                className="inline-flex items-center gap-1 text-teal-700 font-semibold hover:text-teal-900 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>시뮬레이터 적용</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </article>

          <article className="rounded-lg border border-amber-200 bg-amber-50/40 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs mb-2">
                <span className="font-semibold text-amber-800">경로 C · 조건부 대안 (사전 확인 필수)</span>
                <span className="text-slate-500">P02 개정판 vs Arducam FW</span>
              </div>
              <h2 className="font-bold text-slate-900 text-base mb-2">
                ELP-USBGS1200P02 / Arducam B0495
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                ELP는 구형 P01이 아닌 Flash Sync 핀이 추가된 <strong>P02 개정판</strong>을 지정해야 하며(USB 2.0·F값 미상), Arducam B0495는 내부 보드에 FLASH 패드가 있으나 <strong>별도 커스텀 펌웨어 요청</strong> 없이는 동작하지 않습니다.
              </p>
            </div>
            <div className="pt-3 border-t border-amber-200/70 flex items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-slate-800 font-mono-tabular">단품 가격: $65 ~ $184</span>
              <button
                type="button"
                onClick={() => onApplyPreset('elp')}
                className="inline-flex items-center gap-1 text-amber-800 font-semibold hover:text-amber-950 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>제약사항 확인</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
