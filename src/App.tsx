import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Topbar } from './components/Topbar';
import { BottomNav } from './components/BottomNav';
import { BootScreen } from './components/BootScreen';
import { FloatLayer } from './components/XpFloater';
import { Home } from './pages/Home';
import { MapPage } from './pages/MapPage';
import { Play } from './pages/Play';
import { MissionPage } from './pages/MissionPage';
import { Shop } from './pages/Shop';
import { Profile } from './pages/Profile';
import { Duel } from './pages/Duel';
import { Estafador } from './pages/Estafador';
import { Grandma } from './pages/Grandma';
import { Daily } from './pages/Daily';
import { Achievements } from './pages/Achievements';
import { Stats } from './pages/Stats';
import { DecisionsHub } from './pages/DecisionsHub';
import { DecisionPage } from './pages/DecisionPage';
import { DecisionsHistory } from './pages/DecisionsHistory';
import { DecisionsPending } from './pages/DecisionsPending';
import { DecisionsStats } from './pages/DecisionsStats';
import { ConsequenceToast } from './components/ConsequenceToast';
import { useProcessConsequencesOnMount } from './lib/useDelayedConsequences';

function useScrollToTop() {
  const loc = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [loc.pathname]);
}

function AppRoutes() {
  useScrollToTop();
  const loc = useLocation();
  // Procesa consecuencias retardadas en cada cambio de ruta.
  useProcessConsequencesOnMount();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={loc.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.25 }}
      >
        <Routes location={loc}>
          <Route path="/" element={<Home />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/play" element={<Play />} />
          <Route path="/play/:missionId" element={<MissionPage />} />
          <Route path="/play/daily/:idx" element={<MissionPage daily />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/duel" element={<Duel />} />
          <Route path="/estafador" element={<Estafador />} />
          <Route path="/grandma" element={<Grandma />} />
          <Route path="/daily" element={<Daily />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/decisions" element={<DecisionsHub />} />
          <Route path="/decisions/:id" element={<DecisionPage />} />
          <Route path="/decisions/history" element={<DecisionsHistory />} />
          <Route path="/decisions/pending" element={<DecisionsPending />} />
          <Route path="/decisions/stats" element={<DecisionsStats />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [booted, setBooted] = useState(() => sessionStorage.getItem('ph-booted') === '1');
  useEffect(() => {
    if (booted) return;
    const t = setTimeout(() => {
      sessionStorage.setItem('ph-booted', '1');
      setBooted(true);
    }, 3000);
    return () => clearTimeout(t);
  }, [booted]);

  return (
    <div className="min-h-full flex flex-col">
      <AnimatePresence>{!booted && <BootScreen onDone={() => setBooted(true)} />}</AnimatePresence>
      {booted && <FloatLayer />}
      {booted && <ConsequenceToast />}
      {booted && <Topbar />}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 pb-28 pt-4">
        {booted && <AppRoutes />}
      </main>
      {booted && <BottomNav />}
    </div>
  );
}
