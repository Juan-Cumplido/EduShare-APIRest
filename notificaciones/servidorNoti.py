import asyncio
import json
import websockets
from datetime import datetime, timedelta
from uuid import uuid4
from typing import Dict, Set, List

usuarios_conectados: Dict[str, Set[websockets.WebSocketServerProtocol]] = {}
chats_activos: Dict[str, Dict] = {} 
usuarios_en_chat: Dict[str, Set[str]] = {} 
websockets_por_chat: Dict[str, Set[websockets.WebSocketServerProtocol]] = {}
chats_programados: List[Dict] = []
documentos_conectados: Dict[str, Set[websockets.WebSocketServerProtocol]] = {}
usuarios_por_documento: Dict[str, Set[str]] = {}

async def unirse_documento(id_documento: str, id_usuario: str, websocket):
    """Registra un usuario como conectado a un documento específico"""
    if id_documento not in documentos_conectados:
        documentos_conectados[id_documento] = set()
        usuarios_por_documento[id_documento] = set()
    
    documentos_conectados[id_documento].add(websocket)
    usuarios_por_documento[id_documento].add(id_usuario)
    
    print(f"Usuario {id_usuario} se conectó al documento {id_documento}")

async def salir_documento(id_documento: str, id_usuario: str, websocket):
    """Desregistra un usuario de un documento específico"""
    if id_documento in documentos_conectados:
        documentos_conectados[id_documento].discard(websocket)
        if not documentos_conectados[id_documento]:
            del documentos_conectados[id_documento]
    
    if id_documento in usuarios_por_documento:
        usuarios_por_documento[id_documento].discard(id_usuario)
        if not usuarios_por_documento[id_documento]:
            del usuarios_por_documento[id_documento]
    
    print(f"Usuario {id_usuario} se desconectó del documento {id_documento}")

async def enviar_a_documento(id_documento: str, mensaje: dict, excluir_usuario: str = None):
    """Envía un mensaje a todos los usuarios conectados a un documento específico, excepto al remitente"""
    if id_documento not in documentos_conectados:
        return
    
    sockets_a_enviar = []
    usuarios_documento = usuarios_por_documento.get(id_documento, set())
    
    if excluir_usuario:
        for websocket in list(documentos_conectados[id_documento]):
            sockets_a_enviar.append(websocket)
    else:
        sockets_a_enviar = list(documentos_conectados[id_documento])
    
    for ws in sockets_a_enviar:
        try:
            await ws.send(json.dumps(mensaje))
        except Exception:
            documentos_conectados[id_documento].discard(ws)

websocket_usuario_map: Dict[websockets.WebSocketServerProtocol, str] = {}

