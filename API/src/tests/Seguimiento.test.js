import request from "supertest";
import { CrearServidorTest } from "../serverTest.js";
import { ModeloSeguimiento } from "../api_rest/model/ModeloSeguimiento.js";
import { ModeloAcceso } from "../api_rest/model/ModeloAcceso.js";

let servidor;
let app;
let tokenUsuarioA;
let idUsuarioA;
let idUsuarioB;

const usuarioA = {
    correo: "usuarioA@test.com",
    contrasenia: "Password123A!",
    nombreUsuario: "userA",
    nombre: "Usuario",
    primerApellido: "A",
    segundoApellido: "Test",
    idInstitucion: 1
};

const usuarioB = {
    correo: "usuarioB@test.com",
    contrasenia: "Password123B!",
    nombreUsuario: "userB",
    nombre: "Usuario",
    primerApellido: "B",
    segundoApellido: "Test",
    idInstitucion: 1
};

beforeAll(async () => {
    const { app: appCreada, server: servidorCreado } = CrearServidorTest({
        ModeloSeguimiento: ModeloSeguimiento,
        ModeloAcceso: ModeloAcceso
    });
    servidor = servidorCreado;
    app = appCreada;
    
    await request(servidor).post("/edushare/acceso/registro").send(usuarioA);
    await request(servidor).post("/edushare/acceso/registro").send(usuarioB);

    const loginA = await request(app)
        .post("/edushare/acceso/login")
        .send({ identifier: usuarioA.correo, contrasenia: usuarioA.contrasenia });

    const loginB = await request(app)
        .post("/edushare/acceso/login")
        .send({ identifier: usuarioB.correo, contrasenia: usuarioB.contrasenia });

    tokenUsuarioA = loginA.body.token;
    idUsuarioA = loginA.body.datos.idUsuario;
    idUsuarioB = loginB.body.datos.idUsuario;

}, 100000);

afterAll(async () => {
    const cuentas = [
        { correo: "usuarioA@test.com", contrasenia: "Password123A!" },
        { correo: "usuarioB@test.com", contrasenia: "Password123B!" }
    ];

    for (const cuenta of cuentas) {
        await request(servidor).post("/edushare/acceso/eliminar").send(cuenta);
    }

    if (servidor && servidor.close) {
        await new Promise(resolve => servidor.close(resolve));
    }
}, 100000);

describe('Pruebas de seguimiento de usuarios', () => {
    test('Debería seguir exitosamente a otro usuario', async () => {
        const response = await request(app)
            .post("/edushare/seguimiento/seguir")
            .set('Authorization', `Bearer ${tokenUsuarioA}`)
            .send({ idUsuarioSeguido: idUsuarioB });
        
        if (response.statusCode === 500) {
            console.error('Error interno:', response.body);
        }

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
                error: false,
                estado: 200,
                mensaje: expect.stringContaining('Ahora sigues a este usuario')
            }); 
    }, 100000);

    test('Debería fallar al seguir usuario inexistente', async () => {
        const response = await request(app)
            .post("/edushare/seguimiento/seguir")
            .set('Authorization', `Bearer ${tokenUsuarioA}`)
            .send({ idUsuarioSeguido: 9999 });
        
       expect(response.statusCode).toBe(404)
       expect(response.body).toEqual({
            error: true,
            estado: 404,
            mensaje: expect.stringContaining('El usuario a seguir no existe.')
        });
    }, 100000);

    test('Debería fallar al seguirse a sí mismo', async () => {
        const response = await request(app)
            .post("/edushare/seguimiento/seguir")
            .set('Authorization', `Bearer ${tokenUsuarioA}`)
            .send({ idUsuarioSeguido: idUsuarioA });

        expect(response.statusCode).toBe(400)
        expect(response.body.mensaje).toEqual(
            expect.objectContaining({
                idUsuarioSeguido: expect.arrayContaining([
                    expect.stringContaining('Un usuario no puede seguirse a sí mismo')
                ])
            })
        );
        
    }, 100000);

    test('Debería verificar correctamente el seguimiento', async () => {
        await request(app)
            .post("/edushare/seguimiento/seguir")
            .set('Authorization', `Bearer ${tokenUsuarioA}`)
            .send({ idUsuarioSeguido: idUsuarioB });

        const response = await request(app)
            .get(`/edushare/seguimiento/verificar/${idUsuarioB}`)
            .set('Authorization', `Bearer ${tokenUsuarioA}`);

        expect(response.statusCode).toBe(200)
        expect(response.body.siguiendo).toBe(true);
        expect(response.body.mensaje).toEqual("El usuario está siendo seguido.")
    }, 100000);

    test('Debería obtener los usuarios seguidos', async () => {
        const response = await request(app)
            .get("/edushare/seguimiento/seguidos")
            .set('Authorization', `Bearer ${tokenUsuarioA}`);
        
        expect(response.statusCode).toBe(200)
        expect(response.body.datos).toBeInstanceOf(Array);
        expect(response.body.mensaje).toEqual("Usuarios seguidos obtenidos exitosamente.")

    }, 100000);

    test('Debería dejar de seguir exitosamente', async () => {
        await request(app)
            .post("/edushare/seguimiento/seguir")
            .set('Authorization', `Bearer ${tokenUsuarioA}`)
            .send({ idUsuarioSeguido: idUsuarioB });

        const response = await request(app)
            .delete("/edushare/seguimiento/dejar-seguir")
            .set('Authorization', `Bearer ${tokenUsuarioA}`)
            .send({ idUsuarioSeguido: idUsuarioB });
        
        expect(response.statusCode).toBe(200)
        expect(response.body.mensaje).toEqual('Has dejado de seguir a este usuario.');
    }, 100000);
});