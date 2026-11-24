import React, { useMemo, useState } from 'react';
import { ExternalLink, Search, RotateCcw, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { CAMERA_DATA, type CameraTag, type StrobeSupportLevel } from '../data/procurementData';

type FilterType = 'all' | CameraTag;

export const CameraDatabase: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('strobe');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCameras = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CAMERA_DATA.filter((c) => {
      const matchesTag = filter === 'all' || c.tags.includes(filter);
      const matchesQuery =
        !q ||
        c.model.toLowerCase().includes(q) ||
        c.sensor.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.strobeSpec.toLowerCase().includes(q) ||
        c.strobePinout.toLowerCase().includes(q);
      return matchesTag && matchesQuery;
    });
  }, [filter, searchQuery]);

  const strobeOfficialCount = CAMERA_DATA.filter((c) => c.strobeSupport === 'official').length;

  const filterButtons: { id: FilterType; label: string }[] = [
    { id: 'strobe', label: `스트로브 지원 (${CAMERA_DATA.filter((c) => c.tags.includes('strobe')).length})` },
    { id: 'all', label: `전체 (${CAMERA_DATA.length})` },
    { id: 'ndaa', label: 'NDAA 준수·산업용' },
    { id: 'usb3', label: 'USB 3.0 이상' },
    { id: 'korea', label: '국내 즉시 조달' },
  ];

  const renderStrobeBadge = (level: StrobeSupportLevel, spec: string) => {
    if (level === 'official') {
      return (
        <div className="inline-flex items-center gap-1.5 text-teal-800 font-semibold text-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0" aria-hidden="true" />
          <span>{spec}</span>
        </div>
      );
    }
    if (level === 'conditional') {
      return (
        <div className="inline-flex items-center gap-1.5 text-amber-800 font-semibold text-xs">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
          <span>{spec}</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-1.5 text-rose-700 font-semibold text-xs">
        <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" aria-hidden="true" />
        <span>{spec}</span>
      </div>
    );
  };

  return (
    <section id="sec-cameras" className="scroll-mt-20">
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-semibold text-blue-700 mb-1">
              카메라 데이터베이스 · 스트로브 출력 검증 완료 ({strobeOfficialCount}종 공식 지원)
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              스트로브 출력 지원 2MP+ 글로벌 셔터 USB M12 카메라 목록
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              2MP 이상, 글로벌 셔터, USB, M12(S-Mount) 호환 조건에 <strong>조명 제어용 하드웨어 스트로브(Strobe/Flash Out)</strong> 검증을 추가한 전체 조사 목록입니다. 기본 필터는 스트로브 지원 모델로 설정되어 있으며, 전체 탭에서 조건부 및 미지원 모델도 함께 비교할 수 있습니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="모델·스트로브 핀 검색..."
                aria-label="카메라 모델명, 센서 또는 스트로브 사양 검색"
                className="w-full sm:w-48 pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {filterButtons.map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setFilter(btn.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    filter === btn.id
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-700 font-semibold">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">구분 / 모델명</th>
                <th className="px-4 py-3 whitespace-nowrap">센서 / 해상도</th>
                <th className="px-4 py-3 whitespace-nowrap">USB / 최대 속도</th>
                <th className="px-4 py-3 whitespace-nowrap">조명 제어용 스트로브 출력 (핀/신호)</th>
                <th className="px-4 py-3 whitespace-nowrap">기본 렌즈 / M12</th>
                <th className="px-4 py-3 whitespace-nowrap">가격 범위</th>
                <th className="px-4 py-3 whitespace-nowrap">구매 및 제품 URL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredCameras.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                    <p className="text-sm font-medium text-slate-700 mb-2">조건에 일치하는 카메라 모델이 없습니다.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setFilter('all');
                        setSearchQuery('');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>필터 초기화</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredCameras.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 align-top min-w-[210px]">
                      <div className="text-xs font-medium text-blue-700 mb-0.5">{c.category}</div>
                      <div className="font-bold text-slate-900">{c.model}</div>
                    </td>
                    <td className="px-4 py-3.5 align-top text-slate-700 text-xs font-mono-tabular min-w-[170px]">
                      {c.sensor}
                    </td>
                    <td className="px-4 py-3.5 align-top min-w-[155px]">
                      <div className="text-xs font-medium text-slate-800">{c.usb}</div>
                      <div className="text-xs font-bold text-teal-700 mt-0.5 font-mono-tabular">{c.fps}</div>
                    </td>
                    <td className="px-4 py-3.5 align-top min-w-[230px]">
                      {renderStrobeBadge(c.strobeSupport, c.strobeSpec)}
                      <div className="text-xs text-slate-600 mt-1 leading-relaxed">{c.strobePinout}</div>
                    </td>
                    <td className="px-4 py-3.5 align-top text-xs text-slate-600 min-w-[160px]">{c.lensState}</td>
                    <td className="px-4 py-3.5 align-top text-xs font-semibold text-slate-900 whitespace-nowrap font-mono-tabular">
                      {c.price}
                    </td>
                    <td className="px-4 py-3.5 align-top min-w-[180px]">
                      <div className="flex flex-wrap gap-1.5">
                        {c.urls.map((u) => (
                          <a
                            key={u.url}
                            href={u.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-blue-200 bg-blue-50/70 text-blue-700 hover:bg-blue-700 hover:text-white hover:border-blue-700 text-xs font-medium whitespace-nowrap transition-colors"
                          >
                            <span>{u.label}</span>
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          </a>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Strobe & Model Confusion Warnings */}
        <div className="mt-5 bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 space-y-1.5 leading-relaxed">
          <div className="font-bold text-slate-900 mb-1">스트로브 연동 및 주문 시 모델 혼동 주의사항</div>
          <p>
            • <strong className="text-slate-800">e-con See3CAM 보드형 vs 케이스형 구분:</strong>{' '}
            <code className="bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded font-semibold font-mono-tabular">See3CAM_24CUG_CH_TC / CHL_TC</code> 및{' '}
            <code className="bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded font-semibold font-mono-tabular">See3CAM_20CUG_MHL_TC</code> 보드형만 물리적 GPIO/STROBE 헤더를 제공하며, 완제품 케이스형(<code>_BX</code>)은 외부 트리거·스트로브 핀을 지원하지 않습니다.
          </p>
          <p>
            • <strong className="text-slate-800">Arducam B0495 UVC 펌웨어 함정:</strong> 내부 센서 서브보드(UC-B65)에 6핀 솔더 패드(<code>FLASH/TRIGGER</code>)가 있으나 기본 출하 UVC 펌웨어는 프리런 전용으로 동작하므로, 스트로브 사용 시 Arducam 엔지니어링 지원을 통해 전용 커스텀 펌웨어와 1.8V/3.3V 레벨 시프터를 적용해야 합니다.
          </p>
          <p>
            • <strong className="text-slate-800">ELP 구형 P01 vs P02 개정판:</strong> 기존 <code>ELP-USBGS1200P01</code>은 외부 스트로브 헤더가 없으며, 외부 트리거 및 μs Flash Sync 출력이 필요하다면 반드시 <code>ELP-USBGS1200P02</code> 모델로 지정 주문해야 합니다(단, USB 2.0·F값 미기재).
          </p>
          <p>
            • <strong className="text-slate-800">Basler / TIS / FLIR 모델 구분:</strong> Basler <code className="bg-slate-200/80 px-1.5 py-0.5 rounded font-mono-tabular">daA1920-30uc</code>(30fps)가 아닌 <code>160uc/um</code>을 선택해야 하며, FLIR Blackfly S 보드형(<code>-BD</code>)은 <code>ACC-01-5006</code> S-Mount 홀더를 별도 결합해야 합니다. The Imaging Source의 AR0234 보드카메라 <code>DFM 37UR0234-ML</code>은 단종 예정(EoL)이므로 현행 <code>DFM 37UX265-ML</code>(3.1MP IMX265)을 권장합니다.
          </p>
        </div>
      </div>
    </section>
  );
};
