import s from "./EmptyState.module.css";

export default function EmptyState({ message = "No movies found." }) {
  return (
    <div className={s.empty}>
      <div className={s.icon}>🎬</div>
      <p className={s.text}>{message}</p>
    </div>
  );
}
