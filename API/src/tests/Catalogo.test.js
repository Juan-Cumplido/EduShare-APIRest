import request from "supertest";
import { CrearServidorTest } from "../serverTest.js";
import { ModeloCatalogo } from "../api_rest/model/ModeloCatalogo.js";

let servidor;
let app;

beforeAll(async () => {
    const { app: appCreada, server: servidorCreado } = CrearServidorTest({
        ModeloCatalogo: ModeloCatalogo
    });
    servidor = servidorCreado;
    app = appCreada;
}, 30000);

afterAll(async () => {
    if (servidor && servidor.close) {
        await new Promise(resolve => servidor.close(resolve));
    }
}, 30000);

describe('GET /catalogo/categorias - Recuperar Categorías', () => {
    test('Debe recuperar categorías exitosamente', async () => {
        const res = await request(app)
            .get("/edushare/catalogo/categorias")
            .set("content-type", "application/json");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({
            error: false,
            estado: 200,
            mensaje: expect.any(String),
            datos: expect.any(Array)
        }));
    });
});

 describe('GET /catalogo/ramas - Recuperar Ramas', () => {
    test('Debe recuperar ramas exitosamente', async () => {
        const res = await request(app)
            .get("/edushare/catalogo/ramas")
            .set("content-type", "application/json");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({
            error: false,
            estado: 200,
            mensaje: expect.any(String),
            datos: expect.any(Array)
        }));
    });
});

    describe('GET /catalogo/materias - Recuperar Materias', () => {
    test('Debe recuperar todas las materias exitosamente', async () => {
        const res = await request(app)
            .get("/edushare/catalogo/materias")
            .set("content-type", "application/json");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.objectContaining({
            error: false,
            estado: 200,
            mensaje: expect.any(String),
            datos: expect.any(Array)
        }));
    });

    test('Debe recuperar materias por rama específica', async () => {
        const idRama = 1; 
        
        const res = await request(app)
            .get(`/edushare/catalogo/materias?idRama=${idRama}`)
            .set("content-type", "application/json");

        if (res.statusCode === 200) {
            expect(res.body).toEqual(expect.objectContaining({
                error: false,
                estado: 200,
                mensaje: expect.any(String),
                datos: expect.any(Array)
            }));
            
            if (res.body.datos.length > 0) {
                expect(res.body.datos[0]).toHaveProperty('idRama', idRama);
            }
        } else if (res.statusCode === 404) {
            expect(res.body).toEqual(expect.objectContaining({
                error: true,
                estado: 404,
                mensaje: expect.stringMatching(/rama|materias/)
            }));
        }
    });

    test('Debe validar ID de rama inválido', async () => {
        const res = await request(app)
            .get("/edushare/catalogo/materias?idRama=abc")
            .set("content-type", "application/json");

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(expect.objectContaining({
            error: true,
            estado: 400,
            mensaje: expect.any(Object) 
        }));
    });

    test('Debe validar ID de rama negativo', async () => {
        const res = await request(app)
            .get("/edushare/catalogo/materias?idRama=-1")
            .set("content-type", "application/json");

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(expect.objectContaining({
            error: true,
            estado: 400,
            mensaje: expect.any(Object)
        }));
    });

    test('Debe validar ID de rama igual a cero', async () => {
        const res = await request(app)
            .get("/edushare/catalogo/materias?idRama=0")
            .set("content-type", "application/json");

        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(expect.objectContaining({
            error: true,
            estado: 400,
            mensaje: expect.any(Object)
        }));
    });

    test('Debe manejar rama inexistente', async () => {
        const idRamaInexistente = 99999;
        
        const res = await request(app)
            .get(`/edushare/catalogo/materias?idRama=${idRamaInexistente}`)
            .set("content-type", "application/json");

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual(expect.objectContaining({
            error: true,
            estado: 404,
            mensaje: 'La rama especificada no existe'
        }));
    });
});