import request from "supertest";
import { CrearServidorTest } from "../serverTest.js";
import { ModeloNotificacion } from "../api_rest/model/ModeloNotificacion.js";
import { ModeloAcceso } from "../api_rest/model/ModeloAcceso.js";

let servidor;
let app;
let tokenUsuario;
let tokenUsuario2;
let idUsuario;
let idUsuario2;

const usuarioPrueba = {
    correo: "notif@test.com",
    contrasenia: "Password123!",
    nombreUsuario: "notifUser",
    nombre: "UserJ",
    primerApellido: "Notificacion",
    segundoApellido: "Test",
    idInstitucion: 1
};

const usuarioPrueba2 = {
    correo: "notif2@test.com",
    contrasenia: "Password123!",
    nombreUsuario: "notif2User",
    nombre: "UserK",
    primerApellido: "Notificacion",
    segundoApellido: "Test",
    idInstitucion: 1
};

beforeAll(async () => {
    const { app: appCreada, server: servidorCreado } = CrearServidorTest({
        ModeloNotificacion: ModeloNotificacion,
        ModeloAcceso: ModeloAcceso
    });
    servidor = servidorCreado;
    app = appCreada;
    
    await request(servidor).post("/edushare/acceso/registro").send(usuarioPrueba);
    await request(servidor).post("/edushare/acceso/registro").send(usuarioPrueba2);

    const loginResponse = await request(app).post("/edushare/acceso/login").send({ 
        identifier: usuarioPrueba.correo, contrasenia: usuarioPrueba.contrasenia 
    });

    const loginResponse2 = await request(app).post("/edushare/acceso/login").send({ 
        identifier: usuarioPrueba2.correo, contrasenia: usuarioPrueba2.contrasenia 
    });

    tokenUsuario = loginResponse.body.token;
    idUsuario = loginResponse.body.datos.idUsuario;
    tokenUsuario2 = loginResponse2.body.token;
    idUsuario2 = loginResponse2.body.datos.idUsuario;

}, 100000);

afterAll(async () => {
    const cuentas = [
        { correo: usuarioPrueba.correo, contrasenia: usuarioPrueba.contrasenia },
        { correo: usuarioPrueba2.correo, contrasenia: usuarioPrueba2.contrasenia }
    ];

    for (const cuenta of cuentas) {
        await request(servidor).post("/edushare/acceso/eliminar").send(cuenta);
    }

    if (servidor && servidor.close) {
        await new Promise(resolve => servidor.close(resolve));
    }
}, 100000);

