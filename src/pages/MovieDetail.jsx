import { useParams } from "react-router-dom";

export default function MovieDetail() {
  const { id } = useParams();
  return (
    <section>
      <h1>Movie Detail</h1>
      <p>ID: {id}</p>
    </section>
  );
}
