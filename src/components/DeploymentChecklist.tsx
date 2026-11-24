import React, { useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { CHECKLIST_ITEMS } from '../data/procurementData';

export const DeploymentChecklist: React.FC = () => {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setCheckedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const resetAll = () => {
    setCheckedIds({});
  };

  const completedCount = CHECKLIST_ITEMS.filter((item) => checkedIds[item.id]).length;

  return (
    <section id="sec-checklist" className="scroll-mt-20">
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-semibold text-amber-800 mb-1">조립 및 현장 도입 검증</div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              분리 조달 결합 및 현장 도입 전 4대 필수 점검 항목
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl">
              카메라 바디와 12mm M12 렌즈를 별도로 구매해 조립할 때 발생하는 색감 왜곡, 기구물 간섭, 조달 규정 위반 및 트리거 연동 오류를 사전에 방지하기 위한 체크리스트입니다. 각 항목을 클릭해 점검 완료 상태를 표시할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
            <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 text-right">
              <div className="text-xs text-slate-500 font-medium">점검 진행률</div>
              <div className="text-lg font-bold text-blue-700 font-mono-tabular">
                {completedCount} / {CHECKLIST_ITEMS.length} 완료
              </div>
            </div>
            {completedCount > 0 && (
              <button
                type="button"
                onClick={resetAll}
                title="체크리스트 초기화"
                aria-label="체크리스트 초기화"
                className="p-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CHECKLIST_ITEMS.map((item) => {
            const isChecked = !!checkedIds[item.id];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleItem(item.id)}
                aria-pressed={isChecked}
                className={`text-left rounded-lg border p-5 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                  isChecked
                    ? 'border-teal-600 bg-teal-50/40'
                    : 'border-slate-200 bg-slate-50/60 hover:border-blue-400'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isChecked
                        ? 'bg-teal-700 border-teal-700 text-white'
                        : 'border-slate-400 bg-white text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-blue-700">{item.indexLabel}</div>
                    <h3 className="font-bold text-slate-900 text-base mt-0.5">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                      {item.description}
                    </p>
                    <div className="mt-3 text-xs text-slate-500 font-mono-tabular">
                      핵심 키워드: {item.highlights.join(' · ')}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
