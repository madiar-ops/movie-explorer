import { useAuth } from "../auth/AuthProvider";
import useUserData from "../store/userData";
import s from "./Profile.module.css";

function countNotes(notesObj) {
  if (!notesObj || typeof notesObj !== "object") return 0;
  return Object.values(notesObj)
    .filter((v) => (v ?? "").toString().trim().length > 0).length;
}

export default function Profile() {
  const { user, signOut } = useAuth();
  const { favorites, notes } = useUserData();

  const favCount = favorites instanceof Set ? favorites.size : (favorites?.length || 0);
  const notesCount = countNotes(notes);

  const display = user?.name || user?.username || "User";
  const subtitle = user?.username ? `@${user.username}` : "";

  const initial = (display[0] || "U").toUpperCase();

  return (
    <div className={s.wrap}>
      <div className={s.card}>
        <div className={s.row}>
          <div className={s.avatar} aria-hidden="true">{initial}</div>
          <div className={s.meta}>
            <div className={s.name}>{display}</div>
            {subtitle ? <div className={s.email}>{subtitle}</div> : null}
          </div>
        </div>

        <div className={s.metrics}>
          <div className={s.metric}>
            <div className={s.metricNum}>{favCount}</div>
            <div className={s.metricLabel}>Favorites</div>
          </div>
          <div className={s.metric}>
            <div className={s.metricNum}>{notesCount}</div>
            <div className={s.metricLabel}>Notes</div>
          </div>
        </div>

        <button className={s.signout} type="button" onClick={signOut}>
          Sign out
        </button>
      </div>
    </div>
  );
}
