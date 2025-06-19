import sql from 'mssql';
import { RetornarTipoDeConexion } from './connection/ConfiguracionConexion.js';
import { logger } from '../../utilidades/Logger.js';

export async function ProbarConexion() {
  const config = RetornarTipoDeConexion();

  try {
    console.log(config)
    const pool = await sql.connect(config);
    const resultado = await pool.request().query('SELECT 1 AS conexion');
    console.log(`✅ Conexión exitosa como :`, resultado.recordset);
    pool.close();
  } catch (err) {
    logger({mensaje: err})
    console.error(`❌ Error al conectar como :`, err.message);
  }
}
