#!/bin/bash

# Iniciar SQL Server en segundo plano
/opt/mssql/bin/sqlservr &

# Esperar a que SQL Server esté listo
echo "Esperando a que SQL Server se inicie..."
sleep 20

# Ejecutar cada script SQL en la carpeta
for entry in /usr/src/app/scripts/*.sql
do
  echo "Ejecutando script: $entry"
  /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "Kp:d~4CJAw66" -d master -i "$entry"
done

# Mantener SQL Server corriendo en primer plano
wait
