import request from "supertest";
import { CrearServidorTest } from "../serverTest.js";
import { ModeloComentario } from "../api_rest/model/ModeloComentario.js";
import { ModeloPublicacion } from "../api_rest/model/ModeloPublicacion.js";
import { ModeloAcceso } from "../api_rest/model/ModeloAcceso.js";

let servidor;
let app;
let tokenUsuario;
let tokenUsuario2;
let idUsuario;
let idUsuario2;
let idPublicacion;
let idComentarioCreado;

const usuarioPrueba1 = {
    correo: "comentario@test.com",
    contrasenia: "Password123!",
    nombreUsuario: "comentUser1",
    nombre: "Usuario",
    primerApellido: "Comentario",
    segundoApellido: "Test",
    idInstitucion: 1
};

const usuarioPrueba2 = {
    correo: "comentario@test.com",
    contrasenia: "Password123!",
    nombreUsuario: "comentUser2",
    nombre: "Usuario",
    primerApellido: "Comentario",
    segundoApellido: "Test2",
    idInstitucion: 1
};

const publicacionPrueba = {
    idCategoria: 1,
    resuContenido: "Esta es una publicación de prueba para comentarios",
    estado: "Aceptado",
    nivelEducativo: "Universidad",
    idMateriaYRama: 1,
    idDocumento: 3
};

beforeAll(async () => {
    const { app: appCreada, server: servidorCreado } = CrearServidorTest({
        ModeloComentario: ModeloComentario,
        ModeloPublicacion: ModeloPublicacion,
        ModeloAcceso: ModeloAcceso
    });
    servidor = servidorCreado;
    app = appCreada;
    
    // Registrar usuarios
    await request(servidor).post("/edushare/acceso/registro").send(usuarioPrueba1);
    await request(servidor).post("/edushare/acceso/registro").send(usuarioPrueba2);

    // Login de usuarios
    const loginResponse1 = await request(app)
        .post("/edushare/acceso/login")
        .send({ 
            identifier: usuarioPrueba1.correo, 
            contrasenia: usuarioPrueba1.contrasenia 
        });

    const loginResponse2 = await request(app)
        .post("/edushare/acceso/login")
        .send({ 
            identifier: usuarioPrueba2.correo, 
            contrasenia: usuarioPrueba2.contrasenia 
        });

    tokenUsuario = loginResponse1.body.token;
    idUsuario = loginResponse1.body.datos.idUsuario;
    tokenUsuario2 = loginResponse2.body.token;
    idUsuario2 = loginResponse2.body.datos.idUsuario;

    // Crear una publicación para usar en las pruebas
    const publicacionResponse = await request(app)
        .post("/edushare/publicacion")
        .set('Authorization', `Bearer ${tokenUsuario}`)
        .send(publicacionPrueba);

    if (publicacionResponse.statusCode === 201) {
        idPublicacion = publicacionResponse.body.id;
    } else {
        idPublicacion = 1;
    }

}, 100000);

afterAll(async () => {
    // Limpiar datos de prueba
    const cuentas = [
        { correo: usuarioPrueba1.correo, contrasenia: usuarioPrueba1.contrasenia },
        { correo: usuarioPrueba2.correo, contrasenia: usuarioPrueba2.contrasenia }
    ];

    for (const cuenta of cuentas) {
        await request(servidor).post("/edushare/acceso/eliminar").send(cuenta);
    }

    if (servidor && servidor.close) {
        await new Promise(resolve => servidor.close(resolve));
    }
}, 100000);