async def manejar_interaccion_documento(data, websocket):
    """Maneja las interacciones con documentos (like, vista, descarga, comentario)"""
    id_documento = data.get("IdDocumento")
    tipo_interaccion = data.get("TipoInteraccion")  # "like", "vista", "descarga", "comentario"
    id_usuario_remitente = data.get("IdUsuario")
    nombre_usuario = data.get("NombreUsuario", "Usuario")
    
    if not id_documento or not tipo_interaccion:
        await websocket.send(json.dumps({
            "accion": "error_interaccion_documento",
            "mensaje": "Faltan datos requeridos"
        }))
        return
    
    mensaje_notificacion = {
        "accion": "interaccion_documento",
        "IdDocumento": id_documento,
        "TipoInteraccion": tipo_interaccion,
        "IdUsuario": id_usuario_remitente,
        "NombreUsuario": nombre_usuario,
        "Timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    if tipo_interaccion == "like":
        mensaje_notificacion["Estado"] = data.get("Estado", "agregado")  # "agregado" o "removido"
    elif tipo_interaccion == "comentario":
        mensaje_notificacion["IdComentario"] = data.get("IdComentario")
        mensaje_notificacion["TextoComentario"] = data.get("TextoComentario")
    elif tipo_interaccion in ["vista", "descarga"]:
        mensaje_notificacion["Contador"] = data.get("Contador", 1)
    
    await enviar_a_documento_excluyendo_usuario(id_documento, mensaje_notificacion, id_usuario_remitente)
    
    await websocket.send(json.dumps({
        "accion": "interaccion_documento_confirmada",
        "TipoInteraccion": tipo_interaccion,
        "Status": "ok"
    }))
    
    print(f"Interacción {tipo_interaccion} procesada para documento {id_documento} por usuario {nombre_usuario}")

async def enviar_a_documento_excluyendo_usuario(id_documento: str, mensaje: dict, excluir_usuario_id: str):
    """Envía mensaje a todos los usuarios de un documento excepto al especificado"""
    if id_documento not in documentos_conectados:
        return
    
    for websocket in list(documentos_conectados[id_documento]):
        try:
            usuario_websocket = websocket_usuario_map.get(websocket)
            if usuario_websocket != excluir_usuario_id:
                await websocket.send(json.dumps(mensaje))
        except Exception:
            documentos_conectados[id_documento].discard(websocket)
            websocket_usuario_map.pop(websocket, None)

async def registrar_usuario(websocket, id_usuario: str):
    if id_usuario not in usuarios_conectados:
        usuarios_conectados[id_usuario] = set()
    usuarios_conectados[id_usuario].add(websocket)
    
    websocket_usuario_map[websocket] = id_usuario
    
    print(f"Usuario conectado: {id_usuario}")

async def eliminar_usuario(websocket, id_usuario: str):
    if id_usuario in usuarios_conectados:
        usuarios_conectados[id_usuario].discard(websocket)
        if not usuarios_conectados[id_usuario]:
            del usuarios_conectados[id_usuario]
    
    websocket_usuario_map.pop(websocket, None)
    
    for id_documento in list(documentos_conectados.keys()):
        documentos_conectados[id_documento].discard(websocket)
        if not documentos_conectados[id_documento]:
            del documentos_conectados[id_documento]
    
    for id_documento in list(usuarios_por_documento.keys()):
        usuarios_por_documento[id_documento].discard(id_usuario)
        if not usuarios_por_documento[id_documento]:
            del usuarios_por_documento[id_documento]
    
    print(f"Usuario desconectado: {id_usuario}")

async def enviar_a_chat(id_chat: str, mensaje: dict):
    sockets = list(websockets_por_chat.get(id_chat, set()))
    for ws in sockets:
        try:
            await ws.send(json.dumps(mensaje))
        except Exception:
            websockets_por_chat[id_chat].discard(ws)

async def notificar_autor_chat_inicio(id_chat: str):
    chat = chats_activos.get(id_chat)
    if not chat:
        return
    id_autor = chat["IdAutor"]
    if id_autor in usuarios_conectados:
        mensaje = {
            "accion": "notificacion_chat_inicio",
            "IdChat": id_chat,
            "Mensaje": f"Tu chat '{chat['Titulo']}' ha iniciado."
        }
        for ws in usuarios_conectados[id_autor]:
            try:
                await ws.send(json.dumps(mensaje))
            except Exception:
                pass

async def manejar_notificacion(data):
    destinatarios = data.get("UsuarioDestinoId", [])
    if isinstance(destinatarios, str):
        destinatarios = [destinatarios]

    notificacion = {
        "accion": "notificacion",
        "Titulo": data.get("Titulo"),
        "Mensaje": data.get("Mensaje"),
        "Tipo": data.get("Tipo"),
        "FechaCreacion": data.get("FechaCreacion")
    }

    print(f"Enviando notificación: {notificacion} a {destinatarios}")

    for uid in destinatarios:
        conexiones = usuarios_conectados.get(uid, set())
        for ws in list(conexiones):
            try:
                await ws.send(json.dumps(notificacion))
                print(f"Notificación enviada a {uid}")
            except Exception as e:
                print(f"Error al enviar a {uid}: {e}")
                conexiones.discard(ws)

async def eliminar_mensaje_chat(data, websocket):
    id_chat = data.get("IdChat")
    id_mensaje = data.get("IdMensaje")
    id_usuario_solicitante = data.get("IdUsuario")
    nombre_usuario = data.get("NombreUsuario")
    
    if id_chat not in chats_activos:
        await websocket.send(json.dumps({
            "accion": "error_eliminar_mensaje",
            "mensaje": "El chat ya no está activo."
        }))
        return

    if id_usuario_solicitante not in usuarios_en_chat.get(id_chat, set()):
        await websocket.send(json.dumps({
            "accion": "error_eliminar_mensaje",
            "mensaje": "No tienes permisos para eliminar mensajes en este chat."
        }))
        return

    mensaje_eliminacion = {
        "accion": "mensaje_eliminado",
        "IdChat": id_chat,
        "IdMensaje": id_mensaje,
        "EliminadoPor": nombre_usuario,
        "Hora": datetime.now().strftime("%H:%M")
    }

    for ws in list(websockets_por_chat.get(id_chat, set())):
        try:
            await ws.send(json.dumps(mensaje_eliminacion))
        except:
            websockets_por_chat[id_chat].discard(ws)

    await websocket.send(json.dumps({
        "accion": "mensaje_eliminado_confirmado",
        "IdMensaje": id_mensaje,
        "status": "ok"
    }))



async def crear_chat(data, websocket):
    try:
        
        id_chat = str(uuid4())
        chat_info = {
            "IdChat": id_chat,
            "Autor": data.get("Autor"),
            "IdAutor": data.get("IdAutor"),
            "Estado": "Programado" if data.get("Fecha") else "Activo",
            "Titulo": data.get("Titulo"),
            "NivelEducativo": data.get("NivelEducativo"),
            "Rama": data.get("Rama"),
            "Materia": data.get("Materia"),
            "Descripcion": data.get("Descripcion"),
            "Fecha": data.get("Fecha", ""),
            "Hora": data.get("Hora", ""),
            "Participantes": []
        }

        if chat_info["Estado"] == "Activo":
            chats_activos[id_chat] = chat_info
        else:
            chats_programados.append(chat_info)
            asyncio.create_task(programar_inicio_chat(chat_info))

        respuesta = {
            "accion": "crear_chat",
            "status": "ok",
            "IdChat": id_chat
        }
        
        await websocket.send(json.dumps(respuesta))
        
        return {"status": "ok", "IdChat": id_chat}
        
    except Exception as e:
        error_response = {
            "accion": "crear_chat",
            "status": "error",
            "error": str(e)
        }
        await websocket.send(json.dumps(error_response))
        return {"status": "error", "error": str(e)}

async def programar_inicio_chat(chat):
    try:
        fecha_hora = datetime.strptime(f"{chat['Fecha']} {chat['Hora']}", "%d/%m/%Y %H:%M")
        tiempo_espera = max(0, (fecha_hora - datetime.now()).total_seconds())
        
        await asyncio.sleep(tiempo_espera)
        
        id_chat = chat["IdChat"]
        chat["Estado"] = "Activo"
        chats_activos[id_chat] = chat
        
        chats_programados[:] = [c for c in chats_programados if c["IdChat"] != id_chat]
        

        await notificar_autor_chat_inicio(id_chat)

        await asyncio.sleep(15 * 60)

        if chat["IdAutor"] not in usuarios_en_chat.get(id_chat, set()):
            del chats_activos[id_chat]
            usuarios_en_chat.pop(id_chat, None)
            websockets_por_chat.pop(id_chat, None)

            mensaje_cancelacion = {
                "accion": "chat_cancelado",
                "IdChat": id_chat,
                "Mensaje": "El anfitrión no se unió al chat. El chat ha sido cancelado."
            }
            await enviar_a_chat(id_chat, mensaje_cancelacion)
            
    except Exception as e:
        print(f"❌ Error en programar_inicio_chat: {e}")

async def unirse_chat(id_chat, id_usuario, nombre_usuario, websocket):
    if id_chat not in chats_activos:
        return {
            "accion": "respuesta_unirse_chat",
            "exito": False,
            "idChat": id_chat,
            "error": "El chat no existe o ya terminó."
        }

    if id_usuario in usuarios_en_chat.get(id_chat, set()):
        return {
            "accion": "respuesta_unirse_chat",
            "exito": False,
            "idChat": id_chat,
            "error": "Ya estás conectado al chat desde otro dispositivo."
        }

    usuarios_en_chat.setdefault(id_chat, set()).add(id_usuario)
    websockets_por_chat.setdefault(id_chat, set()).add(websocket)

    mensaje_union = {
        "accion": "usuario_unido",
        "IdChat": id_chat,
        "Mensaje": f"{nombre_usuario} se ha unido al chat."
    }
    await enviar_a_chat(id_chat, mensaje_union)

    return {
        "accion": "respuesta_unirse_chat",
        "exito": True,
        "idChat": id_chat,
        "error": None
    }

async def enviar_a_chat_excluyendo_usuario(id_chat: str, mensaje: dict, excluir_usuario_id: str):
    """Envía mensaje a todos los usuarios de un chat excepto al usuario especificado"""
    if id_chat not in websockets_por_chat:
        return
    
    sockets_a_enviar = []
    for websocket in list(websockets_por_chat[id_chat]):
        try:
            usuario_websocket = websocket_usuario_map.get(websocket)
            if usuario_websocket != excluir_usuario_id:
                sockets_a_enviar.append(websocket)
        except Exception:
            websockets_por_chat[id_chat].discard(websocket)
    
    for ws in sockets_a_enviar:
        try:
            await ws.send(json.dumps(mensaje))
        except Exception:
            websockets_por_chat[id_chat].discard(ws)

async def salir_de_chat(id_chat, id_usuario):
    if id_chat not in chats_activos:
        return {"error": "El chat ya no está activo."}

    usuarios_en_chat.get(id_chat, set()).discard(id_usuario)

    if chats_activos[id_chat]["IdAutor"] == id_usuario:
        mensaje_cierre = {
            "accion": "chat_cerrado",
            "IdChat": id_chat,
            "Mensaje": "El anfitrión ha cerrado el chat."
        }
        await enviar_a_chat_excluyendo_usuario(id_chat, mensaje_cierre, id_usuario)
        
        del chats_activos[id_chat]
        usuarios_en_chat.pop(id_chat, None)
        websockets_por_chat.pop(id_chat, None)
        print(f"El anfitrión cerró el chat {id_chat}")

    return {"status": "salido"}

async def enviar_mensaje_chat(data, websocket):
    id_chat = data.get("IdChat")
    if id_chat not in chats_activos:
        await websocket.send(json.dumps({
            "accion": "error_envio_mensaje",
            "mensaje": "El chat ya no está activo."
        }))
        return

    mensaje = {
        "accion": "mensaje_chat",
        "IdChat": id_chat,
        "NombreUsuario": data.get("NombreUsuario"),
        "Hora": data.get("Hora"),
        "FotoPerfil": data.get("FotoPerfil"),
        "Mensaje": data.get("Mensaje")
    }

    for ws in list(websockets_por_chat.get(id_chat, set())):
        try:
            await ws.send(json.dumps(mensaje))
        except:
            websockets_por_chat[id_chat].discard(ws)

    await websocket.send(json.dumps({
        "accion": "mensaje_enviado",
        "status": "ok"
    }))

async def obtener_chats_activos(websocket):
    chats_serializables = []
    for chat in chats_activos.values():
        if chat["Estado"] == "Activo":
            chat_copia = chat.copy()
            chat_copia["Participantes"] = list(chat_copia.get("Participantes", set()))
            chats_serializables.append(chat_copia)
    
    respuesta = {
        "accion": "respuesta_chats_activos",
        "chats": chats_serializables
    }
    await websocket.send(json.dumps(respuesta))

async def obtener_mis_chats(id_autor, websocket):
    """Envía los chats del autor al cliente que los solicita"""
    mis_chats_serializables = []
    
    for chat in chats_activos.values():
        if chat["IdAutor"] == id_autor:
            chat_copia = chat.copy()
            chat_copia["Participantes"] = list(chat_copia.get("Participantes", set()))
            mis_chats_serializables.append(chat_copia)
    
    for chat in chats_programados:
        if chat["IdAutor"] == id_autor:
            chat_copia = chat.copy()
            chat_copia["Participantes"] = list(chat_copia.get("Participantes", set()))
            mis_chats_serializables.append(chat_copia)
    
    respuesta = {
        "accion": "respuesta_mis_chats",
        "chats": mis_chats_serializables
    }
    await websocket.send(json.dumps(respuesta))

async def handler(websocket):
    id_usuario = None
    try:
        async for mensaje in websocket:
            try:
                data = json.loads(mensaje)
                tipo = data.get("accion")
                
                
                if tipo == "conectar":
                    id_usuario = data.get("UsuarioId")
                    if id_usuario:
                        await registrar_usuario(websocket, id_usuario)
                        await websocket.send(json.dumps({
                            "accion": "conectado",
                            "status": "ok"
                        }))

                elif tipo == "desconectar":
                    id_usuario = data.get("UsuarioId")
                    await eliminar_usuario(websocket, id_usuario)

                elif tipo == "eliminar_mensaje":
                    await eliminar_mensaje_chat(data, websocket)

                elif tipo == "notificacion":
                    await manejar_notificacion(data)

                elif tipo == "crear_chat":
                    await crear_chat(data, websocket)

                elif tipo == "unirse_chat":
                    resultado = await unirse_chat(data["IdChat"], data["IdUsuario"], data["NombreUsuario"], websocket)
                    await websocket.send(json.dumps(resultado))

                elif tipo == "salir_chat":
                    resultado = await salir_de_chat(data["IdChat"], data["IdUsuario"])
                    await websocket.send(json.dumps(resultado))

                elif tipo == "enviar_mensaje":
                    await enviar_mensaje_chat(data, websocket)

                elif tipo == "obtener_chats_activos":
                    await obtener_chats_activos(websocket)

                elif tipo == "obtener_mis_chats":
                    await obtener_mis_chats(data["IdAutor"], websocket)
                
                elif tipo == "unirse_documento":
                    await unirse_documento(data["IdDocumento"], data["IdUsuario"], websocket)
                    await websocket.send(json.dumps({
                        "accion": "unido_documento",
                        "IdDocumento": data["IdDocumento"],
                        "status": "ok"
                    }))

                elif tipo == "salir_documento":
                    await salir_documento(data["IdDocumento"], data["IdUsuario"], websocket)
                    await websocket.send(json.dumps({
                        "accion": "salido_documento",
                        "IdDocumento": data["IdDocumento"], 
                        "status": "ok"
                    }))

                elif tipo == "interaccion_documento":
                    await manejar_interaccion_documento(data, websocket)

                else:
                    print(f"⚠️ Acción no reconocida: {tipo}")


            except json.JSONDecodeError as e:
                print(f"❌ Error al parsear JSON: {e} - Mensaje: {mensaje}")
                await websocket.send(json.dumps({
                    "accion": "error",
                    "mensaje": "Formato JSON inválido"
                }))
            except Exception as e:
                print(f"❌ Error procesando mensaje: {e}")
                await websocket.send(json.dumps({
                    "accion": "error", 
                    "mensaje": f"Error interno: {str(e)}"
                }))

    except websockets.ConnectionClosed:
        print(f"🔌 Conexión cerrada para usuario: {id_usuario}")
    except Exception as e:
        print(f"❌ Error en handler: {e}")
    finally:
        if id_usuario:
            await eliminar_usuario(websocket, id_usuario)

async def main():
    print(" Iniciando servidor WebSocket...")
    async with websockets.serve(handler, "172.20.10.2", 8765):
        print(" Servidor de notificaciones y chat corriendo en ws://localhost:8765")
        await asyncio.Future()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except RuntimeError:
        import nest_asyncio
        nest_asyncio.apply()
        asyncio.get_event_loop().run_until_complete(main())