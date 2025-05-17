import request from "supertest";
import { CrearServidorTest } from "../serverTest.js";
import { ModeloAcceso } from "../api_rest/model/sql/Acceso.js";

let servidor;
let app;

beforeAll(async () => {
    const { app: appCreada, server: servidorCreado } = CrearServidorTest({
        ModeloAcceso: ModeloAcceso
    });
    servidor = servidorCreado;
    app = appCreada;
});

afterAll(async () => {
    if (servidor && servidor.close) {
        await new Promise(resolve => servidor.close(resolve));
    }
});

describe('Test de registro de cuenta de acceso', () => {
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

        expect(respuesta.statusCode).toBe(200);
        expect(respuesta.body).toEqual({
        error: false,
        estado: '200',
        mensaje: 'La nueva cuenta de acceso ha sido registrada correctamente'
        });
    });

    /*test('POST /acceso/login - Inicio de sesión exitoso', async () => {
        const credenciales = {
            nombreUsuario: "pedrito12",
            contrasenia: "test123"
        };

        const res = await request(app)
            .post("/edushare/acceso/login")
            .set("content-type", "application/json")
            .send(credenciales);

        console.log("Respuesta del servidor (login):", res.body);
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("mensaje");
        expect(res.body.mensaje).toBe("Inicio de sesión exitoso");
    });
    */

    /* Test para la ruta principal
    test('GET /acceso - Obtiene información de la API', async () => {
        const res = await request(app)
            .get("/edushare/acceso")
            .set("content-type", "application/json");

        console.log("Respuesta del servidor (info):", res.body);
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("endpoints");
        expect(res.body.endpoints).toBeInstanceOf(Array);
    });*/
});