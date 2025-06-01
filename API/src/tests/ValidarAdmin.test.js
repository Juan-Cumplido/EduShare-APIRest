import request from "supertest";
import jwt from 'jsonwebtoken';
import { CrearServidorTest } from "../serverTest.js";
import { ModeloAcceso } from "../api_rest/model/Acceso.js";

let servidor;
let app;
let tokenAdministrador;
let tokenUsuarioNormal;
let idUsuarioNormal;
let idRecursoTest;

const correoAdministrador = "admin@test.com";
const contraseñaAdmin = "AdminPassword123!";
const correoUsuarioNormal = "usuario_normal@test.com";
const contraseñaUsuarioNormal = "UserPassword123!";

beforeAll(async () => {
    const { app: appCreada, server: servidorCreado } = CrearServidorTest({
        ModeloAcceso: ModeloAcceso
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

    // Crear cuenta usuario normal
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

    tokenAdministrador = loginAdmin.body.token;
    tokenUsuarioNormal = loginUsuarioNormal.body.token;
    idUsuarioNormal = loginUsuarioNormal.body.datos.idUsuario;
    idRecursoTest = 1; // ID de recurso para pruebas

}, 100000);

afterAll(async () => {
    const cuentas = [
        { correo: correoAdministrador, contrasenia: contraseñaAdmin },
        { correo: correoUsuarioNormal, contrasenia: contraseñaUsuarioNormal }
    ];

    for (const cuenta of cuentas) {
        await request(servidor).post("/edushare/acceso/eliminar").send(cuenta);
    }

    if (servidor && servidor.close) {
        await new Promise(resolve => servidor.close(resolve));
    }
}, 100000);

describe('Middleware ValidarAdmin', () => {
    
    describe('Casos exitosos', () => {
        test('Debe permitir acceso a usuario administrador', async () => {
            const response = await request(servidor)
                .get('/test/admin')
                .set('Authorization', `Bearer ${tokenAdministrador}`);

            expect(response.status).not.toBe(403);
            expect(response.status).not.toBe(401);
        }, 100000);
    });

    describe('Casos de error', () => {
        test('Debe denegar acceso a usuario normal', async () => {
            const response = await request(servidor)
                .get('/test/admin') 
                .set('Authorization', `Bearer ${tokenUsuarioNormal}`);


            console.log(response.status)
            console.log(response.body)
            
            expect(response.status).toBe(403);
            expect(response.body).toEqual({
                error: true,
                estado: 403,
                mensaje: 'No tiene permisos de administrador para realizar esta acción'
            });
            
        });

        test('Debe denegar acceso sin token de autenticación', async () => {
            const response = await request(servidor)
                .get('/test/admin');


            console.log(response.status)
            console.log(response.body)

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                error: true,
                estado: 401,
                mensaje: 'No hay un token dentro de la solicitud'
            });
        });

        test('Debe denegar acceso con token inválido', async () => {
            const tokenInvalido = 'token.invalido.aqui';
            
            const response = await request(servidor)
                .get('/test/admin')
                .set('Authorization', `Bearer ${tokenInvalido}`);

            console.log(response.status)
            console.log(response.body)

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                error: true,
                estado: 401,
                mensaje: 'Token inválido'
            });
        });

        test('Debe manejar error cuando el usuario no existe', async () => {
            // Crear token con ID de usuario inexistente
            const tokenInexistente = jwt.sign(
                { idUsuario: 99999, tipoUsuario: 'Usuario' },
                process.env.SECRETO_JWT,
                { expiresIn: '2h' }
            );

            const response = await request(servidor)
                .get('/test/admin')
                .set('Authorization', `Bearer ${tokenInexistente}`);

            console.log(response.status)
            console.log(response.body)

            expect(response.status).toBe(403);
            expect(response.body).toEqual({
                error: true,
                estado: 403,
                mensaje: 'No tiene permisos de administrador para realizar esta acción'
            });
        });
    }, 100000);
});

