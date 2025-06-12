import os
import uuid
import grpc
import logging
from concurrent import futures
from PIL import Image
import fitz  # PyMuPDF
import file_service_pb2
import file_service_pb2_grpc

logging.basicConfig(level=logging.INFO)

BASE_DIR = os.path.abspath('.')
DOCS_DIR = os.path.join(BASE_DIR, 'Documento')
IMAGES_DIR = os.path.join(BASE_DIR, 'Imagen')


def save_file(directory, username, filename, filedata, is_image=False):
    user_folder = os.path.join(directory, username)
    os.makedirs(user_folder, exist_ok=True)

    if is_image:
        ext = os.path.splitext(filename)[1]
        unique_name = f"profile{ext}"
        file_path = os.path.join(user_folder, unique_name)
    else:
        name_no_ext = os.path.splitext(filename)[0]
        user_folder = os.path.join(user_folder, name_no_ext)
        os.makedirs(user_folder, exist_ok=True)

        name, ext = os.path.splitext(filename)
        unique_name = f"{name}_{uuid.uuid4().hex[:8]}{ext}"
        file_path = os.path.join(user_folder, unique_name)

    with open(file_path, 'wb') as f:
        f.write(filedata)

    return file_path, user_folder, unique_name


def pdf_generate_cover(pdf_path, save_folder, base_filename):
    try:
        doc = fitz.open(pdf_path)
        page = doc.load_page(0)
        pix = page.get_pixmap()

        cover_name = f"portada_{base_filename}.png"
        cover_path = os.path.join(save_folder, cover_name)

        pix.save(cover_path)
        doc.close()
        return cover_path
    except Exception as e:
        logging.error(f"Error generando portada PDF: {e}")
        raise


class FileServiceServicer(file_service_pb2_grpc.FileServiceServicer):
    def UploadImage(self, request, context):
        try:
            if not request.username or not request.filename or not request.filedata:
                context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
                context.set_details("Faltan campos obligatorios.")
                return file_service_pb2.UploadResponse()

            file_path, _, _ = save_file(IMAGES_DIR, request.username, request.filename, request.filedata, is_image=True)
            relative_path = os.path.relpath(file_path, BASE_DIR).replace('\\', '/')

            logging.info(f"Imagen de perfil actualizada por {request.username}: {file_path}")

            return file_service_pb2.UploadResponse(
                file_path=relative_path,
                cover_image_path=''
            )
        except Exception as e:
            logging.error(f"Error en UploadImage: {e}")
            context.set_details(str(e))
            context.set_code(grpc.StatusCode.INTERNAL)
            return file_service_pb2.UploadResponse()

    def UploadPdf(self, request, context):
        try:
            if not request.username or not request.filename or not request.filedata:
                context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
                context.set_details("Faltan campos obligatorios.")
                return file_service_pb2.UploadResponse()

            file_path, user_folder, unique_name = save_file(DOCS_DIR, request.username, request.filename, request.filedata)

            name_no_ext = os.path.splitext(unique_name)[0]
            cover_path = pdf_generate_cover(file_path, user_folder, name_no_ext)

            relative_file_path = os.path.relpath(file_path, BASE_DIR).replace('\\', '/')
            relative_cover_path = os.path.relpath(cover_path, BASE_DIR).replace('\\', '/')

            logging.info(f"PDF subido por {request.username}: {file_path}")
            logging.info(f"Portada generada en: {cover_path}")

            return file_service_pb2.UploadResponse(
                file_path=relative_file_path,
                cover_image_path=relative_cover_path
            )
        except Exception as e:
            logging.error(f"Error en UploadPdf: {e}")
            context.set_details(str(e))
            context.set_code(grpc.StatusCode.INTERNAL)
            return file_service_pb2.UploadResponse()

    def DownloadImage(self, request, context):
        return self._download_file_with_check(request, context, expected_exts={'.png', '.jpg', '.jpeg'})

    def DownloadPdf(self, request, context):
        return self._download_file_with_check(request, context, expected_exts={'.pdf'})

    def DownloadCover(self, request, context):
        try:
            if not request.relative_path:
                context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
                context.set_details("La ruta relativa es obligatoria.")
                return file_service_pb2.DownloadResponse()

            pdf_absolute_path = os.path.join(BASE_DIR, request.relative_path)
            if not os.path.isfile(pdf_absolute_path):
                context.set_code(grpc.StatusCode.NOT_FOUND)
                context.set_details("El archivo PDF no existe.")
                return file_service_pb2.DownloadResponse()

            folder = os.path.dirname(pdf_absolute_path)
            png_files = [f for f in os.listdir(folder) if f.lower().endswith('.png')]

            if not png_files:
                context.set_code(grpc.StatusCode.NOT_FOUND)
                context.set_details("No se encontró portada PNG.")
                return file_service_pb2.DownloadResponse()

            cover_path = os.path.join(folder, png_files[0])

            with open(cover_path, 'rb') as f:
                file_bytes = f.read()

            return file_service_pb2.DownloadResponse(
                filedata=file_bytes,
                filename=os.path.basename(cover_path)
            )
        except Exception as e:
            logging.error(f"Error en DownloadCover: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return file_service_pb2.DownloadResponse()

    def _download_file_with_check(self, request, context, expected_exts):
        try:
            if not request.relative_path:
                context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
                context.set_details("La ruta relativa es obligatoria.")
                return file_service_pb2.DownloadResponse()

            absolute_path = os.path.join(BASE_DIR, request.relative_path)

            if not os.path.isfile(absolute_path):
                context.set_code(grpc.StatusCode.NOT_FOUND)
                context.set_details("El archivo no existe.")
                return file_service_pb2.DownloadResponse()

            _, ext = os.path.splitext(absolute_path)
            if ext.lower() not in expected_exts:
                context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
                context.set_details(f"Tipo de archivo no permitido: {ext}")
                return file_service_pb2.DownloadResponse()

            with open(absolute_path, 'rb') as f:
                file_bytes = f.read()

            return file_service_pb2.DownloadResponse(
                filedata=file_bytes,
                filename=os.path.basename(absolute_path)
            )
        except Exception as e:
            logging.error(f"Error en descarga: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return file_service_pb2.DownloadResponse()


def serve():
    os.makedirs(DOCS_DIR, exist_ok=True)
    os.makedirs(IMAGES_DIR, exist_ok=True)

    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    file_service_pb2_grpc.add_FileServiceServicer_to_server(FileServiceServicer(), server)
    server.add_insecure_port('0.0.0.0:50051')
    logging.info("Servidor gRPC escuchando en puerto 50051...")
    server.start()
    server.wait_for_termination()


if __name__ == '__main__':
    serve()
