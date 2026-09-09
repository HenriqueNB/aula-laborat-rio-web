import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:3000/usuarios";

function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  const [novoAluno, setNovoAluno] = useState({
    nome: "",
    email: "",
    telefone: "",
  });

  const carregarAlunos = async () => {
    setLoading(true);
    setErro(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }
      const dados = await response.json();
      setAlunos(Array.isArray(dados) ? dados : []);
    } catch (err) {
      console.error("Erro ao carregar alunos:", err);
      setErro("Não foi possível conectar ao servidor (http://localhost:3000). Verifique se o backend está em execução.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  const handleCadastrar = async (e) => {
    e.preventDefault();
    if (!novoAluno.nome.trim() || !novoAluno.email.trim()) {
      setFeedback({ type: "error", message: "Nome e e-mail são obrigatórios." });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoAluno),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Falha ao cadastrar aluno.");
      }

      setFeedback({ type: "success", message: `Aluno "${novoAluno.nome}" cadastrado com sucesso!` });
      setNovoAluno({ nome: "", email: "", telefone: "" });
      setShowForm(false);
      carregarAlunos();
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleExcluir = async (id, nome) => {
    const confirmar = window.confirm(`Tem certeza que deseja excluir o aluno "${nome}"?`);
    if (!confirmar) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.erro || "Erro ao excluir aluno.");
      }

      setFeedback({ type: "success", message: `Aluno "${nome}" removido com sucesso.` });
      setAlunos((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: err.message });
    }
  };

  const alunosFiltrados = alunos.filter((aluno) => {
    const termo = busca.toLowerCase();
    const nomeMatch = aluno.nome?.toLowerCase().includes(termo);
    const emailMatch = aluno.email?.toLowerCase().includes(termo);
    const telefoneMatch = aluno.telefone?.toLowerCase().includes(termo);
    return nomeMatch || emailMatch || telefoneMatch;
  });

  const getIniciais = (nome) => {
    if (!nome) return "AL";
    const partes = nome.trim().split(" ");
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  const formatarData = (dataIso) => {
    if (!dataIso) return null;
    try {
      const data = new Date(dataIso);
      return data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return null;
    }
  };

  return (
    <main className="container">
      {/* Cabeçalho */}
      <div className="alunos-header">
        <div className="alunos-header-info">
          <h2>Alunos do DSM</h2>
          <p>Listagem de alunos sincronizada diretamente com o banco de dados MySQL.</p>
          <div className={`badge-status ${erro ? "offline" : ""}`}>
            <span className={`pulse-dot ${erro ? "offline" : ""}`} />
            {erro ? "Backend Desconectado" : "MySQL Conectado"}
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setFeedback(null);
          }}
        >
          {showForm ? "✕ Fechar Formulário" : "+ Novo Aluno"}
        </button>
      </div>

      {/* Mensagem de Feedback */}
      {feedback && (
        <div className={`alert-box ${feedback.type}`}>
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            style={{ background: "none", border: "none", cursor: "pointer", fontWeight: "bold" }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Formulário de Cadastro (Expansível) */}
      {showForm && (
        <section className="form-card" aria-label="Cadastrar novo aluno">
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7.5" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            Cadastrar Novo Aluno
          </h3>

          <form onSubmit={handleCadastrar}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="nome">
                  Nome Completo <span>*</span>
                </label>
                <input
                  id="nome"
                  type="text"
                  className="form-input"
                  placeholder="Ex: Carlos Eduardo Silva"
                  value={novoAluno.nome}
                  onChange={(e) => setNovoAluno({ ...novoAluno, nome: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  E-mail <span>*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="Ex: carlos@fatec.sp.gov.br"
                  value={novoAluno.email}
                  onChange={(e) => setNovoAluno({ ...novoAluno, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefone">Telefone / WhatsApp</label>
                <input
                  id="telefone"
                  type="tel"
                  className="form-input"
                  placeholder="Ex: (16) 99888-7766"
                  value={novoAluno.telefone}
                  onChange={(e) => setNovoAluno({ ...novoAluno, telefone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowForm(false)}
                disabled={submitting}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner-sm" /> Salvando...
                  </>
                ) : (
                  "Confirmar Cadastro"
                )}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Barra de Ferramentas (Busca e Atualização) */}
      <div className="alunos-toolbar">
        <div className="search-wrapper">
          <span className="search-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="Pesquisar por nome, e-mail ou telefone..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="toolbar-actions">
          <span style={{ fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
            Total: <strong>{alunosFiltrados.length}</strong> {alunosFiltrados.length === 1 ? "aluno" : "alunos"}
          </span>

          <button
            type="button"
            className="btn btn-outline"
            onClick={carregarAlunos}
            title="Recarregar lista do banco de dados"
            disabled={loading}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ transform: loading ? "rotate(180deg)" : "none", transition: "transform 0.5s" }}
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Atualizar
          </button>
        </div>
      </div>

      {/* Conteúdo Principal (Loading / Erro / Cards) */}
      {loading ? (
        <div className="state-container">
          <div className="spinner" />
          <h3>Carregando alunos...</h3>
          <p>Consultando dados da tabela de usuários no MySQL.</p>
        </div>
      ) : erro ? (
        <div className="state-container">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h3>Erro ao carregar dados</h3>
          <p>{erro}</p>
          <button type="button" className="btn btn-primary" onClick={carregarAlunos}>
            Tentar Novamente
          </button>
        </div>
      ) : alunosFiltrados.length === 0 ? (
        <div className="state-container">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <h3>Nenhum aluno encontrado</h3>
          <p>
            {busca
              ? `Não foram encontrados alunos para a busca "${busca}".`
              : "Ainda não existem alunos cadastrados na tabela do banco de dados."}
          </p>
          {busca ? (
            <button type="button" className="btn btn-outline" onClick={() => setBusca("")}>
              Limpar Pesquisa
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Cadastrar Primeiro Aluno
            </button>
          )}
        </div>
      ) : (
        <section className="alunos-grid" aria-label="Lista de alunos">
          {alunosFiltrados.map((aluno) => (
            <article key={aluno.id} className="aluno-card">
              <div className="aluno-card-top">
                <div className="aluno-avatar" aria-hidden="true">
                  {getIniciais(aluno.nome)}
                </div>
                <div className="aluno-card-title">
                  <h3 title={aluno.nome}>{aluno.nome}</h3>
                  <span className="aluno-id-badge">ID #{aluno.id}</span>
                </div>
                <button
                  type="button"
                  className="btn-danger-ghost"
                  title={`Excluir ${aluno.nome}`}
                  onClick={() => handleExcluir(aluno.id, aluno.nome)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>
              </div>

              <div className="aluno-card-body">
                <div className="aluno-detail">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <a href={`mailto:${aluno.email}`} title="Enviar e-mail">
                    {aluno.email}
                  </a>
                </div>

                <div className="aluno-detail">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {aluno.telefone ? (
                    <a href={`tel:${aluno.telefone}`}>{aluno.telefone}</a>
                  ) : (
                    <span style={{ color: "#9ca3af", fontStyle: "italic" }}>Telefone não cadastrado</span>
                  )}
                </div>
              </div>

              <div className="aluno-card-footer">
                <span>DSM Web Portal</span>
                {aluno.criado_em && (
                  <span>Cadastrado em {formatarData(aluno.criado_em)}</span>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Alunos;