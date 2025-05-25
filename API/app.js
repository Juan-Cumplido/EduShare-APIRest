import { CrearServidor } from "./src/server.js";
import { ModeloAcceso } from "./src/api_rest/model/Acceso.js";
import { ProbarConexion } from './src/api_rest/model/sql/ProbarConexion.js';
import { ModeloCatalogo } from "./src/api_rest/model/ModeloCatalogo.js";

CrearServidor({ModeloAcceso : ModeloAcceso, ModeloCatalogo:ModeloCatalogo});

await ProbarConexion();

