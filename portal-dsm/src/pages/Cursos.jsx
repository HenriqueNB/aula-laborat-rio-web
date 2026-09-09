import Card from "../components/Card";

const cursosData = [
  { id: 1, titulo: "Banco de Dados", descricao: "Modelagem e SQL." },
  { id: 2, titulo: "Desenvolvimento Web", descricao: "Aplicações para a web." },
  { id: 3, titulo: "Programação", descricao: "Lógica e desenvolvimento." },
];

function Cursos() {
  return (
    <main className="container">
      <h2>Cursos</h2>
      <section className="cards">
        {cursosData.map((curso) => (
          <Card
            key={curso.id}
            titulo={curso.titulo}
            descricao={curso.descricao}
          />
        ))}
      </section>
    </main>
  );
}

export default Cursos;