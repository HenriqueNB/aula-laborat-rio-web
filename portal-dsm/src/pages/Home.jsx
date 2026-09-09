import React from 'react';

export default function Home() {
  return (
    <main className="container">
      <h2>Mural de Avisos</h2>
      <p>Fique por dentro das últimas atualizações, eventos e recados da nossa escola.</p>
      
      <div className="notice-board-container">
        <div className="animated-cards">
          
          <div className="animated-card">
            <h3>📢 Reunião de Pais</h3>
            <p>Lembramos que nesta sexta-feira às 19h teremos a reunião bimestral no auditório principal. A presença de todos é fundamental!</p>
          </div>
          
          <div className="animated-card">
            <h3>🔬 Feira de Ciências</h3>
            <p>As inscrições para a 5ª Feira de Ciências se encerram no próximo dia 15. Organize sua equipe e traga seu projeto.</p>
          </div>
          
          <div className="animated-card">
            <h3>📚 Aulas de Reforço</h3>
            <p>Novos horários foram disponibilizados para as monitorias de Matemática e Física. Inscreva-se na secretaria.</p>
          </div>

        </div>
      </div>
    </main>
  );
}