import { CrearServidor } from "./src/server.js";
import { ModeloAcceso } from "./src/api_rest/model/Acceso.js";


CrearServidor({ModeloAcceso : ModeloAcceso});

import { ProbarConexion } from './src/api_rest/model/sql/ProbarConexion.js';

await ProbarConexion();

