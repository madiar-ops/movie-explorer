import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function useQueryState() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const setQuery = useCallback(
    (next, options = {}) => {
      const merged = new URLSearchParams(location.search);
      Object.entries(next).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0)) {
          merged.delete(k);
        } else {
          merged.set(k, String(v));
        }
      });
      const search = `?${merged.toString()}`;
      if (options.replace) navigate({ search }, { replace: true });
      else navigate({ search });
    },
    [location.search, navigate]
  );

  return { params, setQuery };
}
