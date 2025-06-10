import request from "supertest";
import { CrearServidorTest } from "../serverTest.js";
import { ModeloPerfil } from "../api_rest/model/ModeloPerfil.js";
import { ModeloAcceso } from "../api_rest/model/ModeloAcceso.js";

let servidor;
let app;
let tokenUsuario;
let idUsuario;
let idUsuario2;

const usuarioPrueba = {
    correo: "perfilp@test.com",
    contrasenia: "Password123!",
    nombreUsuario: "perfilppUser",
    nombre: "Usuario",
    primerApellido: "Perfil",
    segundoApellido: "Test",
    idInstitucion: 1
};

const usuarioPrueba2 = {
    correo: "petest@test.com",
    contrasenia: "Password123!",
    nombreUsuario: "ptestppUser",
    nombre: "Usuario",
    primerApellido: "Perfil",
    segundoApellido: "Test",
    idInstitucion: 1
};

beforeAll(async () => {
    const { app: appCreada, server: servidorCreado } = CrearServidorTest({
        ModeloPerfil: ModeloPerfil,
        ModeloAcceso: ModeloAcceso
    });
    servidor = servidorCreado;
    app = appCreada;
    
    await request(servidor).post("/edushare/acceso/registro").send(usuarioPrueba);
    await request(servidor).post("/edushare/acceso/registro").send(usuarioPrueba2);

    const loginResponse = await request(app)
        .post("/edushare/acceso/login")
        .send({ 
            identifier: usuarioPrueba.correo, 
            contrasenia: usuarioPrueba.contrasenia 
    });

    const loginResponse2 = await request(app)
        .post("/edushare/acceso/login")
        .send({ 
            identifier: usuarioPrueba2.correo, 
            contrasenia: usuarioPrueba2.contrasenia 
    });

    tokenUsuario = loginResponse.body.token;
    idUsuario = loginResponse.body.datos.idUsuario;
    idUsuario2 = loginResponse2.body.datos.idUsuario;

}, 100000);

afterAll(async () => {

    const cuentas = [
        { correo: usuarioPrueba.correo, contrasenia: usuarioPrueba.contrasenia},
        {correo: usuarioPrueba2.correo, contrasenia: usuarioPrueba2.contrasenia},
        { correo: "novots@test.com", contrasenia: "Password123!" }
    ];

    for (const cuenta of cuentas) {
        await request(servidor).post("/edushare/acceso/eliminar").send(cuenta);
    }

    if (servidor && servidor.close) {
        await new Promise(resolve => servidor.close(resolve));
    }
}, 100000);

