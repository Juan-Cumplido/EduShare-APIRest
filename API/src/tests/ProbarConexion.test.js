import { ProbarConexion } from '../api_rest/model/sql/ProbarConexion.js';

describe('Probar conexion', () => {
    test('Debe establecer conexión exitosamente con la base de datos', async () => {
        let error = null;

        try {
            await ProbarConexion();
        } catch (err) {
            error = err;
        }

        expect(error).toBeNull();
    });
});