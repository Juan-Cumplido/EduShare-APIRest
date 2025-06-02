import request from "supertest";
import jwt from 'jsonwebtoken';
import { CrearServidorTest } from "../serverTest.js";
import { ModeloAcceso } from "../api_rest/model/Acceso.js";
import { ModeloPublicacion } from "../api_rest/model/ModeloPublicacion.js";

let servidor;
let app;
let tokenAdministrador;
let tokenUsuarioNormal;
let tokenUsuarioNormal2;
let idUsuarioNormal;
let idUsuarioNormal2;
let idPublicacionTest;

const correoAdministrador = "admin@test.com";
const contraseñaAdmin = "AdminPassword123!";
const correoUsuarioNormal = "usuario_normal@test.com";
const contraseñaUsuarioNormal = "UserPassword123!";
const correoUsuarioNormal2 = "usuario_normal2@test.com";
const contraseñaUsuarioNormal2 = "UserPassword123!";

beforeAll(async () => {
    const { app: appCreada, server: servidorCreado } = CrearServidorTest({
        ModeloAcceso: ModeloAcceso,
        ModeloPublicacion: ModeloPublicacion
    });
    servidor = servidorCreado;
    app = appCreada;

    // Crear cuenta administrador
    const datosAdmin = {
        "correo": correoAdministrador,
        "contrasenia": contraseñaAdmin,
        "nombreUsuario": "AdminUser",
        "nombre": "Administrador",
        "primerApellido": "Test",
        "segundoApellido": "Admin",
        "idInstitucion": 1,
    };

    await request(servidor).post("/edushare/acceso/registroAdmin").send(datosAdmin);

    // Crear primera cuenta usuario normal
    const datosUsuarioNormal = {
        "correo": correoUsuarioNormal,
        "contrasenia": contraseñaUsuarioNormal,
        "nombreUsuario": "UsuarioNormal",
        "nombre": "Usuario",
        "primerApellido": "Normal",
        "segundoApellido": "Test",
        "idInstitucion": 1
    };

    await request(servidor).post("/edushare/acceso/registro").send(datosUsuarioNormal);

    // Crear segunda cuenta usuario normal
    const datosUsuarioNormal2 = {
        "correo": correoUsuarioNormal2,
        "contrasenia": contraseñaUsuarioNormal2,
        "nombreUsuario": "UsuarioNormalDo",
        "nombre": "Usuario",
        "primerApellido": "Normal",
        "segundoApellido": "Test",
        "idInstitucion": 1
    };

   await request(servidor).post("/edushare/acceso/registro").send(datosUsuarioNormal2);

    // Hacer login para obtener tokens
    const loginAdmin = await request(servidor)
        .post("/edushare/acceso/login")
        .send({
            identifier: correoAdministrador,
            contrasenia: contraseñaAdmin
        });

    const loginUsuarioNormal = await request(servidor)
        .post("/edushare/acceso/login")
        .send({
            identifier: correoUsuarioNormal,
            contrasenia: contraseñaUsuarioNormal
        });

    const loginUsuarioNormal2 = await request(servidor)
        .post("/edushare/acceso/login")
        .send({
            identifier: correoUsuarioNormal2,
            contrasenia: contraseñaUsuarioNormal2
        });

    tokenAdministrador = loginAdmin.body.token;
    tokenUsuarioNormal = loginUsuarioNormal.body.token;
    tokenUsuarioNormal2 = loginUsuarioNormal2.body.token;
    idUsuarioNormal = loginUsuarioNormal.body.datos.idUsuario;
    idUsuarioNormal2 = loginUsuarioNormal2.body.datos.idUsuario;

    const datosPublicacion = {
        idCategoria: 1,
        resuContenido: "Contenido de prueba para testing",
        estado: "Aceptado",
        nivelEducativo: "Universidad",
        idMateriaYRama: 1,
        idDocumento: 3
    };

    const publicacionCreada = await request(servidor)
        .post("/edushare/publicacion/")
        .set('Authorization', `Bearer ${tokenUsuarioNormal}`)
        .send(datosPublicacion);

    idPublicacionTest = publicacionCreada.body.id

}, 100000);