describe('Pruebas del módulo de notificaciones', () => {
    
    test('Debería registrar una notificación exitosamente', async () => {
        const datosNotificacion = {
            usuarioDestinoId: idUsuario2,
            titulo: "Nueva notificación de prueba",
            mensajeNotificacion: "Este es un mensaje de prueba para la notificación",
            tipo: "Seguimiento"
        };

        const response = await request(app)
            .post("/edushare/notificacion")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(datosNotificacion);
        
        if (response.statusCode === 500) {
            console.error('Error interno:', response.body);
        }

        expect(response.statusCode).toBe(201);
        expect(response.body.error).toBe(false);
        expect(response.body.mensaje).toEqual("Notificación registrada exitosamente")

        
    }, 100000);

    test('Debería fallar al registrar notificación sin token', async () => {
        const datosNotificacion = {
            usuarioDestinoId: idUsuario2,
            titulo: "Notificación sin token",
            mensajeNotificacion: "Mensaje de prueba",
            tipo: "Seguimiento"
        };

        const response = await request(app)
            .post("/edushare/notificacion")
            .send(datosNotificacion);
        
        expect(response.statusCode).toBe(401);
    }, 100000);

    test('Debería fallar al registrar notificación con datos inválidos', async () => {
        const datosInvalidos = {
            usuarioDestinoId: "no-es-numero", // Tipo inválido
            titulo: "", // Título vacío
            mensajeNotificacion: "", // Mensaje vacío
            tipo: "TipoInvalido" // Tipo no permitido
        };

        const response = await request(app)
            .post("/edushare/notificacion")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(datosInvalidos);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.mensaje).toBeDefined();
    }, 100000);

    test('Debería fallar con usuarioDestinoId negativo', async () => {
        const datosInvalidos = {
            usuarioDestinoId: -1,
            titulo: "Título válido",
            mensajeNotificacion: "Mensaje válido",
            tipo: "Seguimiento"
        };

        const response = await request(app)
            .post("/edushare/notificacion")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(datosInvalidos);

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(true);
    }, 100000);

    test('Debería fallar con título muy largo', async () => {
        const datosInvalidos = {
            usuarioDestinoId: idUsuario2,
            titulo: "a".repeat(256), 
            mensajeNotificacion: "Mensaje válido",
            tipo: "Seguimiento"
        };

        const response = await request(app)
            .post("/edushare/notificacion")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(datosInvalidos);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(true);
    }, 100000);

    test('Debería validar todos los tipos de notificación permitidos', async () => {
        const tiposValidos = ['Seguimiento', 'Nuevo_Documento', 'Chat'];
        
        for (const tipo of tiposValidos) {
            const datosNotificacion = {
                usuarioDestinoId: idUsuario2,
                titulo: `Notificación tipo ${tipo}`,
                mensajeNotificacion: `Mensaje para tipo ${tipo}`,
                tipo: tipo
            };

            const response = await request(app)
                .post("/edushare/notificacion")
                .set('Authorization', `Bearer ${tokenUsuario}`)
                .send(datosNotificacion);
            
            expect(response.statusCode).toBe(201);
        }
    }, 100000);

    test('Debería fallar con campos requeridos faltantes', async () => {
        const datosFaltantes = {
            titulo: "Solo título"
            // Faltan campos requeridos
        };

        const response = await request(app)
            .post("/edushare/notificacion")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(datosFaltantes);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.mensaje).toBeDefined();
    }, 100000);

    test('Debería obtener notificaciones propias exitosamente', async () => {
        const datosNotificacion = {
            usuarioDestinoId: idUsuario,
            titulo: "Notificación para obtener",
            mensajeNotificacion: "Mensaje de notificación para obtener",
            tipo: "Nuevo_Documento"
        };

        await request(app)
            .post("/edushare/notificacion")
            .set('Authorization', `Bearer ${tokenUsuario2}`)
            .send(datosNotificacion);

        const response = await request(app)
            .get("/edushare/notificacion")
            .set('Authorization', `Bearer ${tokenUsuario}`);
        
        if (response.statusCode === 500) {
            console.error('Error interno:', response.body);
        }

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            error: false,
            estado: 200,
            mensaje: expect.any(String),
            datos: expect.any(Array)
        });

        if (response.body.datos.length > 0) {
            expect(response.body.datos[0]).toEqual(
                expect.objectContaining({
                    Id: expect.any(Number),
                    UsuarioDestinoId: expect.any(Number),
                    Titulo: expect.any(String),
                    Mensaje: expect.any(String),
                    UsuarioOrigenId: expect.any(Number),
                    Tipo: expect.any(String),
                    FechaCreacion: expect.any(String)
                })
            );
        }
    }, 100000);

    test('Debería fallar al obtener notificaciones sin token', async () => {
        const response = await request(app)
            .get("/edushare/notificacion");
        
        expect(response.statusCode).toBe(401);
    }, 100000);

    test('Debería manejar correctamente cuando no hay notificaciones', async () => {
        const response = await request(app)
            .get("/edushare/notificacion")
            .set('Authorization', `Bearer ${tokenUsuario2}`);
        
        expect([200, 404]).toContain(response.statusCode);
        
        if (response.statusCode === 200) {
            expect(response.body.datos).toEqual(expect.any(Array));
        } else if (response.statusCode === 404) {
            expect(response.body.error).toBe(true);
            expect(response.body.mensaje).toBeDefined();
        }
    }, 100000);

    test('Debería registrar múltiples notificaciones para el mismo usuario', async () => {
        const notificaciones = [
            {
                usuarioDestinoId: idUsuario2,
                titulo: "Primera notificación múltiple",
                mensajeNotificacion: "Primer mensaje",
                tipo: "Seguimiento"
            },
            {
                usuarioDestinoId: idUsuario2,
                titulo: "Segunda notificación múltiple",
                mensajeNotificacion: "Segundo mensaje",
                tipo: "Chat"
            }
        ];

        for (const notificacion of notificaciones) {
            const response = await request(app)
                .post("/edushare/notificacion")
                .set('Authorization', `Bearer ${tokenUsuario}`)
                .send(notificacion);
            
            expect(response.statusCode).toBe(201);
        }

        const response = await request(app)
            .get("/edushare/notificacion")
            .set('Authorization', `Bearer ${tokenUsuario2}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.datos.length).toBeGreaterThan(0);
    }, 100000);
});