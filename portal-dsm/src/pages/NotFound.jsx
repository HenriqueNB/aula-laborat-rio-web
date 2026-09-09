import { Link } from "react-router";

function NotFound() {
  return (
    <main className="container" style={{ textAlign: "center", padding: "3rem 1rem" }}>
      <h2 style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>404</h2>
      <p style={{ margin: "0 auto 1.5rem auto" }}>Ops! A página que você está procurando não foi encontrada.</p>
      <Link
        to="/"
        style={{
          display: "inline-block",
          backgroundColor: "var(--color-primary)",
          color: "#ffffff",
          padding: "10px 20px",
          borderRadius: "var(--radius-sm)",
          textDecoration: "none",
          fontWeight: "600",
        }}
      >
        Voltar para o Início
      </Link>
    </main>
  );
}

export default NotFound;
