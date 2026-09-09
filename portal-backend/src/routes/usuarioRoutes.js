const express = require("express");
const router = express.Router();
const usuarioController =
    require("../controllers/usuarioController");
router.get(
    "/usuarios",
    usuarioController.listarUsuarios
);
router.get(
    "/usuarios/:id",
    usuarioController.buscarUsuario
);
router.post(
    "/usuarios",
    usuarioController.cadastrarUsuario
);
router.put(
    "/usuarios/:id",
    usuarioController.atualizarUsuario
);
router.delete(
    "/usuarios/:id",
    usuarioController.excluirUsuario
);

module.exports = router;