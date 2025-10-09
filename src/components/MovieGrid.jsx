import s from "./MovieGrid.module.css";

export default function MovieGrid({ children }) {
  return <div className={s.grid}>{children}</div>;
}
