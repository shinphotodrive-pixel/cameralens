import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { SENSOR_FOV_REFERENCE } from '../data/procurementData';

Chart.register(...registerables);

type FovMode = 'deg' | 'dist';

export const PerformanceAnalytics: React.FC = () => {
  const [fovMode, setFovMode] = useState<FovMode>('deg');
  const fovCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const bwCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fovChartRef = useRef<Chart | null>(null);
  const bwChartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const fovEl = fovCanvasRef.current;
    if (!fovEl) return;

    fovChartRef.current?.destroy();

    const datasets =
      fovMode === 'deg'
        ? [
            {
              label: '수평 화각 HFOV (°)',
              data: [26.99, 30.86, 22.62],
              backgroundColor: '#1D4ED8',
              borderRadius: 4,
            },
            {
              label: '수직 화각 VFOV (°)',
              data: [17.06, 19.57, 18.46],
              backgroundColor: '#0F766E',
              borderRadius: 4,
            },
            {
              label: '대각 화각 DFOV (°)',
              data: [31.61, 36.06, 28.9],
              backgroundColor: '#64748B',
              borderRadius: 4,
            },
          ]
        : [
            {
              label: '거리 10m 촬영 폭 (m)',
              data: [4.8, 5.52, 4.0],
              backgroundColor: '#1D4ED8',
              borderRadius: 4,
            },
            {
              label: '거리 15m 촬영 폭 (m)',
              data: [7.2, 8.28, 6.0],
              backgroundColor: '#0F766E',
              borderRadius: 4,
            },
          ];

    fovChartRef.current = new Chart(fovEl, {
      type: 'bar',
      data: {
        labels: [
          'onsemi AR0234CS (1/2.6")',
          'Sony IMX392 (1/2.3")',
          'OmniVision OV2311/12 (1/2.9")',
        ],
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: { size: 11, family: 'Pretendard, sans-serif' },
              color: '#334155',
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                `${ctx.dataset.label}: ${ctx.parsed.y}${fovMode === 'deg' ? '°' : 'm'}`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: '#E2E8F0' },
            ticks: { color: '#475569', font: { size: 11 } },
          },
          x: {
            grid: { display: false },
            ticks: { color: '#334155', font: { size: 11 } },
          },
        },
      },
    });

    return () => {
      fovChartRef.current?.destroy();
    };
  }, [fovMode]);

  useEffect(() => {
    const bwEl = bwCanvasRef.current;
    if (!bwEl) return;

    bwChartRef.current?.destroy();

    bwChartRef.current = new Chart(bwEl, {
      type: 'bar',
      data: {
        labels: [
          ['USB 2.0 비압축', '(See3CAM 실측)'],
          ['USB 2.0 비압축', '(이론 한계)'],
          ['USB 3.0 비압축', '(UYVY/YUY2 실측)'],
          ['USB 3.0 비압축', '(UYVY 이론 한계)'],
          ['USB 2.0 손실압축', '(ELP MJPEG)'],
          ['USB 3.0 비압축', '(Basler RAW8)'],
        ],
        datasets: [
          {
            label: '최대 프레임 속도 (fps @1920×1200)',
            data: [6, 8.0, 55, 86.5, 90, 160],
            backgroundColor: [
              '#DC2626',
              '#F87171',
              '#1D4ED8',
              '#3B82F6',
              '#D97706',
              '#0F766E',
            ],
            borderRadius: 4,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `최대 속도: ${ctx.parsed.x} fps`,
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Frames Per Second (fps)',
              font: { size: 11, family: 'Pretendard, sans-serif' },
              color: '#475569',
            },
            grid: { color: '#E2E8F0' },
            ticks: { color: '#475569', font: { size: 11 } },
          },
          y: {
            grid: { display: false },
            ticks: { color: '#334155', font: { size: 11 } },
          },
        },
      },
    });

    return () => {
      bwChartRef.current?.destroy();
    };
  }, []);

  return (
    <section id="sec-analytics" className="scroll-mt-20">
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
        <div className="mb-6">
          <div className="text-xs font-semibold text-blue-700 mb-1">정량 성능 분석 · 광학 화각 및 전송 대역폭 비교</div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            센서 포맷별 12mm 화각 차이 및 USB 2.0 vs 3.0 대역폭 병목 분석
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-4xl">
            동일한 12mm 초점거리 렌즈를 사용하더라도 이미지 센서의 물리적 유효 크기에 따라 화각과 원거리 촬영 폭이 달라집니다. 또한 1920×1200 해상도를 비압축으로 고속 전송하기 위해 왜 USB 3.0 이상의 인터페이스가 필수적인지 정량 데이터로 비교합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Sensor FOV & Target Width */}
          <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h3 className="font-bold text-slate-900 text-base">
                  센서별 12mm 화각(°) 및 거리별 촬영 폭(m)
                </h3>
                <div className="inline-flex rounded-lg bg-slate-200 p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setFovMode('deg')}
                    className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      fovMode === 'deg'
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    화각 (°)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFovMode('dist')}
                    className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      fovMode === 'dist'
                        ? 'bg-white text-slate-900 shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    촬영 폭 (m)
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                직교 저왜곡 렌즈 기준 (FOV = 2 × arctan(d / 2f), f = 12.0mm). 버튼으로 각도와 거리별 촬영 폭을 전환해 보세요.
              </p>
            </div>

            <div className="relative w-full h-72 sm:h-80">
              <canvas ref={fovCanvasRef} />
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900">핵심 인사이트:</strong> 1/2.3" Sony IMX392(Basler)는 수평 화각 30.86°로 가장 넓게(15m 거리 8.28m 폭) 포착하며, 1/2.9" OV2311/2312는 22.62°로 가장 협각(망원) 효과를 냅니다.
            </div>
          </div>

          {/* Chart 2: USB Bandwidth & FPS Bottleneck */}
          <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h3 className="font-bold text-slate-900 text-base">
                  1920×1200 전송 포맷별 최대 프레임 속도 (fps)
                </h3>
                <span className="text-xs font-semibold text-blue-700">USB 2.0 vs USB 3.0</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                비압축 16-bit(UYVY/YUY2) 60fps 전송에는 2,211.8 Mbps(263.7 MiB/s) 대역폭이 필요해 USB 2.0(실효 ~35 MB/s)에서는 한계에 봉착합니다.
              </p>
            </div>

            <div className="relative w-full h-72 sm:h-80">
              <canvas ref={bwCanvasRef} />
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900">핵심 인사이트:</strong> USB 2.0 기반 ELP 카메라는 90fps 달성을 위해 손실 압축(MJPEG)에 의존하는 반면, USB 3.0 카메라는 비압축 UYVY를 실측 50~60fps, 8-bit RAW8을 100~160fps로 무손실 전송합니다.
            </div>
          </div>
        </div>

        {/* Compact Sensor FOV Reference Table */}
        <div className="mt-6 overflow-x-auto custom-scrollbar border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-semibold">
              <tr>
                <th className="px-4 py-2.5 whitespace-nowrap">센서 (광학 포맷)</th>
                <th className="px-4 py-2.5 whitespace-nowrap">대표 적용 카메라</th>
                <th className="px-4 py-2.5 whitespace-nowrap">유효 센서 크기 (H×V)</th>
                <th className="px-4 py-2.5 whitespace-nowrap text-right">수평 화각 (HFOV)</th>
                <th className="px-4 py-2.5 whitespace-nowrap text-right">수직 화각 (VFOV)</th>
                <th className="px-4 py-2.5 whitespace-nowrap text-right">대각 화각 (DFOV)</th>
                <th className="px-4 py-2.5 whitespace-nowrap text-right">거리 10m 폭</th>
                <th className="px-4 py-2.5 whitespace-nowrap text-right">거리 15m 폭</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {SENSOR_FOV_REFERENCE.map((row) => (
                <tr key={row.sensor} className="hover:bg-slate-50/70">
                  <td className="px-4 py-2.5 font-semibold text-slate-900 whitespace-nowrap">{row.sensor}</td>
                  <td className="px-4 py-2.5 text-slate-600">{row.cameras}</td>
                  <td className="px-4 py-2.5 font-mono-tabular whitespace-nowrap">{row.dimensions}</td>
                  <td className="px-4 py-2.5 font-semibold text-blue-700 text-right font-mono-tabular">{row.hfov}</td>
                  <td className="px-4 py-2.5 text-right font-mono-tabular">{row.vfov}</td>
                  <td className="px-4 py-2.5 text-right font-mono-tabular">{row.dfov}</td>
                  <td className="px-4 py-2.5 font-semibold text-right font-mono-tabular">{row.width10m}</td>
                  <td className="px-4 py-2.5 font-semibold text-right font-mono-tabular">{row.width15m}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
