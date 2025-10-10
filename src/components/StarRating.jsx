import { useState } from "react";
import s from "./StarRating.module.css";

export default function StarRating({ value = 0, onChange }) {
  const [hover, setHover] = useState(0);

  return (
    <div className={s.wrap}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          viewBox="0 0 24 24"
          className={`${s.star} ${n <= value ? s.active : ""} ${n <= hover ? s.hovered : ""}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          aria-label={`${n} star`}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}
