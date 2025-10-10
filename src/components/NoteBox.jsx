import s from "./NoteBox.module.css";

export default function NoteBox({ value, onChange }) {
  return (
    <div className={s.box}>
      <label className={s.label}>Your note:</label>
      <textarea
        className={s.textarea}
        value={value}
        placeholder="Write something about this movie..."
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
