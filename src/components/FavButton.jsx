import { useEffect, useRef, useState } from "react";
import s from "./FavButton.module.css";


export default function FavButton({ active, onClick, title = "Toggle favorite" }) {
  const [play, setPlay] = useState(false);
  const prevActive = useRef(active);


  useEffect(() => {
    if (!prevActive.current && active) {
      setPlay(true);
      const t = setTimeout(() => setPlay(false), 350); 
      return () => clearTimeout(t);
    }
    prevActive.current = active;
  }, [active]);

  return (
    <button
      type="button"
      className={`${s.btn} ${active ? s.active : ""}`}
      onClick={onClick}
      aria-pressed={active}
      aria-label={title}
      title={title}
    >
      <svg
        viewBox="0 0 24 24"
        className={`${s.icon} ${play ? s.pop : ""}`}
        aria-hidden="true"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/>
      </svg>

     
      <span className={`${s.glow} ${play ? s.popGlow : ""}`} />
      <span className={`${s.spark} ${play ? s.popSpark : ""}`} />
    </button>
  );
}
