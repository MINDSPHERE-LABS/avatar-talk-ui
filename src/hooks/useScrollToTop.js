import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollToTop = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Scroll to top smoothly when pathname changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);
};

export default useScrollToTop;