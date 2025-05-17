import express from 'express';
import {PublicacionControlador} from '../controllers/PublicacionControlador.js';

export const CrearRutaPublicacion = ({ ModeloPublicacion }) => {
    const router = express.Router();
    const controladorPublicacion = new PublicacionControlador({ ModeloPublicacion });

    /**
     * @swagger
     * /edushare/publicaciones:
     *   post:
     *     summary: Crea una nueva publicación
     *     tags: [Publicaciones]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - categoria
     *               - resuContenido
     *               - estado
     *               - nivelEducativo
     *               - idUsuarioRegistrado
     *               - idRama
     *               - idMateria
     *               - idDocumento
     *             properties:
     *               categoria:
     *                 type: string
     *               resuContenido:
     *                 type: string
     *               estado:
     *                 type: string
     *               nivelEducativo:
     *                 type: string
     *               idUsuarioRegistrado:
     *                 type: integer
     *               idRama:
     *                 type: integer
     *               idMateria:
     *                 type: integer
     *               idDocumento:
     *                 type: integer
     *     responses:
     *       201:
     *         description: Publicación creada exitosamente
     *       400:
     *         description: Error de validación
     *       500:
     *         description: Error del servidor
     */
    router.post('/', controladorPublicacion.CrearPublicacion);

    /**
     * @swagger
     * /edushare/publicaciones:
     *   get:
     *     summary: Obtiene todas las publicaciones
     *     tags: [Publicaciones]
     *     parameters:
     *       - in: query
     *         name: limite
     *         schema:
     *           type: number
     *         description: Límite de resultados
     *       - in: query
     *         name: pagina
     *         schema:
     *           type: number
     *         description: Número de página
     *       - in: query
     *         name: categoria
     *         schema:
     *           type: string
     *         description: Filtrar por categoría
     *       - in: query
     *         name: nivelEducativo
     *         schema:
     *           type: string
     *         description: Filtrar por nivel educativo
     *       - in: query
     *         name: idRama
     *         schema:
     *           type: number
     *         description: Filtrar por rama
     *       - in: query
     *         name: idMateria
     *         schema:
     *           type: number
     *         description: Filtrar por materia
     *     responses:
     *       200:
     *         description: Lista de publicaciones obtenida correctamente
     *       500:
     *         description: Error del servidor
     */
    router.get('/', controladorPublicacion.ObtenerPublicaciones);

    /**
     * @swagger
     * /edushare/publicaciones/{id}:
     *   get:
     *     summary: Obtiene una publicación por su ID
     *     tags: [Publicaciones]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Publicación encontrada
     *       404:
     *         description: Publicación no encontrada
     *       500:
     *         description: Error del servidor
     */
    router.get('/:id', controladorPublicacion.ObtenerPublicacionPorId);

    /**
     * @swagger
     * /edushare/publicaciones/{id}:
     *   put:
     *     summary: Actualiza una publicación existente
     *     tags: [Publicaciones]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               categoria:
     *                 type: string
     *               resuContenido:
     *                 type: string
     *               estado:
     *                 type: string
     *               nivelEducativo:
     *                 type: string
     *               idRama:
     *                 type: integer
     *               idMateria:
     *                 type: integer
     *     responses:
     *       200:
     *         description: Publicación actualizada correctamente
     *       400:
     *         description: Error de validación
     *       404:
     *         description: Publicación no encontrada
     *       500:
     *         description: Error del servidor
     */
    router.put('/:id', controladorPublicacion.ActualizarPublicacion);

    /**
     * @swagger
     * /edushare/publicaciones/{id}:
     *   delete:
     *     summary: Elimina una publicación
     *     tags: [Publicaciones]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Publicación eliminada correctamente
     *       400:
     *         description: Error de validación
     *       404:
     *         description: Publicación no encontrada
     *       500:
     *         description: Error del servidor
     */
    router.delete('/:id', controladorPublicacion.EliminarPublicacion);


    /**
     * @swagger
     * /edushare/publicaciones/{id}/like:
     *   post:
     *     summary: Incrementa el contador de likes de una publicación
     *     tags: [Publicaciones]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Contador de likes incrementado correctamente
     *       404:
     *         description: Publicación no encontrada
     *       500:
     *         description: Error del servidor
     */
    router.post('/:id/like', async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(parseInt(id))) {
                return res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: "ID de publicación inválido"
                });
            }
            
            const resultado = await ModeloPublicaciones.incrementarLike(parseInt(id));
            let estadoResultado = parseInt(resultado.resultado);
            
            if (estadoResultado === 500) {
                res.status(estadoResultado).json({
                    error: true,
                    estado: resultado.resultado,
                    mensaje: 'Ha ocurrido un error en la base de datos al incrementar el like'
                });
            } else if (estadoResultado === 404) {
                res.status(estadoResultado).json({
                    error: true,
                    estado: resultado.resultado,
                    mensaje: 'Publicación no encontrada'
                });
            } else {
                res.status(estadoResultado).json({
                    error: estadoResultado !== 200,
                    estado: resultado.resultado,
                    mensaje: resultado.mensaje
                });
            }
        } catch (error) {
            res.status(500).json({
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al incrementar el like."
            });
        }
    });

    return router;
}