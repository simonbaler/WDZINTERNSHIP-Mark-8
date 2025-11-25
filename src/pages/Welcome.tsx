import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSiteSettingsStore } from '@/store/siteSettingsStore';

export default function Welcome() {
  const navigate = useNavigate();
  const location = useLocation();

  const storedUrl = useSiteSettingsStore((s) => s.welcomeVideoUrl);
  const videoSrc = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const srcParam = params.get('src');
    return srcParam || storedUrl || 'https://www.w3schools.com/html/mov_bbb.mp4';
  }, [location.search, storedUrl]);

  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  useEffect(() => {
    // Mark intro as shown for this session to avoid repeat redirects
    try {
      sessionStorage.setItem('INTRO_SHOWN', 'true');
    } catch {}

    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-black">
      {/* Fullscreen Video */}
      <video
        src={videoSrc}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />

      {/* Frame Overlay */}
      <div className="pointer-events-none absolute inset-0 m-4 rounded-2xl border-8 border-white/10 shadow-2xl" />

      {/* Info Overlay */}
      <div className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 text-white">
        <div className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-md text-sm">Intro • redirecting in {secondsLeft}s</div>
        <div className="w-[60%] h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/80 transition-all"
            style={{ width: `${((10 - secondsLeft) / 10) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}