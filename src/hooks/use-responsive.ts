
import { useState, useEffect } from 'react';
import { useMediaQuery } from './use-media-query';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function useResponsive() {
  const isMobileQuery = useMediaQuery('(max-width: 767px)');
  const isTabletQuery = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktopQuery = useMediaQuery('(min-width: 1024px)');
  
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  
  useEffect(() => {
    if (isMobileQuery) {
      setDeviceType('mobile');
    } else if (isTabletQuery) {
      setDeviceType('tablet');
    } else if (isDesktopQuery) {
      setDeviceType('desktop');
    }
  }, [isMobileQuery, isTabletQuery, isDesktopQuery]);
  
  return {
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    deviceType
  };
}
