#!/bin/bash

# Variables generales del repositorio y directorios
REPO_URL="https://github.com/joker120620/mivault.git"
APP_DIR="/opt/mivault"
BRANCH="main"
APP_NAME="mivault"
SQL_FILE="$APP_DIR/DATABASE.sql"

echo "Iniciando el proceso de actualizacion y configuracion del servidor."

# Paso 1: Obtener el codigo fuente
if [ ! -d "$APP_DIR/.git" ]; then
    echo "El directorio del proyecto no existe. Procediendo a clonar el repositorio."
    sudo git clone \(REPO_URL\)APP_DIR
    cd $APP_DIR
else
    echo "El repositorio ya esta clonado. Procediendo a descartar cambios locales y actualizar a la ultima version."
    cd $APP_DIR
    sudo git fetch origin $BRANCH
fi

# Paso 2: Leer las credenciales de la base de datos desde el archivo .env
echo "Extrayendo datos de conexion desde el archivo .env."
if [ -f "$APP_DIR/.env" ]; then
    # Cargar las variables del archivo exportandolas al entorno actual ignorando lineas comentadas
    export \((grep -v '^#' "\)APP_DIR/.env" | xargs)
else
    echo "Error: No se encontro el archivo .env en el directorio del proyecto."
    exit 1
fi

# Paso 3: Configuracion de la base de datos MariaDB
echo "Verificando la existencia de la base de datos y creandola si es necesario."

# Preparar el comando de MariaDB dependiendo de si existe una contrasena en el .env
if [ -z "$DB_PASSWORD" ]; then
    MYSQL_CMD="sudo mysql -h \(DB_HOST -P\)DB_PORT -u $DB_USER"
else
    MYSQL_CMD="sudo mysql -h \(DB_HOST -P\)DB_PORT -u \(DB_USER -p\)DB_PASSWORD"
fi

# Crear la base de datos usando la variable DB_NAME extraida del .env
\(MYSQL_CMD -e "CREATE DATABASE IF NOT EXISTS\)DB_NAME;"

echo "Verificando el archivo SQL para estructurar la base de datos."
if [ -f "$SQL_FILE" ]; then
    echo "Archivo SQL encontrado. Procediendo a importar la estructura y los datos."
    \(MYSQL_CMD\)DB_NAME < "$SQL_FILE"
else
    echo "Advertencia: No se encontro el archivo SQL en la ruta definida. Se omitira la importacion de tablas."
fi

# Paso 4: Dependencias del proyecto
echo "Instalando las dependencias necesarias de Node.js."
sudo npm install

# Paso 5: Gestion del proceso del servidor Node
echo "Verificando el estado del servicio en PM2."
if pm2 show $APP_NAME > /dev/null; then
    echo "La aplicacion ya se encuentra en ejecucion. Procediendo a reiniciar el servicio para aplicar los cambios."
    pm2 restart $APP_NAME
else
    echo "La aplicacion no esta registrada en PM2. Iniciando el servicio por primera vez."
    pm2 start index.js --name $APP_NAME
    pm2 save
fi

echo "El proceso de actualizacion ha finalizado correctamente."