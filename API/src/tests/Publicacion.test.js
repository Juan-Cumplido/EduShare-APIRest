import request from "supertest";
import { CrearServidorTest } from "../serverTest.js";
import { ModeloPublicacion } from "../api_rest/model/ModeloPublicacion.js";
import { ModeloAcceso } from "../api_rest/model/ModeloAcceso.js";

let servidor;
let app;
let tokenUsuario;
let tokenAdmin;
let idUsuario;
let idPublicacion;

const usuarioPrueba = {
    correo: "publicacion@test.com",
    contrasenia: "Password123!",
    nombreUsuario: "pubUser",
    nombre: "Usuario",
    primerApellido: "Publicacion",
    segundoApellido: "Test",
    idInstitucion: 1
};

const adminPrueba = {
    correo: "adminpub@test.com",
    contrasenia: "Password123!",
    nombreUsuario: "adminPubUser",
    nombre: "Admin",
    primerApellido: "Publicacion",
    segundoApellido: "Test",
    idInstitucion: 1,
    esAdmin: true
};

beforeAll(async () => {
    const { app: appCreada, server: servidorCreado } = CrearServidorTest({
        ModeloPublicacion: ModeloPublicacion,
        ModeloAcceso: ModeloAcceso
    });
    servidor = servidorCreado;
    app = appCreada;
    
    await request(servidor).post("/edushare/acceso/registro").send(usuarioPrueba);
    await request(servidor).post("/edushare/acceso/registroAdmin").send(adminPrueba);

    const loginResponse = await request(app)
        .post("/edushare/acceso/login")
        .send({ 
            identifier: usuarioPrueba.correo, 
            contrasenia: usuarioPrueba.contrasenia 
        });

    const adminLoginResponse = await request(app)
        .post("/edushare/acceso/login")
        .send({ 
            identifier: adminPrueba.correo, 
            contrasenia: adminPrueba.contrasenia 
        });

    tokenUsuario = loginResponse.body.token;
    tokenAdmin = adminLoginResponse.body.token;
    idUsuario = loginResponse.body.datos.idUsuario;

}, 100000);

afterAll(async () => {
    const cuentas = [
        { correo: usuarioPrueba.correo, contrasenia: usuarioPrueba.contrasenia },
        { correo: adminPrueba.correo, contrasenia: adminPrueba.contrasenia }
    ];

    for (const cuenta of cuentas) {
        await request(servidor).post("/edushare/acceso/eliminar").send(cuenta);
    }

    if (servidor && servidor.close) {
        await new Promise(resolve => servidor.close(resolve));
    }
}, 100000);

