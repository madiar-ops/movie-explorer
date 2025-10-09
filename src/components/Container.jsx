import s from "./Container.module.css";

export default function Container({ children }) {
  return <main className={s.root}>{children}</main>;
}
