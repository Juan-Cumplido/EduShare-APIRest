# Imagen base de Python
FROM python:3.11-slim

# Variables de entorno (puedes añadir más si lo necesitas)
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Directorio de trabajo
WORKDIR /app

# Copiar todos los archivos
COPY . /app

# Instalar dependencias
RUN pip install --upgrade pip && \
    pip install --no-cache-dir grpcio grpcio-tools pillow pymupdf && \
    if [ -f requirements.txt ]; then pip install --no-cache-dir -r requirements.txt; fi

# Exponer el puerto del servidor gRPC
EXPOSE 50051

# Comando para ejecutar el servidor
CMD ["python", "server.py"]
