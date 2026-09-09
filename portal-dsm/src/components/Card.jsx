function Card({ titulo, descricao }) {
  return (
    <article className="card">
      <h3>{titulo}</h3>
      <p>{descricao}</p>
    </article>
  );
}
export default Card;