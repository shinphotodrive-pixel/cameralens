import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { OverviewSection, type PresetKey } from './components/OverviewSection';
import { SystemConfigurator } from './components/SystemConfigurator';
import { CameraDatabase } from './components/CameraDatabase';
import { LensDatabase } from './components/LensDatabase';
import { PerformanceAnalytics } from './components/PerformanceAnalytics';
import { DeploymentChecklist } from './components/DeploymentChecklist';
import { QuoteComparison } from './components/QuoteComparison';

const SECTION_IDS = [
  'sec-overview',
  'sec-configurator',
  'sec-cameras',
  'sec-lenses',
  'sec-quote-compare',
  'sec-analytics',
  'sec-checklist',
];

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('sec-overview');
  const [cameraKey, setCameraKey] = useState<string>('econ_24cug_board');
  const [lensKey, setLensKey] = useState<string>('arducam_m1812');
  const [distance, setDistance] = useState<number>(10);

  const navigateTo = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyPreset = (preset: PresetKey) => {
    if (preset === 'arducam') {
      setCameraKey('econ_24cug_board');
      setLensKey('arducam_m1812');
    } else if (preset === 'industrial') {
      setCameraKey('basler_160');
      setLensKey('commonlands_cil125_irc');
    } else if (preset === 'elp') {
      setCameraKey('elp_p02');
      setLensKey('elp_stock');
    }
    navigateTo('sec-configurator');
  };

  const handleLoadToSimulator = (simCameraKey: string, simLensKey: string) => {
    setCameraKey(simCameraKey);
    setLensKey(simLensKey);
    navigateTo('sec-configurator');
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0.1, 0.3],
      }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header activeSection={activeSection} onNavigate={navigateTo} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <OverviewSection onApplyPreset={handleApplyPreset} />

        <SystemConfigurator
          cameraKey={cameraKey}
          lensKey={lensKey}
          distance={distance}
          onCameraChange={setCameraKey}
          onLensChange={setLensKey}
          onDistanceChange={setDistance}
          onApplyPreset={handleApplyPreset}
        />

        <CameraDatabase />

        <LensDatabase />

        <QuoteComparison onLoadToSimulator={handleLoadToSimulator} />

        <PerformanceAnalytics />

        <DeploymentChecklist />
      </main>

      <footer className="border-t border-slate-200 bg-white mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>2MP+ 글로벌 셔터 USB 카메라 및 12mm M12 렌즈 조달 기술 조사 가이드</div>
          <div>모든 외부 구매 링크는 새 탭에서 열립니다.</div>
        </div>
      </footer>
    </div>
  );
}
