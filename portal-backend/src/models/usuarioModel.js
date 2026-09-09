const pool = require("../config/database");
async function listarUsuarios() {
    const [usuarios] = await pool.query(
        "SELECT * FROM usuarios ORDER BY id"
    );
    return usuarios;
}
async function buscarUsuario(id) {
    const [usuarios] = await pool.query(
        "SELECT * FROM usuarios WHERE id = ?",
        [id]
    );
    return usuarios[0];
}
async function adicionarUsuario(nome, email, telefone) {
    const [resultado] = await pool.query(
        `INSERT INTO usuarios (nome, email, telefone)
         VALUES (?, ?, ?)`,
        [nome, email, telefone]
    );
    return {
        id: resultado.insertId,
        nome,
        email,
        telefone
    };
}
async function atualizarUsuario(id, nome, email, telefone) {
    const [resultado] = await pool.query(
        `UPDATE usuarios
         SET nome = ?, email = ?, telefone = ?
         WHERE id = ?`,
        [nome, email, telefone, id]
    );
    if (resultado.affectedRows === 0) {
        return null;
    }
    return buscarUsuario(id);
}
async function excluirUsuario(id) {
    const [resultado] = await pool.query(
        "DELETE FROM usuarios WHERE id = ?",
        [id]
    );
    return resultado.affectedRows > 0;
}
module.exports = {
    listarUsuarios,
    buscarUsuario,
    adicionarUsuario,
    atualizarUsuario,
    excluirUsuario
};