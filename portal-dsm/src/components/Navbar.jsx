import { NavLink } from "react-router";

function Navbar() {
  return (
    <nav aria-label="Navegação principal">
      <NavLink to="/">Início</NavLink>
      <NavLink to="/alunos">Alunos</NavLink>
      <NavLink to="/cursos">Cursos</NavLink>
      <NavLink to="/sobre">Sobre</NavLink>
    </nav>
  );
}

export default Navbar;