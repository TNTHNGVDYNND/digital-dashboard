'use client';

import { useEffect, useState } from 'react';
import Preloader from './Preloader';
import { usePreloaderStore } from '@/store/preloader';

interface PreloaderWrapperProps {
  children: React.ReactNode;
}

export default function PreloaderWrapper({ children }: PreloaderWrapperProps) {
  const [showPreloader, setShowPreloader] = useState(false);
  const { hasLoaded, completeLoading } = usePreloaderStore();

  useEffect(() => {
    if (!hasLoaded) {
      setShowPreloader(true);
    }
  }, [hasLoaded]);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
    completeLoading();
  };

  return (
    <>
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}
      {children}
    </>
  );
}