afterAll(async () => {
    const cuentas = [
        { correo: correoAdministrador, contrasenia: contraseñaAdmin },
        { correo: correoUsuarioNormal, contrasenia: contraseñaUsuarioNormal },
        { correo: correoUsuarioNormal2, contrasenia: contraseñaUsuarioNormal2 }
    ];

    for (const cuenta of cuentas) {
        await request(servidor).post("/edushare/acceso/eliminar").send(cuenta);
    }

    if (servidor && servidor.close) {
        await new Promise(resolve => servidor.close(resolve));
    }
}, 100000);

describe('Middleware ValidarAdminOPropietario', () => {
    
    describe('Casos exitosos - Administrador', () => {
        test('Debe permitir acceso a administrador para cualquier recurso', async () => {
            const response = await request(servidor)
                .get(`/test/admin-propietario/${idPublicacionTest}`)
                .set('Authorization', `Bearer ${tokenAdministrador}`);

            expect(response.status).not.toBe(403);
            expect(response.status).not.toBe(401);
        }, 100000);

        test('Debe permitir acceso a administrador con ID en body', async () => {
            const response = await request(servidor)
                .put('/test/admin-propietario-body')
                .set('Authorization', `Bearer ${tokenAdministrador}`)
                .send({ id: idPublicacionTest });

            expect(response.status).not.toBe(403);
            expect(response.status).not.toBe(401);
        });
    }, 100000);

    describe('Casos exitosos - Propietario', () => {
        test('Debe permitir acceso al propietario del recurso', async () => {
            const response = await request(servidor)
                .get(`/test/admin-propietario/${idPublicacionTest}`)
                .set('Authorization', `Bearer ${tokenUsuarioNormal}`);

            expect(response.status).not.toBe(403);
            expect(response.status).not.toBe(401);
        }, 100000);

        test('Debe permitir acceso al propietario con ID en body', async () => {
            const response = await request(servidor)
                .put('/test/admin-propietario-body')
                .set('Authorization', `Bearer ${tokenUsuarioNormal}`)
                .send({ id: idPublicacionTest });

            expect(response.status).not.toBe(403);
            expect(response.status).not.toBe(401);
        });
    });

    describe('Casos de error - Autenticación', () => {
        test('Debe denegar acceso sin token de autenticación', async () => {
            const response = await request(servidor)
                .get(`/test/admin-propietario/${idPublicacionTest}`);

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                error: true,
                estado: 401,
                mensaje: 'No hay un token dentro de la solicitud'
            });
        }, 100000);

        test('Debe denegar acceso con token inválido', async () => {
            const tokenInvalido = 'token.invalido.aqui';
            
            const response = await request(servidor)
                .get(`/test/admin-propietario/${idPublicacionTest}`)
                .set('Authorization', `Bearer ${tokenInvalido}`);

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                error: true,
                estado: 401,
                mensaje: 'Token inválido'
            });
        }, 100000);

        test('Debe manejar middleware de autenticación no ejecutado', async () => {
            // Simular un caso donde req.idUsuario no es un número
            const tokenMalformado = jwt.sign(
                { idUsuario: "string_id", tipoUsuario: 'Usuario' },
                process.env.SECRETO_JWT,
                { expiresIn: '2h' }
            );

            const response = await request(servidor)
                .get(`/test/admin-propietario/${idPublicacionTest}`)
                .set('Authorization', `Bearer ${tokenMalformado}`);

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                error: true,
                estado: 401,
                mensaje: 'Autenticación inválida'
            });
        }, 100000);
    });

    describe('Casos de error - Parámetros', () => {
        test('Debe denegar acceso cuando falta ID del recurso en params', async () => {
            const response = await request(servidor)
                .get('/test/admin-propietario-sin-id')
                .set('Authorization', `Bearer ${tokenUsuarioNormal}`);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                error: true,
                estado: 400,
                mensaje: 'ID del recurso (id) es requerido'
            });
        }, 100000);

        test('Debe denegar acceso cuando falta ID del recurso en body', async () => {
            const response = await request(servidor)
                .put('/test/admin-propietario-body')
                .set('Authorization', `Bearer ${tokenUsuarioNormal}`)
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                error: true,
                estado: 400,
                mensaje: 'ID del recurso (id) es requerido'
            });
        }, 100000);
    });

    describe('Casos de error - Permisos', () => {
        test('Debe denegar acceso a usuario que no es admin ni propietario', async () => {
            const response = await request(servidor)
                .get(`/test/admin-propietario/${idPublicacionTest}`)
                .set('Authorization', `Bearer ${tokenUsuarioNormal2}`);

            expect(response.status).toBe(403);
            expect(response.body).toEqual({
                error: true,
                estado: 403,
                mensaje: 'No cuentas con los permisos para esta acción'
            });
        }, 100000);
    });

    test('Debe denegar acceso para recurso inexistente', async () => {
        const idInexistente = 99999;
        
        const response = await request(servidor)
            .get(`/test/admin-propietario/${idInexistente}`)
            .set('Authorization', `Bearer ${tokenUsuarioNormal}`);

        expect(response.status).toBe(403);
        expect(response.body).toEqual({
            error: true,
            estado: 403,
            mensaje: 'No cuentas con los permisos para esta acción'
        });
    }, 100000);

        test('Debe manejar error cuando el usuario no existe', async () => {
        const tokenInexistente = jwt.sign(
            { idUsuario: 99999, tipoUsuario: 'Usuario' },
            process.env.SECRETO_JWT,
            { expiresIn: '2h' }
        );

        const response = await request(servidor)
            .get(`/test/admin-propietario/${idPublicacionTest}`)
            .set('Authorization', `Bearer ${tokenInexistente}`);

        expect(response.status).toBe(403);
        expect(response.body).toEqual({
            error: true,
            estado: 403,
            mensaje: 'No cuentas con los permisos para esta acción'
        });
    }, 100000);

    describe('Casos de error - Manejo de excepciones', () => {
        test('Debe manejar errores de base de datos correctamente', async () => {
            // Simular un error forzando un ID de publicación que cause problemas en la BD
            const response = await request(servidor)
                .get('/test/admin-propietario/-1')
                .set('Authorization', `Bearer ${tokenUsuarioNormal}`);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                error: true,
                estado: 400,
                mensaje: 'ID del recurso debe ser un número válido'
            });
        }, 100000);
    });

    describe('Casos con campo personalizado', () => {
        test('Debe funcionar con campo de ID personalizado', async () => {
            const response = await request(servidor)
                .get(`/test/admin-propietario-custom/${idPublicacionTest}`)
                .set('Authorization', `Bearer ${tokenAdministrador}`);

            expect(response.status).not.toBe(403);
            expect(response.status).not.toBe(401);
        }, 100000);

        test('Debe denegar acceso cuando falta campo personalizado', async () => {
            const response = await request(servidor)
                .get('/test/admin-propietario-custom-sin-id')
                .set('Authorization', `Bearer ${tokenUsuarioNormal}`);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                error: true,
                estado: 400,
                mensaje: 'ID del recurso (idPublicacion) es requerido'
            });
        }, 100000);
    });

        test('Debe mantener consistencia entre params y body', async () => {
        const responseParams = await request(servidor)
            .get(`/test/admin-propietario/${idPublicacionTest}`)
            .set('Authorization', `Bearer ${tokenUsuarioNormal}`);

        const responseBody = await request(servidor)
            .put('/test/admin-propietario-body')
            .set('Authorization', `Bearer ${tokenUsuarioNormal}`)
            .send({ id: idPublicacionTest });

        expect(responseParams.status).toBe(responseBody.status);
    }, 100000);
});
