const usuarioModel = require("../models/usuarioModel");
async function listarUsuarios(req, res) {
    try {
        const usuarios = await usuarioModel.listarUsuarios();
        res.json(usuarios);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: "Erro ao listar usuários."
        });
    }
}
async function buscarUsuario(req, res) {
    try {
        const usuario = await usuarioModel.buscarUsuario(
            req.params.id
        );
        if (!usuario) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }
        res.json(usuario);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: "Erro ao buscar usuário."
        });
    }
}
async function cadastrarUsuario(req, res) {
    try {
        const { nome, email, telefone } = req.body;
     if (!nome || !email) {
            return res.status(400).json({
                erro: "Nome e e-mail são obrigatórios."
            });
        }
        const usuario = await usuarioModel.adicionarUsuario(
            nome,
            email,
            telefone
        );
        res.status(201).json(usuario);
    } catch (erro) {
        console.error(erro);
        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                erro: "E-mail já cadastrado."
            });
        }
        res.status(500).json({
            erro: "Erro ao cadastrar usuário."
        });
    }
}
async function atualizarUsuario(req, res) {
    try {
        const { nome, email, telefone } = req.body;
        if (!nome || !email) {
            return res.status(400).json({
                erro: "Nome e e-mail são obrigatórios."
            });
        }
        const usuario = await usuarioModel.atualizarUsuario(
            req.params.id,
            nome,
            email,
            telefone
        );
        if (!usuario) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }
        res.json(usuario);
    } catch (erro) {
        console.error(erro);
        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                erro: "E-mail já cadastrado."
            });
        }
        res.status(500).json({
            erro: "Erro ao atualizar usuário."
        });
    }
}
async function excluirUsuario(req, res) {
    try {
        const excluido = await usuarioModel.excluirUsuario(
            req.params.id
        );
         if (!excluido) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }
        res.json({
            mensagem: "Usuário excluído com sucesso."
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: "Erro ao excluir usuário."
        });
    }
}
module.exports = {
    listarUsuarios,
    buscarUsuario,
    cadastrarUsuario,
    atualizarUsuario,
    excluirUsuario
};