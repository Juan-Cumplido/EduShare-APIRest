import { CrearServidor } from "./src/server.js";
import { ModeloAcceso } from "./src/api_rest/model/Acceso.js";
import { ModeloCatalogo } from "./src/api_rest/model/ModeloCatalogo.js";
import { ModeloSeguimiento } from "./src/api_rest/model/ModeloSeguimiento.js";
import { ModeloPublicacion } from "./src/api_rest/model/ModeloPublicacion.js";
import { ProbarConexion } from './src/api_rest/model/sql/ProbarConexion.js';

CrearServidor({ModeloAcceso : ModeloAcceso, ModeloCatalogo:ModeloCatalogo, ModeloSeguimiento:ModeloSeguimiento, ModeloPublicacion: ModeloPublicacion});

await ProbarConexion();

