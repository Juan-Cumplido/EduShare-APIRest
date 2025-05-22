import request from "supertest";
import { CrearServidorTest } from "../serverTest.js";
import { ModeloAcceso } from "../api_rest/model/Acceso.js";

let servidor;
let app;
let codigoRecuperacion;
const correoRecuperacionPrueba = "zS22013636@estudiantes.uv.mx"
const contraseñaCorreoPrueba = "PasswordSeguro123!"
const codigoIncorrecto = "123456"

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

        expect(res.body).toEqual(expect.objectContaining({
            error: false,
            estado: 200,
            mensaje: "Se ha enviado un código de recuperación a tu correo"
        }));

        codigoRecuperacion = res.body.codigo
    });

    test('POST /verificarCodigoYCambiarContrasena - Verificar código y cambiar contraseña', async () => {
        const datosCambio = {
            correo: correoRecuperacionPrueba,
            codigo: String(codigoRecuperacion),
            nuevaContrasenia: "NuevoPassword123!"
        };
        
        const resCambio = await request(app)
            .post("/edushare/acceso/verificarCodigoYCambiarContrasena")
            .send(datosCambio);

        expect(resCambio.statusCode).toBe(200);
        expect(resCambio.body).toEqual({
            error: false,
            estado: 200,
            mensaje: "La contraseña ha sido actualizada exitosamente"
        });
    });

    test('POST /verificarCodigoYCambiarContrasena - Código incorrecto', async () => {
        const datosRecuperacion = {
            correo: correoRecuperacionPrueba
        };

        await request(app)
            .post("/edushare/acceso/recuperarContrasena")
            .send(datosRecuperacion);
        
        const datosCambio = {
            correo: correoRecuperacionPrueba,
            codigo: codigoIncorrecto,
            nuevaContrasenia: "NuevoPassword456!"
        };
        
        const res = await request(app)
            .post("/edushare/acceso/verificarCodigoYCambiarContrasena")
            .send(datosCambio);
        
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({
            error: true,
            estado: 400,
            mensaje: "El código de verificación es incorrecto"
        });
    });

    test('POST /verificarCodigoYCambiarContrasena - Correo no existente', async () => {
        const datosCambio = {
            correo: "correo_inexistente@test.com",
            codigo: "123456",
            nuevaContrasenia: "NuevoPassword789!"
        };
        
        const res = await request(app)
            .post("/edushare/acceso/verificarCodigoYCambiarContrasena")
            .send(datosCambio);
        
        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({
            error: true,
            estado: 404,
            mensaje: "No hay una solicitud de recuperación para este correo o ha expirado"
        });
    });

    test('POST /verificarCodigoYCambiarContrasena - Datos inválidos', async () => {
        const datosCambio = {
            correo: "correo_invalido",
            codigo: "123",  
            nuevaContrasenia: "corta" 
        };
        
        const res = await request(app)
            .post("/edushare/acceso/verificarCodigoYCambiarContrasena")
            .send(datosCambio);
        
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe(true);
        expect(res.body.estado).toBe(400);
        expect(res.body.mensaje).toBeDefined();
    });
});
