import request from "supertest";
import { CrearServidorTest } from "../serverTest.js";
import { ModeloAcceso } from "../api_rest/model/Acceso.js";

let servidor;
let app;
let codigoRecuperacion;
const correoRecuperacionPrueba = "zS22013636@estudiantes.uv.mx"
const contraseñaCorreoPrueba = "PasswordSeguro123!"

beforeAll(async () => {
    const { app: appCreada, server: servidorCreado } = CrearServidorTest({
        ModeloAcceso: ModeloAcceso
    });
    servidor = servidorCreado;
    app = appCreada;

    const datosCuenta = 
    {
        "correo": correoRecuperacionPrueba,
        "contrasenia": contraseñaCorreoPrueba,
        "nombreUsuario": "Romeo",
        "nombre": "Romeo",
        "primerApellido": "Sanchez",
        "segundoApellido": "Bartolomeo",
        "idInstitucion": 1
    };

    await request(servidor).post("/edushare/acceso/registro").send(datosCuenta);
});

afterAll(async () => {

    const cuenta1 = {
        "correo": correoRecuperacionPrueba,
        "contrasenia": contraseñaCorreoPrueba
    }

    const cuenta2 = {
        "correo": "usuario@test.com",
        "contrasenia": "Password123"
    }
    await request(servidor).post("/edushare/acceso/eliminar").send(cuenta1);
    await request(servidor).post("/edushare/acceso/eliminar").send(cuenta2);

    if (servidor && servidor.close) {
        await new Promise(resolve => servidor.close(resolve));
    }
});

describe('Test de cuenta de acceso', () => {
    test('POST /acceso - Se crea una nueva cuenta de acceso', async () => {
        const datos = {
        correo: "usuario@test.com",
        contrasenia: "Password123",
        nombreUsuario: "testuser",
        nombre: "Usuario",
        primerApellido: "Test",
        segundoApellido: "Prueba",
        idInstitucion: 1
        };

        const res = await request(app)
            .post("/edushare/acceso/registro")
            .set("content-type", "application/json")
            .send(datos);

        console.log("Respuesta del servidor:", res.body);
        console.log("Estado de la respuesta:", res.statusCode);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            error: false,
            estado: 200,
            mensaje: 'Cuenta creada exitosamente.'
        });
    });
    test('POST /recuperarContraseña - Se envía un código de recuperación al correo', async() => {
        const datos = {
            correo: correoRecuperacionPrueba
        };

        const res = await request(app)
            .post("/edushare/acceso/recuperarContrasena")
            .send(datos);
        
        console.log("Respuesta del servidor", res.body);
        console.log("Estado de la resputa", res.statusCode);

        expect(res.body).toEqual(expect.objectContaining({
            error: false,
            estado: 200,
            mensaje: "Se ha enviado un código de recuperación a tu correo"
        }));

        codigoRecuperacion = res.body.codigo
    })
});
