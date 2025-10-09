import { useEffect } from "react";

export default function useScrollTop(dep) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [dep]);
}
