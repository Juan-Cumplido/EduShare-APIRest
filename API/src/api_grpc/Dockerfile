# Imagen base de Python
FROM python:3.12.4

# Copiar los archivos necesarios
COPY . /app

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Opcional: instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 3000

CMD ["python", "server.py"]


# Dockerfile para cyclecare_grpc_video
#FROM python:3.11-slim

# Crear directorio de trabajo
#WORKDIR /app

# Copiar dependencias
#COPY requirements.txt .

# Instalar dependencias
#RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código
#COPY . .

# Exponer el puerto que usa el gRPC (ajústalo si es otro)
#EXPOSE 3000

# Comando para iniciar el servidor
#CMD ["python", "server.py"]
