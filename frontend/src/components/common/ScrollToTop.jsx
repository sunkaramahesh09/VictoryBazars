import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop — scrolls the window to the top on every route change.
 * Without this, React Router preserves the scroll position from the
 * previous page when navigating (e.g. scrolled to footer on Shop,
 * clicks About → About opens at the footer position).
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
