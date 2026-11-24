import React, { useMemo, useState } from 'react';
import { ExternalLink, Search, RotateCcw } from 'lucide-react';
import { LENS_DATA, type LensTag } from '../data/procurementData';

type LensFilterType = 'all' | LensTag;

export const LensDatabase: React.FC = () => {
  const [filter, setFilter] = useState<LensFilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLenses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return LENS_DATA.filter((l) => {
      const matchesTag = filter === 'all' || l.tags.includes(filter);
      const matchesQuery =
        !q ||
        l.model.toLowerCase().includes(q) ||
        l.focalAperture.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        l.irCut.toLowerCase().includes(q);
      return matchesTag && matchesQuery;
    });
  }, [filter, searchQuery]);

  const filterButtons: { id: LensFilterType; label: string }[] = [
    { id: 'all', label: `전체 (${LENS_DATA.length})` },
    { id: 'f28', label: 'F/2.8 밝기' },
    { id: 'f36_40', label: 'F/3.6 ~ F/4.0 심도' },
    { id: 'ir', label: 'IR 보정·필터 선택' },
  ];

  return (
    <section id="sec-lenses" className="scroll-mt-20">
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-semibold text-teal-700 mb-1">광학 렌즈 데이터베이스 · 12mm M12 단초점</div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              12mm M12 마운트 F2.8 이상 렌즈 구매 URL 비교
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              1/2.3"~1/1" 이미지 서클을 지원하여 1/2.6"(AR0234), 1/2.3"(IMX392), 1/2.9"(OV2311/2312) 센서에서 비네팅 없이 동작하는 12mm급 M12 렌즈 목록입니다. 조리개 값과 IR-Cut 필터 유무에 따라 필터링할 수 있습니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="렌즈 모델·필터 검색..."
                aria-label="렌즈 모델명 또는 필터 검색"
                className="w-full sm:w-48 pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
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
                <th className="px-4 py-3 whitespace-nowrap">초점거리 / 조리개</th>
                <th className="px-4 py-3 whitespace-nowrap">지원 센서 / 해상도</th>
                <th className="px-4 py-3 whitespace-nowrap">IR-Cut 필터 여부</th>
                <th className="px-4 py-3 whitespace-nowrap">가격</th>
                <th className="px-4 py-3 whitespace-nowrap">구매 및 제품 URL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredLenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                    <p className="text-sm font-medium text-slate-700 mb-2">조건에 일치하는 렌즈 모델이 없습니다.</p>
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
                filteredLenses.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 align-top">
                      <div className="text-xs font-medium text-teal-700 mb-0.5">{l.category}</div>
                      <div className="font-bold text-slate-900">{l.model}</div>
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      <span className="font-bold text-slate-900 text-xs font-mono-tabular">
                        {l.focalAperture}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 align-top text-xs text-slate-700 font-mono-tabular">
                      {l.sensorFormat}
                    </td>
                    <td className="px-4 py-3.5 align-top text-xs text-slate-600">{l.irCut}</td>
                    <td className="px-4 py-3.5 align-top text-xs font-semibold text-slate-900 whitespace-nowrap font-mono-tabular">
                      {l.price}
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      <div className="flex flex-wrap gap-1.5">
                        {l.urls.map((u) => (
                          <a
                            key={u.url}
                            href={u.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-teal-200 bg-teal-50/70 text-teal-800 hover:bg-teal-700 hover:text-white hover:border-teal-700 text-xs font-medium whitespace-nowrap transition-colors"
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

        {/* Brighter Night-Vision Lens Callout */}
        <div className="mt-5 bg-teal-50/60 border border-teal-200 rounded-lg p-4 text-xs text-slate-700 leading-relaxed">
          <span className="font-bold text-teal-950 mr-1.5">야간 저조도 특화 대안 (F2.8보다 밝은 조리개가 필요한 경우):</span>
          Commonlands의 방수형{' '}
          <a
            href="https://commonlands.com/products/ip67-12mm-m12-lens-cil120"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 font-semibold underline hover:text-blue-900"
          >
            CIL120 (12.2mm, F/2.4, IP67, $39.00)
          </a>{' '}
          또는 가시광·850~940nm 적외선 초점 보정 모델인{' '}
          <a
            href="https://commonlands.com/products/ir-corrected-12mm-m12-lens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 font-semibold underline hover:text-blue-900"
          >
            CIL122 (12.0mm, F/2.0, $59.00)
          </a>
          가 대안이 되며, e-con Systems·IDS uEye XLS/LE·Basler dart S-Mount 카메라와 공식 호환됩니다.
        </div>
      </div>
    </section>
  );
};
