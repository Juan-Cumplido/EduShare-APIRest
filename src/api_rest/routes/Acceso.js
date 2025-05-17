import express from 'express';
import { AccesoControlador } from '../controllers/AccesoControlador.js';


export const CrearRutaAcceso = ({ ModeloAcceso }) => {
    const router = express.Router();
    const ControladorAcceso = new AccesoControlador({ModeloAcceso});

    /**
     * @swagger
     * /edushare/acceso/registro:
     *   post:
     *     summary: Registra un nuevo usuario en el sistema
     *     tags: [Acceso]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - correo
     *               - contrasenia
     *               - nombreUsuario
     *               - nombre
     *               - primerApellido
     *               - idInstitucion
     *             properties:
     *               correo:
     *                 type: string
     *                 format: email
     *               contrasenia:
     *                 type: string
     *                 minLength: 8
     *               nombreUsuario:
     *                 type: string
     *                 minLength: 2
     *               nombre:
     *                 type: string
     *               primerApellido:
     *                 type: string
     *               segundoApellido:
     *                 type: string
     *                 nullable: true
     *               idInstitucion:
     *                 type: integer
     *     responses:
     *       200:
     *         description: Usuario registrado correctamente
     *       400:
     *         description: Datos de entrada inválidos
     *       409:
     *         description: El correo o nombre de usuario ya existe
     *       500:
     *         description: Error del servidor
     */
    router.post('/registro', ControladorAcceso.RegistrarAcceso);




    /**
     * @swagger
     * /edushare/acceso:
     *   get:
     *     summary: Obtiene información sobre las opciones de acceso
     *     tags: [Acceso]
     *     responses:
     *       200:
     *         description: Información obtenida correctamente
     */
    router.get('/', (req, res) => {
        res.status(200).json({
            mensaje: "API de acceso",
            endpoints: [
                { ruta: "/registro", metodo: "POST", descripcion: "Registro de nuevos usuarios" },
                { ruta: "/login", metodo: "POST", descripcion: "Inicio de sesión" }
            ]
        });
    });

    return router;
}