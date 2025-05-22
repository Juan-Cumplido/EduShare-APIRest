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
     * /edushare/acceso/recuperarContrasena:
     *   post:
     *     summary: Inicia el proceso de recuperación de contraseña
     *     tags: [Acceso]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - correo
     *             properties:
     *               correo:
     *                 type: string
     *                 format: email
     *     responses:
     *       200:
     *         description: Código de verificación enviado correctamente
     *       400:
     *         description: Formato de correo inválido
     *       404:
     *         description: Correo no registrado
     *       500:
     *         description: Error del servidor
     */
    router.post('/recuperarContrasena', ControladorAcceso.RecuperarContrasena);

        /**
     * @swagger
     * /edushare/acceso/verificarCodigoYCambiarContrasena:
     *   post:
     *     summary: Verifica el código de recuperación y cambia la contraseña
     *     tags: [Acceso]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - correo
     *               - codigo
     *               - nuevaContrasenia
     *             properties:
     *               correo:
     *                 type: string
     *                 format: email
     *               codigo:
     *                 type: string
     *                 description: Código de verificación de 6 dígitos
     *               nuevaContrasenia:
     *                 type: string
     *                 minLength: 8
     *     responses:
     *       200:
     *         description: Contraseña actualizada correctamente
     *       400:
     *         description: Código incorrecto o formato inválido
     *       401:
     *         description: Código expirado
     *       404:
     *         description: No hay una solicitud de recuperación para este correo
     *       500:
     *         description: Error del servidor
     */ 
    router.post('/verificarCodigoYCambiarContrasena', ControladorAcceso.VerificarCodigoYCambiarContrasena);


     /**
     * @swagger
     * /edushare/acceso/login:
     *   post:
     *     summary: Permite loguear al usuario
     *     tags: [Acceso]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - identifier
     *               - contrasenia
     *             properties:
     *               identifier:
     *                 type: string
     *                 description: Correo electrónico o nombre de usuario
     *               contrasenia:
     *                 type: string
     *                 minLength: 8
     *     responses:
     *       200:
     *         description: Credenciales correctas
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                 estado:
     *                   type: integer
     *                 mensaje:
     *                   type: string
     *                 token:
     *                   type: string
     *                 datos:
     *                   type: object
     *                   properties:
     *                     idUsuario:
     *                       type: integer
     *                     nombre:
     *                       type: string
     *                     fotoPerfil:
     *                       type: string
     *       400:
     *         description: Datos de entrada inválidos
     *       401:
     *         description: Credenciales incorrectas
     *       403:
     *         description: Cuenta no activa
     *       500:
     *         description: Error del servidor
     */ 
    router.post('/login', ControladorAcceso.VerificarCredenciales);

    router.post('/eliminar', ControladorAcceso.EliminarCuenta);

    router.post('/banearUsuario', ValidarJwt, ControladorAcceso.BanearUsuario)

    return router;
}