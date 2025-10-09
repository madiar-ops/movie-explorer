import s from "./Skeleton.module.css";

export function SkeletonCard() {
  return (
    <div className={s.skelCard}>
      <div className={s.poster} />
      <div className={s.body}>
        <div className={s.line} style={{ width: "70%", height: 14 }} />
        <div className={s.line} style={{ width: "40%" }} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />);
}