describe('Pruebas del módulo de comentarios', () => {
    
    test('Debería crear un comentario exitosamente', async () => {
        const comentarioData = {
            contenido: "Este es un comentario de prueba",
            idPublicacion: idPublicacion
        };

        const response = await request(app)
            .post("/edushare/comentario")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(comentarioData);
        
        if (response.statusCode === 500) {
            console.error('Error interno:', response.body);
        }

        expect(response.statusCode).toBe(201);
        expect(response.body.error).toBe(false);
        expect(response.body.mensaje).toBeDefined();
        
        // Guardar el ID del comentario para pruebas posteriores
        if (response.body.datos && response.body.datos.idComentario) {
            idComentarioCreado = response.body.datos.idComentario;
        }
    }, 100000);

    test('Debería fallar al crear comentario sin token', async () => {
        const comentarioData = {
            contenido: "Comentario sin autenticación",
            idPublicacion: idPublicacion
        };

        const response = await request(app)
            .post("/edushare/comentario")
            .send(comentarioData);
        
        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe(true);
        expect(response.body.mensaje).toContain('token');
    }, 100000);

    test('Debería fallar al crear comentario con datos inválidos', async () => {
        const comentarioInvalido = {
            contenido: "", // Contenido vacío
            idPublicacion: idPublicacion
        };

        const response = await request(app)
            .post("/edushare/comentario")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(comentarioInvalido);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(true);
    }, 100000);

    test('Debería fallar al crear comentario con contenido muy largo', async () => {
        const comentarioLargo = {
            contenido: "a".repeat(201), // Excede el límite de 200 caracteres
            idPublicacion: idPublicacion
        };

        const response = await request(app)
            .post("/edushare/comentario")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(comentarioLargo);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(true);
    }, 100000);

    test('Debería fallar al crear comentario con publicación inexistente', async () => {
        const comentarioConPublicacionInexistente = {
            contenido: "Comentario para publicación inexistente",
            idPublicacion: 99999 // ID inexistente
        };

        const response = await request(app)
            .post("/edushare/comentario")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(comentarioConPublicacionInexistente);
        
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe(true);
        expect(response.body.mensaje).toEqual("La publicación especificada no existe")
    }, 100000);

    test('Debería fallar al crear comentario sin campos requeridos', async () => {
        const comentarioIncompleto = {
            contenido: "Comentario sin ID de publicación"
            // Falta idPublicacion
        };

        const response = await request(app)
            .post("/edushare/comentario")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(comentarioIncompleto);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(true);
    }, 100000);

    test('Debería recuperar comentarios de una publicación exitosamente', async () => {
        const response = await request(app)
            .get(`/edushare/comentario/publicacion/${idPublicacion}`);
        
        if (response.statusCode === 500) {
            console.error('Error interno:', response.body);
        }

        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(false);
        expect(response.body.datos).toBeDefined();
        expect(Array.isArray(response.body.datos)).toBe(true);
    }, 100000);

    test('Debería fallar al recuperar comentarios de publicación inexistente', async () => {
        const response = await request(app)
            .get("/edushare/comentario/publicacion/99999");
        
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe(true);
        expect(response.body.mensaje).toContain('publicación');
    }, 100000);

    test('Debería fallar al recuperar comentarios con ID inválido', async () => {
        const response = await request(app)
            .get("/edushare/comentario/publicacion/abc");
        
        expect([400, 404]).toContain(response.statusCode);
        expect(response.body.error).toBe(true);
    }, 100000);


    test('Debería fallar al eliminar comentario sin token', async () => {
        const response = await request(app)
            .delete("/edushare/comentario/1");
        
        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe(true);
    }, 100000);

    test('Debería fallar al eliminar comentario de otro usuario', async () => {
        const comentarioData = {
            contenido: "Comentario del usuario 1",
            idPublicacion: idPublicacion
        };

        const createResponse = await request(app)
            .post("/edushare/comentario")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(comentarioData);

        let idComentarioAjeno;
        if (createResponse.body.datos && createResponse.body.datos.idComentario) {
            idComentarioAjeno = createResponse.body.datos.idComentario;
        } else {
            idComentarioAjeno = 1; // Usar un ID genérico
        }

        // Intentar eliminar con el segundo usuario
        const deleteResponse = await request(app)
            .delete(`/edushare/comentario/${idComentarioAjeno}`)
            .set('Authorization', `Bearer ${tokenUsuario2}`);
        
        expect(deleteResponse.statusCode).toBe(403);
        expect(deleteResponse.body.error).toBe(true);
        expect(deleteResponse.body.mensaje).toEqual("No cuentas con los permisos para esta acción");
    }, 100000);

    test('Debería fallar al eliminar comentario inexistente', async () => {
        const response = await request(app)
            .delete("/edushare/comentario/99999")
            .set('Authorization', `Bearer ${tokenUsuario}`);
        
        expect(response.statusCode).toBe(403);
        expect(response.body.error).toBe(true);
    }, 100000);

    test('Debería fallar al eliminar comentario con ID inválido', async () => {
        const response = await request(app)
            .delete("/edushare/comentario/abc")
            .set('Authorization', `Bearer ${tokenUsuario}`);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.mensaje).toContain('válido');
    }, 100000);

    test('Debería validar token JWT inválido', async () => {
        const comentarioData = {
            contenido: "Comentario con token inválido",
            idPublicacion: idPublicacion
        };

        const response = await request(app)
            .post("/edushare/comentario")
            .set('Authorization', 'Bearer token_invalido')
            .send(comentarioData);
        
        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe(true);
        expect(response.body.mensaje).toContain('inválido');
    }, 100000);

    test('Debería validar formato de autorización incorrecto', async () => {
        const comentarioData = {
            contenido: "Comentario con formato de auth incorrecto",
            idPublicacion: idPublicacion
        };

        const response = await request(app)
            .post("/edushare/comentario")
            .set('Authorization', 'InvalidFormat')
            .send(comentarioData);
        
        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe(true);
    }, 100000);

    test('Debería crear múltiples comentarios y recuperarlos ordenados', async () => {
        const comentarios = [
            { contenido: "Primer comentario", idPublicacion: idPublicacion },
            { contenido: "Segundo comentario", idPublicacion: idPublicacion },
            { contenido: "Tercer comentario", idPublicacion: idPublicacion }
        ];

        // Crear comentarios
        for (const comentario of comentarios) {
            await request(app)
                .post("/edushare/comentario")
                .set('Authorization', `Bearer ${tokenUsuario}`)
                .send(comentario);
        }

        // Recuperar comentarios
        const response = await request(app)
            .get(`/edushare/comentario/publicacion/${idPublicacion}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(false);
        expect(Array.isArray(response.body.datos)).toBe(true);
        expect(response.body.datos.length).toBeGreaterThanOrEqual(3);
        
        // Verificar que los comentarios incluyen información del usuario
        if (response.body.datos.length > 0) {
            expect(response.body.datos[0]).toEqual(
                expect.objectContaining({
                    idComentario: expect.any(Number),
                    contenido: expect.any(String),
                    fecha: expect.any(String),
                    idPublicacion: expect.any(Number),
                    idUsuarioRegistrado: expect.any(Number),
                    nombre: expect.any(String),
                    nombreUsuario: expect.any(String)
                })
            );
        }
    }, 100000);

    test('Debería manejar caracteres especiales en el contenido', async () => {
        const comentarioEspecial = {
            contenido: "Comentario con áéíóú ñÑ !@#$%^&*()_+-=[]{}|;':\",./<>?",
            idPublicacion: idPublicacion
        };

        const response = await request(app)
            .post("/edushare/comentario")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(comentarioEspecial);
        
        if (response.statusCode === 500) {
            console.error('Error interno:', response.body);
        }

        expect([201, 400]).toContain(response.statusCode);
        if (response.statusCode === 201) {
            expect(response.body.error).toBe(false);
        }
    }, 100000);

    test('Debería limitar el contenido exactamente a 200 caracteres', async () => {
        const contenido200 = "a".repeat(200); // Exactamente 200 caracteres
        const comentarioLimite = {
            contenido: contenido200,
            idPublicacion: idPublicacion
        };

        const response = await request(app)
            .post("/edushare/comentario")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(comentarioLimite);
        
        expect(response.statusCode).toBe(201);
        expect(response.body.error).toBe(false);
    }, 100000);
});