describe('Pruebas del módulo de Publicaciones', () => {

    test('Debería crear una publicación exitosamente', async () => {
        const datosPublicacion = {
            idCategoria: 1,
            resuContenido: "Resumen de prueba para la publicación",
            nivelEducativo: "Universidad",
            idMateriaYRama: 1,
            idDocumento: 3
        };

        const response = await request(app)
            .post("/edushare/publicacion")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(datosPublicacion);
        
        expect(response.statusCode).toBe(201);
        expect(response.body.error).toBe(false);
        expect(response.body.id).toBeDefined();
        
        idPublicacion = response.body.id;
    }, 100000);

    test('Debería fallar al crear publicación sin datos requeridos', async () => {
        const datosIncompletos = {
            idCategoria: 1,
            // Falta resuContenido y otros campos requeridos
        };

        const response = await request(app)
            .post("/edushare/publicacion")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(datosIncompletos);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(true);
    }, 100000);

    test('Debería obtener todas las publicaciones', async () => {
        const response = await request(app)
            .get("/edushare/publicacion");
        
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(false);
        expect(response.body.datos).toBeInstanceOf(Array);
    }, 100000);

    test('Debería obtener una publicación por ID', async () => {
        const response = await request(app)
            .get(`/edushare/publicacion/${idPublicacion}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(false);
        expect(response.body.datos).toBeDefined();
    }, 100000);

    test('Debería fallar al obtener publicación con ID inexistente', async () => {
        const idInexistente = 99999;
        const response = await request(app)
            .get(`/edushare/publicacion/${idInexistente}`);
        
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe(true);
    }, 100000);

    test('Debería obtener las publicaciones propias', async () => {
        const response = await request(app)
            .get("/edushare/publicacion/me")
            .set('Authorization', `Bearer ${tokenUsuario}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(false);
        expect(response.body.datos).toBeInstanceOf(Array);
    }, 100000);

    test('Debería fallar al obtener publicaciones propias sin token', async () => {
        const response = await request(app)
            .get("/edushare/publicacion/me");
        
        expect(response.statusCode).toBe(401);
    }, 100000);

    test('Debería obtener publicaciones por categoría', async () => {
        const idCategoria = 1;
        const response = await request(app)
            .get(`/edushare/publicacion/categoria/${idCategoria}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(false);
        expect(response.body.datos).toBeInstanceOf(Array);
    }, 100000);

    test('Debería obtener publicaciones por rama', async () => {
        const idRama = 1;
        const response = await request(app)
            .get(`/edushare/publicacion/rama/${idRama}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(false);
        expect(response.body.datos).toBeInstanceOf(Array);
    }, 100000);

    test('Debería obtener publicaciones por nivel educativo', async () => {
        const nivel = "Universidad";
        const response = await request(app)
            .get(`/edushare/publicacion/nivel/${nivel}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(false);
        expect(response.body.datos).toBeInstanceOf(Array);
    }, 100000);

    test('Debería fallar al obtener publicaciones por nivel educativo inválido', async () => {
        const nivelInvalido = "Primaria";
        const response = await request(app)
            .get(`/edushare/publicacion/nivel/${nivelInvalido}`);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(true);
    }, 100000);

    test('Debería obtener publicaciones por usuario', async () => {
        const response = await request(app)
            .get(`/edushare/publicacion/usuario/${idUsuario}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(false);
        expect(response.body.datos).toBeInstanceOf(Array);
    }, 100000);

    test('Debería dar like a una publicación', async () => {
        const response = await request(app)
            .post(`/edushare/publicacion/${idPublicacion}/like`)
            .set('Authorization', `Bearer ${tokenUsuario}`);
        
        expect(response.statusCode).toBe(201);
        expect(response.body.error).toBe(false);
    }, 100000);

    test('Debería verificar like de usuario', async () => {
        const response = await request(app)
            .get(`/edushare/publicacion/${idPublicacion}/like`)
            .set('Authorization', `Bearer ${tokenUsuario}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(false);
    }, 100000);

    test('Debería quitar like a una publicación', async () => {
        const response = await request(app)
            .delete(`/edushare/publicacion/${idPublicacion}/like`)
            .set('Authorization', `Bearer ${tokenUsuario}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(false);
    }, 100000);

    test('Debería registrar visualización', async () => {
        const response = await request(app)
            .post(`/edushare/publicacion/${idPublicacion}/vista`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(false);
    }, 100000);

    test('Debería registrar descarga', async () => {
        const response = await request(app)
            .post(`/edushare/publicacion/${idPublicacion}/descarga`)
            .set('Authorization', `Bearer ${tokenUsuario}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(false);
    }, 100000);

    test('Debería aprobar publicación como admin', async () => {
        const response = await request(app)
            .patch(`/edushare/publicacion/${idPublicacion}/aprobar`)
            .set('Authorization', `Bearer ${tokenAdmin}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(false);
    }, 100000);

    test('Debería fallar al aprobar publicación como usuario normal', async () => {
        const response = await request(app)
            .patch(`/edushare/publicacion/${idPublicacion}/aprobar`)
            .set('Authorization', `Bearer ${tokenUsuario}`);
        
        expect(response.statusCode).toBe(403);
        expect(response.body.error).toBe(true);
    }, 100000);

    test('Debería rechazar publicación como admin', async () => {
        // Primero necesitamos otra publicación en estado "EnRevision"
        const datosPublicacion = {
            idCategoria: 1,
            resuContenido: "Otra publicación de prueba",
            nivelEducativo: "Universidad",
            idMateriaYRama: 1,
            idDocumento: 3
        };

        const crearResponse = await request(app)
            .post("/edushare/publicacion")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(datosPublicacion);
        
        const nuevaPublicacionId = crearResponse.body.id;

        const response = await request(app)
            .patch(`/edushare/publicacion/${nuevaPublicacionId}/rechazar`)
            .set('Authorization', `Bearer ${tokenAdmin}`);
        
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe(false);
    }, 100000);

    test('Debería fallar al rechazar publicación ya aprobada', async () => {
        const response = await request(app)
            .patch(`/edushare/publicacion/${idPublicacion}/rechazar`)
            .set('Authorization', `Bearer ${tokenAdmin}`);
        
        // La publicación ya fue aprobada en una prueba anterior
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(true);
    }, 100000);

    test('Debería eliminar publicación como propietario', async () => {
    // Crear una nueva publicación para eliminar
    const datosPublicacion = {
        idCategoria: 1,
        resuContenido: "Publicación para eliminar como propietario",
        nivelEducativo: "Universidad",
        idMateriaYRama: 1,
        idDocumento: 4
    };

    const crearResponse = await request(app)
        .post("/edushare/publicacion")
        .set('Authorization', `Bearer ${tokenUsuario}`)
        .send(datosPublicacion);

    console.log("DEBERIA ELIMINAR PUBLICACIÓN COMO PROPIETARIO")
    console.log(crearResponse.statusCode)
    console.log(crearResponse.body)
    
    expect(crearResponse.statusCode).toBe(201);
    const idPublicacionEliminar = crearResponse.body.id;

    // Eliminar la publicación como propietario
    const response = await request(app)
        .delete(`/edushare/publicacion/${idPublicacionEliminar}`)
        .set('Authorization', `Bearer ${tokenUsuario}`);

    console.log(response.statusCode)
    console.log(response.body)
    
    expect(response.statusCode).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.datos.resultado).toBe(1);
    expect(response.body.datos.mensaje).toBe('Publicación eliminada exitosamente');
}, 100000);

test('Debería eliminar publicación como admin', async () => {
    // Crear una nueva publicación para eliminar
    const datosPublicacion = {
        idCategoria: 1,
        resuContenido: "Publicación para eliminar como admin",
        nivelEducativo: "Universidad",
        idMateriaYRama: 1,
        idDocumento: 3
    };

    const crearResponse = await request(app)
        .post("/edushare/publicacion")
        .set('Authorization', `Bearer ${tokenUsuario}`)
        .send(datosPublicacion);
    
    expect(crearResponse.statusCode).toBe(201);
    const idPublicacionEliminar = crearResponse.body.id;

    // Eliminar la publicación como admin
    const response = await request(app)
        .delete(`/edushare/publicacion/${idPublicacionEliminar}`)
        .set('Authorization', `Bearer ${tokenAdmin}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.datos.resultado).toBe(1);
    expect(response.body.datos.mensaje).toBe('Publicación eliminada exitosamente');
}, 100000);

test('Debería fallar al eliminar publicación sin autenticación', async () => {
    const response = await request(app)
        .delete(`/edushare/publicacion/${idPublicacion}`);
    
    expect(response.statusCode).toBe(401);
}, 100000);

test('Debería fallar al eliminar publicación de otro usuario (sin ser admin)', async () => {
    // Crear otro usuario
    const otroUsuario = {
        correo: "otrousuario@test.com",
        contrasenia: "Password123!",
        nombreUsuario: "otroUser",
        nombre: "Otro",
        primerApellido: "Usuario",
        segundoApellido: "Test",
        idInstitucion: 1
    };

    await request(servidor).post("/edushare/acceso/registro").send(otroUsuario);

    const loginOtroUsuario = await request(app)
        .post("/edushare/acceso/login")
        .send({ 
            identifier: otroUsuario.correo, 
            contrasenia: otroUsuario.contrasenia 
        });

    const tokenOtroUsuario = loginOtroUsuario.body.token;

    // Crear publicación con el usuario original
    const datosPublicacion = {
        idCategoria: 1,
        resuContenido: "Publicación que no puede eliminar otro usuario",
        nivelEducativo: "Universidad",
        idMateriaYRama: 1,
        idDocumento: 3
    };

    const crearResponse = await request(app)
        .post("/edushare/publicacion")
        .set('Authorization', `Bearer ${tokenUsuario}`)
        .send(datosPublicacion);
    
    const idPublicacionAjena = crearResponse.body.id;

    // Intentar eliminar con otro usuario
    const response = await request(app)
        .delete(`/edushare/publicacion/${idPublicacionAjena}`)
        .set('Authorization', `Bearer ${tokenOtroUsuario}`);
    
    expect(response.statusCode).toBe(403);

    // Limpiar: eliminar el otro usuario
    await request(servidor).post("/edushare/acceso/eliminar").send({
        correo: otroUsuario.correo,
        contrasenia: otroUsuario.contrasenia
    });
}, 100000);

    //PRUEBAS DE ELIMINAR

    test('Debería fallar al eliminar publicación con ID inválido', async () => {
        const idInvalido = "abc";
        
        const response = await request(app)
            .delete(`/edushare/publicacion/${idInvalido}`)
            .set('Authorization', `Bearer ${tokenUsuario}`);
        
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(true);
    }, 100000);

    test('Debería fallar al eliminar publicación inexistente', async () => {
        const idInexistente = 99999;
        
        const response = await request(app)
            .delete(`/edushare/publicacion/${idInexistente}`)
            .set('Authorization', `Bearer ${tokenUsuario}`);
        
        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe(true);
        expect(response.body.datos.mensaje).toBe('La publicación no existe');
    }, 100000);

    test('Debería confirmar que la publicación eliminada ya no existe', async () => {
        // Crear una publicación para eliminar
        const datosPublicacion = {
            idCategoria: 1,
            resuContenido: "Publicación para verificar eliminación",
            nivelEducativo: "Universidad",
            idMateriaYRama: 1,
            idDocumento: 3
        };

        const crearResponse = await request(app)
            .post("/edushare/publicacion")
            .set('Authorization', `Bearer ${tokenUsuario}`)
            .send(datosPublicacion);
        
        const idPublicacionVerificar = crearResponse.body.id;

        // Verificar que existe
        const verificarExistencia = await request(app)
            .get(`/edushare/publicacion/${idPublicacionVerificar}`);
        
        expect(verificarExistencia.statusCode).toBe(200);

        // Eliminar la publicación
        const eliminarResponse = await request(app)
            .delete(`/edushare/publicacion/${idPublicacionVerificar}`)
            .set('Authorization', `Bearer ${tokenUsuario}`);
        
        expect(eliminarResponse.statusCode).toBe(200);

        // Verificar que ya no existe
        const verificarEliminacion = await request(app)
            .get(`/edushare/publicacion/${idPublicacionVerificar}`);
        
        expect(verificarEliminacion.statusCode).toBe(404);
    }, 100000);
});