describe('Pruebas del perfil de usuario', () => {
    
    test('Debería obtener el perfil propio exitosamente', async () => {
        const response = await request(app)
            .get("/edushare/perfil/me")
            .set('Authorization', `Bearer ${tokenUsuario}`);
        
        if (response.statusCode === 500) {
            console.error('Error interno:', response.body);
        }

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            error: false,
            estado: 200,
            mensaje: expect.any(String),
            datos: expect.objectContaining({
                idUsuarioRegistrado: expect.any(Number),
                nombre: expect.any(String),
                primerApellido: expect.any(String),
                correo: expect.any(String),
                nombreUsuario: expect.any(String)
            })
        });
    }, 100000);

    test('Debería fallar al obtener perfil sin token', async () => {
        const response = await request(app)
            .get("/edushare/perfil/me");
        
        expect(response.statusCode).toBe(401);
    }, 100000);

    test('Debería obtener el perfil con id exitosamente', async () => {
        const response = await request(app)
            .get(`/edushare/perfil/${idUsuario2}`)
        
        if (response.statusCode === 500) {
            console.error('Error interno:', response.body);
        }

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            error: false,
            estado: 200,
            mensaje: expect.any(String),
            datos: expect.objectContaining({
                idUsuarioRegistrado: expect.any(Number),
                nombre: expect.any(String),
                primerApellido: expect.any(String),
                nombreUsuario: expect.any(String),
                fotoPerfil: expect.any(String),
                idInstitucion: expect.any(Number),

            })
        });
    }, 100000);

    test('Debería actualizar el perfil exitosamente', async () => {
        const datosActualizacion = {
            nombre: "NuevoNombre",
            primerApellido: "NuevoApellido",
            segundoApellido: "SegundoApellido",
            correo: "novots@test.com",
            nombreUsuario: "novosUserio",
            idInstitucion: 2
        };

        const response = await request(app)
            .put("/edushare/perfil/me")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(datosActualizacion);
        
        if (response.statusCode === 500) {
            console.error('Error interno:', response.body);
        }

        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(false);
        expect(response.body.mensaje).toBeDefined();
    }, 100000);

    test('Debería fallar al actualizar perfil con datos inválidos', async () => {

        const institucionNegativa = -1
        const nombreUsuarioIncorrecto = "a"
        const nombreVacío = ""
        const correoInvalido = "correo-invalido"
        const apellidoInvalido = "123"

        const datosInvalidos = {
            nombre: nombreVacío, 
            primerApellido: apellidoInvalido, 
            correo: correoInvalido, 
            nombreUsuario: nombreUsuarioIncorrecto, 
            idInstitucion: institucionNegativa 
        };

        const response = await request(app)
            .put("/edushare/perfil/me")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(datosInvalidos);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.mensaje).toBeDefined();
    }, 100000);

    test('Debería fallar al actualizar perfil con institución inexistente', async () => {

        const institucionInexistente = 9999

        const datosConInstitucionInexistente = {
            nombre: "Nombre",
            primerApellido: "Apellido",
            segundoApellido: null,
            correo: "test@valid.com",
            nombreUsuario: "validUser",
            idInstitucion: institucionInexistente 
        };

        const response = await request(app)
            .put("/edushare/perfil/me")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(datosConInstitucionInexistente);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(true);
    }, 100000);

    test('Debería actualizar el avatar exitosamente', async () => {
        const datosAvatar = {
            datos: {
                fotoPerfil: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
            }
        };

        const response = await request(app)
            .put("/edushare/perfil/me/avatar")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(datosAvatar);

        if (response.statusCode === 500) {
            console.error('Error interno:', response.body);
        }
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(false);
    }, 100000);

    test('Debería fallar al actualizar avatar con datos inválidos', async () => {
        const rutaVacía = ""

        const datosAvatarInvalidos = {
            datos: {
                fotoPerfil: rutaVacía 
            }
        };

        const response = await request(app)
            .put("/edushare/perfil/me/avatar")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(datosAvatarInvalidos);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.mensaje).toBeDefined();
    }, 100000);

    test('Debería fallar al actualizar avatar sin datos', async () => {
        const response = await request(app)
            .put("/edushare/perfil/me/avatar")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send({});
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(true);
    }, 100000);

    test('Debería fallar al actualizar perfil sin token', async () => {
        const datosActualizacion = {
            nombre: "Nombre",
            primerApellido: "Apellido",
            correo: "test@test.com",
            nombreUsuario: "testuser",
            idInstitucion: 1
        };

        const response = await request(app)
            .put("/edushare/perfil/me")
            .send(datosActualizacion);
        
        expect(response.statusCode).toBe(401);
    }, 100000);

    test('Debería fallar al actualizar avatar sin token', async () => {
        const datosAvatar = {
            datos: {
                fotoPerfil: "data:image/jpeg;base64,test"
            }
        };

        const response = await request(app)
            .put("/edushare/perfil/me/avatar")
            .send(datosAvatar);
        
        expect(response.statusCode).toBe(401);
    }, 100000);

    test('Debería validar campos requeridos en actualización de perfil', async () => {
        const datosFaltantes = {
            nombre: "Nombre"
            // Faltan campos requeridos
        };

        const response = await request(app)
            .put("/edushare/perfil/me")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(datosFaltantes);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(true);
        expect(response.body.mensaje).toBeDefined();
    }, 100000);

    test('Debería validar longitud máxima de campos', async () => {
        const datosLargos = {
            nombre: "a".repeat(50), // Excede el máximo de 30
            primerApellido: "Apellido",
            segundoApellido: null,
            correo: "test@test.com",
            nombreUsuario: "testuser",
            idInstitucion: 1
        };

        const response = await request(app)
            .put("/edushare/perfil/me")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(datosLargos);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(true);
    }, 100000);

    test('Debería validar formato de email', async () => {
        const datosEmailInvalido = {
            nombre: "Nombre",
            primerApellido: "Apellido",
            segundoApellido: null,
            correo: "email-sin-arroba",
            nombreUsuario: "testuser",
            idInstitucion: 1
        };

        const response = await request(app)
            .put("/edushare/perfil/me")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(datosEmailInvalido);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(true);
    }, 100000);
});