#!/bin/bash
set -e

# Iniciar SQL Server en segundo plano
/opt/mssql/bin/sqlservr &

# Esperar a que SQL Server esté listo
echo "Esperando a que SQL Server esté disponible..."
until /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "$SA_PASSWORD" -Q "SELECT 1" &>/dev/null
do
  sleep 2
done

echo "Inicializando base de datos EduShare desde InitFull.sql..."

# Ejecutar el script unificado
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "$SA_PASSWORD" -i /initdb-scripts/EduShare_DB.sql

echo "Inicialización completada. SQL Server en ejecución."

# Mantener SQL Server corriendo en primer plano
wait
