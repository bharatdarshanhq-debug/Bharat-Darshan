import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Utility component that scrolls the window to the top on route change.
 * @returns {null} This component doesn't render anything.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
