-- Crear la base de datos
CREATE DATABASE EduShare_DB;
GO

USE EduShare_DB;
GO

-- Tabla Acceso
CREATE TABLE Acceso (
    idAcceso INT IDENTITY(1,1) PRIMARY KEY,
    correo NVARCHAR(256) NOT NULL,
    contrasenia NVARCHAR(300) NOT NULL,
    nombreUsuario NVARCHAR(15) NOT NULL,
    estado NVARCHAR(10) NOT NULL,
    tipoAcceso NVARCHAR(20) NOT NULL
);
GO

-- Tabla Institucion
CREATE TABLE Institucion (
    idInstitucion INT IDENTITY(1,1) PRIMARY KEY,
    nombreInstitucion NVARCHAR(100) NOT NULL,
    nivelEducativo NVARCHAR(20) NOT NULL
);
GO

-- Tabla UsuarioRegistrado
CREATE TABLE UsuarioRegistrado (
    idUsuarioRegistrado INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(30) NOT NULL,
    primerApellido NVARCHAR(30) NOT NULL,
    segundoApellido NVARCHAR(30) NULL,
    idAcceso INT NOT NULL,
    idInstitucion INT NOT NULL,
    fotoPerfil NVARCHAR(MAX) NULL,
    FOREIGN KEY (idAcceso) REFERENCES Acceso(idAcceso),
    FOREIGN KEY (idInstitucion) REFERENCES Institucion(idInstitucion)
);
GO

-- Tabla Seguidor
CREATE TABLE Seguidor (
    idSeguidor INT IDENTITY(1,1) PRIMARY KEY,
    idUsuarioSeguidor INT NOT NULL,
    idUsuarioSeguido INT NOT NULL,
    UNIQUE (idUsuarioSeguidor, idUsuarioSeguido),
    FOREIGN KEY (idUsuarioSeguidor) REFERENCES UsuarioRegistrado(idUsuarioRegistrado)
);
GO

-- Tabla Rama
CREATE TABLE Rama (
    idRama INT IDENTITY(1,1) PRIMARY KEY,
    nombreRama NVARCHAR(50) NOT NULL
);
GO

-- Tabla Materia
CREATE TABLE Materia (
    idMateria INT IDENTITY(1,1) PRIMARY KEY,
    nombreMateria NVARCHAR(45) NOT NULL
);
GO

-- Tabla Documento
CREATE TABLE Documento (
    idDocumento INT IDENTITY(1,1) PRIMARY KEY,
    titulo NVARCHAR(100) NOT NULL,
    ruta NVARCHAR(MAX) NOT NULL
);
GO

-- Tabla MateriaYRama
CREATE TABLE MateriaYRama (
  idMateriaYRama INT IDENTITY(1,1) PRIMARY KEY,
  idMateria INT NOT NULL,
  idRama INT NOT NULL,
  FOREIGN KEY (idRama) REFERENCES Rama(idRama),
  FOREIGN KEY (idMateria) REFERENCES Materia(idMateria),
  UNIQUE(idMateria, idRama)
);
GO

CREATE TABLE Categoria (
    idCategoria INT IDENTITY(1,1) PRIMARY KEY,
    nombreCategoria NVARCHAR(25) NOT NULL UNIQUE
);

-- Tabla Publicacion
CREATE TABLE Publicacion (
    idPublicacion INT IDENTITY(1,1) PRIMARY KEY,
    idCategoria INT NOT NULL,
    fecha DATE NOT NULL,
    resuContenido NVARCHAR(200) NOT NULL,
    estado NVARCHAR(20) NOT NULL,
    numeroLiker INT NOT NULL,
    nivelEducativo NVARCHAR(20) NOT NULL,
    numeroVisualizaciones INT NOT NULL,
    numeroDescargas INT NOT NULL,
    idUsuarioRegistrado INT NOT NULL,
    idDocumento INT NOT NULL,
    idMateriaYRama INT NOT NULL,
    FOREIGN KEY (idMateriaYRama) REFERENCES MateriaYRama(idMateriaYRama),
    FOREIGN KEY (idUsuarioRegistrado) REFERENCES UsuarioRegistrado(idUsuarioRegistrado),
    FOREIGN KEY (idDocumento) REFERENCES Documento(idDocumento),
    FOREIGN KEY (idCategoria) REFERENCES Categoria(idCategoria)
);
GO

-- Tabla Comentario
CREATE TABLE Comentario (
    idComentario INT IDENTITY(1,1) PRIMARY KEY,
    contenido NVARCHAR(200) NOT NULL,
    fecha DATE NOT NULL,
    idPublicacion INT NOT NULL,
    idUsuarioRegistrado INT NOT NULL,
    FOREIGN KEY (idPublicacion) REFERENCES Publicacion(idPublicacion),
    FOREIGN KEY (idUsuarioRegistrado) REFERENCES UsuarioRegistrado(idUsuarioRegistrado)
);
GO

CREATE TABLE LikePublicacion (
    idLike INT IDENTITY(1,1) PRIMARY KEY,
    idPublicacion INT NOT NULL,
    idUsuario INT NOT NULL,
    FOREIGN KEY (idPublicacion) REFERENCES Publicacion(idPublicacion),
    FOREIGN KEY (idUsuario) REFERENCES UsuarioRegistrado(idUsuarioRegistrado),
    UNIQUE(idPublicacion, idUsuario)
);
GO

-- Tabla AgendaChat
CREATE TABLE AgendaChat (
    idAgendaChat INT IDENTITY(1,1) PRIMARY KEY,
    titulo NVARCHAR(45) NOT NULL,
    descripcion NVARCHAR(45) NOT NULL,
    hora TIME NOT NULL,
    fecha DATE NOT NULL,
    idUsuarioRegistrado INT NOT NULL,
    FOREIGN KEY (idUsuarioRegistrado) REFERENCES UsuarioRegistrado(idUsuarioRegistrado)
);
GO

CREATE TABLE Notificaciones (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UsuarioDestinoId INT NOT NULL,
    Titulo NVARCHAR(255) NOT NULL,
    Mensaje NVARCHAR(MAX),
    UsuarioOrigenId INT NOT NULL,
    Tipo NVARCHAR(50),
    FechaCreacion DATETIME
);
GO

USE master;
GO

-- ==============================================
-- 1. CREAR LOGINS (a nivel de servidor)
-- ==============================================

-- Admin
CREATE LOGIN UsuarioAdmin
WITH PASSWORD = 'Kp:d~4CJAw66';
GO

-- Registrado
CREATE LOGIN UsuarioRegistrado
WITH PASSWORD = '£A3_*8bRqz1m';
GO

-- ==============================================
-- 2. CREAR USUARIOS EN LA BASE DE DATOS
-- ==============================================

USE EduShare_DB;
GO


-- Admin
CREATE USER UsuarioAdmin FOR LOGIN UsuarioAdmin;
GO
-- Registrado
CREATE USER UsuarioRegistrado FOR LOGIN UsuarioRegistrado;
GO

-- ==============================================
-- 3. OTORGAR PERMISOS ERICK PUTO
-- ==============================================

-- 3.1 Admin: todos los permisos sobre la base
EXEC sp_addrolemember 'db_owner', 'UsuarioAdmin';
GO

-- 3.2 Registrado: puede modificar datos y ejecutar funciones/procs
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::dbo TO UsuarioRegistrado;
GRANT EXECUTE TO UsuarioRegistrado;




INSERT INTO Institucion (nombreInstitucion, nivelEducativo) VALUES
('Universidad Nacional Autónoma de México', 'Universidad'),
('Instituto Tecnológico y de Estudios Superiores de Monterrey', 'Universidad'),
('Universidad de Guadalajara', 'Universidad'),
('Benemérita Universidad Autónoma de Puebla', 'Universidad'),
('Universidad Autónoma Metropolitana', 'Universidad'),
('Universidad Veracruzana', 'Universidad'),
('Universidad Autónoma de Nuevo León', 'Universidad'),
('Universidad Autónoma de Querétaro', 'Universidad'),
('Universidad Michoacana de San Nicolás de Hidalgo', 'Universidad'),
('Universidad Autónoma de Baja California', 'Universidad');

INSERT INTO Institucion (nombreInstitucion, nivelEducativo) VALUES
('Preparatoria 5 UNAM', 'Preparatoria'),
('Preparatoria Tec de Monterrey Campus CDMX', 'Preparatoria'),
('Preparatoria Anáhuac', 'Preparatoria'),
('Colegio de Ciencias y Humanidades Vallejo', 'Preparatoria'),
('Preparatoria 2 UNAM', 'Preparatoria'),
('Preparatoria Anglo Mexicano', 'Preparatoria'),
('Centro Universitario Anglo Mexicano', 'Preparatoria'),
('Preparatoria Liceo Mexicano Japonés', 'Preparatoria'),
('Colegio de Bachilleres Plantel 1', 'Preparatoria'),
('Preparatoria La Salle', 'Preparatoria');

INSERT INTO Categoria (nombreCategoria) VALUES
('Apuntes'),
('Resúmenes'),
('Guías de estudio'),
('Exámenes'),
('Tareas'),
('Presentaciones');


INSERT INTO Rama (nombreRama)
VALUES 
('Informática'),
('Derecho'),
('Medicina'),
('Arte'),
('Ingeniería');

-- Informática
INSERT INTO Materia (nombreMateria) VALUES ('Programación');
INSERT INTO Materia (nombreMateria) VALUES ('Bases de Datos');
INSERT INTO Materia (nombreMateria) VALUES ('Redes');

-- Derecho
INSERT INTO Materia (nombreMateria) VALUES ('Derecho Penal');
INSERT INTO Materia (nombreMateria) VALUES ('Derecho Civil');
INSERT INTO Materia (nombreMateria) VALUES ('Derecho Constitucional');

-- Medicina
INSERT INTO Materia (nombreMateria) VALUES ('Anatomía');
INSERT INTO Materia (nombreMateria) VALUES ('Fisiología');
INSERT INTO Materia (nombreMateria) VALUES ('Farmacología');

-- Arte
INSERT INTO Materia (nombreMateria) VALUES ('Dibujo');
INSERT INTO Materia (nombreMateria) VALUES ('Pintura');
INSERT INTO Materia (nombreMateria) VALUES ('Diseño gráfico');

-- Ingeniería
INSERT INTO Materia (nombreMateria) VALUES ('Cálculo');
INSERT INTO Materia (nombreMateria) VALUES ('Física');
INSERT INTO Materia (nombreMateria) VALUES ('Termodinámica');

-- Asociar materias con ramas en la tabla MateriaYRama
DECLARE @idRama INT, @idMateria INT;

-- Informática
SELECT @idRama = idRama FROM Rama WHERE nombreRama = 'Informática';
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Programación';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Bases de Datos';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Redes';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);

-- Derecho
SELECT @idRama = idRama FROM Rama WHERE nombreRama = 'Derecho';
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Derecho Penal';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Derecho Civil';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Derecho Constitucional';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);

-- Medicina
SELECT @idRama = idRama FROM Rama WHERE nombreRama = 'Medicina';
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Anatomía';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Fisiología';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Farmacología';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);

-- Arte
SELECT @idRama = idRama FROM Rama WHERE nombreRama = 'Arte';
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Dibujo';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Pintura';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Diseño gráfico';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);

-- Ingeniería
SELECT @idRama = idRama FROM Rama WHERE nombreRama = 'Ingeniería';
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Cálculo';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Física';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Termodinámica';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);

-- Procedimiento almacenado para crear comentario
CREATE OR ALTER PROCEDURE spi_CrearComentario
    @contenido NVARCHAR(200),
    @idPublicacion INT,
    @idUsuario INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Publicacion WHERE idPublicacion = @idPublicacion)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La publicación especificada no existe';
            RETURN;
        END

        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuario)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El usuario especificado no existe';
            RETURN;
        END

        INSERT INTO Comentario (contenido, fecha, idPublicacion, idUsuarioRegistrado)
        VALUES (@contenido, GETDATE(), @idPublicacion, @idUsuario);

        SET @resultado = 201;
        SET @mensaje = 'Comentario creado exitosamente';
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al crear el comentario: ' + ERROR_MESSAGE();
    END CATCH
END
GO

-- Procedimiento almacenado para eliminar comentario
CREATE OR ALTER PROCEDURE spd_EliminarComentario
    @idComentario INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Comentario WHERE idComentario = @idComentario)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El comentario especificado no existe';
            RETURN;
        END

        DELETE FROM Comentario WHERE idComentario = @idComentario;

        SET @resultado = 200;
        SET @mensaje = 'Comentario eliminado exitosamente';
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al eliminar el comentario: ' + ERROR_MESSAGE();
    END CATCH
END
GO

-- Procedimiento almacenado para recuperar comentarios de una publicación
CREATE OR ALTER PROCEDURE sps_RecuperarComentarios
    @idPublicacion INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Publicacion WHERE idPublicacion = @idPublicacion)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La publicación especificada no existe';
            RETURN;
        END

        SELECT 
            c.idComentario,
            c.contenido,
            c.fecha,
            c.idPublicacion,
            ur.idUsuarioRegistrado,
            ur.nombre,
            ur.primerApellido,
            ur.segundoApellido,
            ur.fotoPerfil,
            a.nombreUsuario
        FROM Comentario c
        INNER JOIN UsuarioRegistrado ur ON c.idUsuarioRegistrado = ur.idUsuarioRegistrado
        INNER JOIN Acceso a ON ur.idAcceso = a.idAcceso
        WHERE c.idPublicacion = @idPublicacion
        ORDER BY c.fecha DESC;

        SET @resultado = 200;
        SET @mensaje = 'Comentarios recuperados exitosamente';
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al recuperar los comentarios: ' + ERROR_MESSAGE();
    END CATCH
END
GO

-- Procedimiento almacenado para verificar si un usuario es propietario de un comentario
CREATE OR ALTER PROCEDURE sps_VerificarPropietarioComentario
    @idComentario INT,
    @idUsuario INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Comentario WHERE idComentario = @idComentario)
        BEGIN 
            SET @resultado = 404;
            SET @mensaje = 'El comentario no existe';
            RETURN;
        END

        IF EXISTS (
            SELECT 1 FROM Comentario 
            WHERE idComentario = @idComentario AND idUsuarioRegistrado = @idUsuario
        )
        BEGIN
            SET @resultado = 200;
            SET @mensaje = 'El usuario es el propietario del comentario';
        END
        ELSE
        BEGIN
            SET @resultado = 403;
            SET @mensaje = 'El usuario no es el propietario del comentario';
        END
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al verificar la propiedad del comentario: ' + ERROR_MESSAGE();
    END CATCH
END
GO



-- Archivo: procedimientos-almacenados.sql
-- Procedimiento almacenado para insertar una nueva cuenta con usuario registrado
CREATE OR ALTER PROCEDURE spi_InsertarCuentaConUsuarioRegistrado
    @correo NVARCHAR(256),
    @contrasenia NVARCHAR(300),
    @nombreUsuario NVARCHAR(15),
    @estado NVARCHAR(10),
    @tipoAcceso NVARCHAR(20),
    @nombre NVARCHAR(30),
    @primerApellido NVARCHAR(30),
    @segundoApellido NVARCHAR(30),
    @fotoPerfil NVARCHAR(MAX),
    @idInstitucion INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
            
        IF EXISTS (SELECT 1 FROM Acceso WHERE correo = @correo)
        BEGIN
            SET @resultado = 409;
            SET @mensaje = 'El correo electrónico ya está registrado.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        IF EXISTS (SELECT 1 FROM Acceso WHERE nombreUsuario = @nombreUsuario)
        BEGIN
            SET @resultado = 409;
            SET @mensaje = 'El nombre de usuario ya está en uso.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        DECLARE @idAcceso INT;
        
        INSERT INTO Acceso (correo, contrasenia, nombreUsuario, estado, tipoAcceso)
        VALUES (@correo, @contrasenia, @nombreUsuario, @estado, @tipoAcceso);
        
        SET @idAcceso = SCOPE_IDENTITY();
        
        INSERT INTO UsuarioRegistrado (nombre, primerApellido, segundoApellido, idAcceso, idInstitucion, fotoPerfil)
        VALUES (@nombre, @primerApellido, @segundoApellido, @idAcceso, @idInstitucion, @fotoPerfil);
        
        COMMIT TRANSACTION;
        SET @resultado = 200;
        SET @mensaje = 'Cuenta creada exitosamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        SET @resultado = 500;
        SET @mensaje = 'Error al crear la cuenta: ' + ERROR_MESSAGE();
    END CATCH;
END;
GO

CREATE OR ALTER PROCEDURE spi_RecuperarContraseñaCorreo
    @correo NVARCHAR(256),
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF EXISTS (SELECT 1 FROM Acceso WHERE correo = @correo)
        BEGIN
            SET @resultado = 200;
            SET @mensaje = 'Se ha iniciado el proceso de recuperación de contraseña';
        END
        ELSE
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El correo proporcionado no está registrado en el sistema';
        END
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al procesar la solicitud de recuperación: ' + ERROR_MESSAGE();
    END CATCH
END
GO

CREATE OR ALTER PROCEDURE spi_EliminarCuenta
    @correo NVARCHAR(256),
    @contrasenia NVARCHAR(300),
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        DECLARE @idAcceso INT;
        DECLARE @idUsuarioRegistrado INT;
        
        IF NOT EXISTS (SELECT 1 FROM Acceso WHERE correo = @correo AND contrasenia = @contrasenia)
        BEGIN
            SET @resultado = 401;
            SET @mensaje = 'Credenciales incorrectas.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        SELECT @idAcceso = idAcceso FROM Acceso WHERE correo = @correo;
        SELECT @idUsuarioRegistrado = idUsuarioRegistrado FROM UsuarioRegistrado WHERE idAcceso = @idAcceso;
        
        DELETE FROM Seguidor WHERE idUsuarioSeguidor = @idUsuarioRegistrado OR idUsuarioSeguido = @idUsuarioRegistrado;
        DELETE FROM Comentario WHERE idUsuarioRegistrado = @idUsuarioRegistrado;
        DELETE FROM AgendaChat WHERE idUsuarioRegistrado = @idUsuarioRegistrado;
        
        DELETE FROM Publicacion WHERE idUsuarioRegistrado = @idUsuarioRegistrado;
        
        DELETE FROM UsuarioRegistrado WHERE idAcceso = @idAcceso;
        
        DELETE FROM Acceso WHERE idAcceso = @idAcceso;
        
        COMMIT TRANSACTION;
        SET @resultado = 200;
        SET @mensaje = 'Cuenta eliminada exitosamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        SET @resultado = 500;
        SET @mensaje = 'Error al eliminar la cuenta: ' + ERROR_MESSAGE();
    END CATCH;
END;
GO

-----------------Banear usuario----
CREATE OR ALTER PROCEDURE spi_BanearUsuario
    @idUsuario INT,
    @idAdministrador INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT 
AS
BEGIN 
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

            IF NOT EXISTS (SELECT 1 FROM Acceso WHERE idAcceso = @idAdministrador AND tipoAcceso = 'Administrador')
            BEGIN
                SET @resultado = 403;
                SET @mensaje = 'No tiene permisos para realizar esta acción.';
                ROLLBACK TRANSACTION;
            RETURN;
            END

            IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuario)
            BEGIN
                SET @resultado = 404;
                SET @mensaje = 'El usuario especificado no existe.';
                ROLLBACK TRANSACTION;
                RETURN;
            END
        DECLARE @idAcceso INT;
        SELECT @idAcceso = idAcceso FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuario;

        IF EXISTS (SELECT 1 FROM Acceso WHERE idAcceso = @idAcceso AND estado = 'Baneado')
        BEGIN
            SET @resultado = 409;
            SET @mensaje = 'El usuario ya se encuentra baneado.';
            ROLLBACK TRANSACTION;
            RETURN;
        END

        UPDATE Acceso 
        SET estado = 'Baneado'
        WHERE idAcceso = @idAcceso;

        COMMIT TRANSACTION;
        SET @resultado = 200;
        SET @mensaje = 'Usuario baneado exitosamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SET @resultado = 500;
        SET @mensaje = 'Error al banear al usuario: ' + ERROR_MESSAGE();
    END CATCH;
END;
GO

-- Procedimiento almacenado para desbanear un usuario
CREATE OR ALTER PROCEDURE spi_DesbanearUsuario
    @idUsuario INT,
    @idAdministrador INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuario)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El usuario especificado no existe.';
            ROLLBACK TRANSACTION;
            RETURN;
        END
        
        DECLARE @idAcceso INT;
        SELECT @idAcceso = idAcceso FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuario;
        
        IF NOT EXISTS (SELECT 1 FROM Acceso WHERE idAcceso = @idAcceso AND estado = 'Baneado')
        BEGIN
            SET @resultado = 409;
            SET @mensaje = 'El usuario no se encuentra baneado actualmente.';
            ROLLBACK TRANSACTION;
            RETURN;
        END

    
        IF NOT EXISTS (SELECT 1 FROM Acceso WHERE idAcceso = @idAdministrador AND tipoAcceso = 'Administrador')
        BEGIN
            SET @resultado = 403;
            SET @mensaje = 'No tiene permisos para realizar esta acción.';
            ROLLBACK TRANSACTION;
        RETURN;
        END
        
        UPDATE Acceso 
        SET estado = 'Activo'
        WHERE idAcceso = @idAcceso;
        
        COMMIT TRANSACTION; 
        SET @resultado = 200;
        SET @mensaje = 'Usuario desbaneado exitosamente.';
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        SET @resultado = 500;
        SET @mensaje = 'Error al desbanear al usuario: ' + ERROR_MESSAGE();
    END CATCH;
END;
GO


CREATE OR ALTER PROCEDURE sps_verificarUsuarioAdminoPropietario
    @idUsuario INT,
    @idPublicacion INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Publicacion WHERE idPublicacion = @idPublicacion)
    BEGIN 
        SET @resultado = 404;
        SET @mensaje = 'La publicación no existe';
        RETURN;
    END

    IF EXISTS (
        SELECT 1 FROM Publicacion 
        WHERE idPublicacion = @idPublicacion AND idUsuarioRegistrado = @idUsuario
    )
    BEGIN
        SET @resultado = 200;
        SET @mensaje = 'El usuario es el propietario de la publicación';
    END
    ELSE
    BEGIN
        SET @resultado = 403;
        SET @mensaje = 'El usuario no es el propietario de la publicación';
    END
END
GO

CREATE OR ALTER PROCEDURE sps_verificarUsuarioAdmin
    @idUsuario INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF EXISTS (SELECT 1 FROM Acceso WHERE idAcceso = @idUsuario AND tipoAcceso = 'Administrador')
        BEGIN 
            SET @resultado = 200;
            SET @mensaje = 'El usuario es Administrador.';
        END
        ELSE 
        BEGIN
            SET @resultado = 403;
            SET @mensaje = 'El usuario no es Administrador.';
        END
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al verificar el usuario: ' + ERROR_MESSAGE();
    END CATCH
END;
GO

-- Procedimiento almacenado para recuperar todas las categorías
CREATE OR ALTER PROCEDURE sps_RecuperarCategorias
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF EXISTS (SELECT 1 FROM Categoria)
        BEGIN
            SELECT 
                idCategoria,
                nombreCategoria
            FROM Categoria
            ORDER BY nombreCategoria;
            
            SET @resultado = 200;
            SET @mensaje = 'Categorías recuperadas exitosamente';
        END
        ELSE
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'No se encontraron categorías registradas';
        END
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al recuperar las categorías: ' + ERROR_MESSAGE();
    END CATCH
END
GO

-- Procedimiento almacenado para recuperar todas las ramas
CREATE OR ALTER PROCEDURE sps_RecuperarRamas
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF EXISTS (SELECT 1 FROM Rama)
        BEGIN
            SELECT 
                idRama,
                nombreRama
            FROM Rama
            ORDER BY nombreRama;
            
            SET @resultado = 200;
            SET @mensaje = 'Ramas recuperadas exitosamente';
        END
        ELSE
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'No se encontraron ramas registradas';
        END
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al recuperar las ramas: ' + ERROR_MESSAGE();
    END CATCH
END
GO

-- Procedimiento almacenado para recuperar todas las materias
CREATE OR ALTER PROCEDURE sps_RecuperarMaterias
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF EXISTS (SELECT 1 FROM Materia)
        BEGIN
            SELECT 
                idMateria,
                nombreMateria
            FROM Materia
            ORDER BY nombreMateria;
            
            SET @resultado = 200;
            SET @mensaje = 'Materias recuperadas exitosamente';
        END
        ELSE
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'No se encontraron materias registradas';
        END
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al recuperar las materias: ' + ERROR_MESSAGE();
    END CATCH
END
GO

-- Procedimiento almacenado para recuperar materias por rama específica
CREATE OR ALTER PROCEDURE sps_RecuperarMateriasPorRama
    @idRama INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Rama WHERE idRama = @idRama)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La rama especificada no existe';
            RETURN;
        END
        
        IF EXISTS (SELECT 1 FROM MateriaYRama mr WHERE mr.idRama = @idRama)
        BEGIN
            SELECT 
                m.idMateria,
                m.nombreMateria,
                r.idRama,
                r.nombreRama,
                mr.idMateriaYRama
            FROM Materia m
            INNER JOIN MateriaYRama mr ON m.idMateria = mr.idMateria
            INNER JOIN Rama r ON mr.idRama = r.idRama
            WHERE mr.idRama = @idRama
            ORDER BY m.nombreMateria;
            
            SET @resultado = 200;
            SET @mensaje = 'Materias por rama recuperadas exitosamente';
        END
        ELSE
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'No se encontraron materias para la rama especificada';
        END
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al recuperar las materias por rama: ' + ERROR_MESSAGE();
    END CATCH
END
GO

-- Procedimiento almacenado para recuperar Instituciones
CREATE OR ALTER PROCEDURE sps_RecuperarInstituciones
    @nivelEducativo NVARCHAR(20) = NULL,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        IF @nivelEducativo IS NOT NULL AND @nivelEducativo NOT IN ('Preparatoria', 'Universidad')
        BEGIN
            SET @resultado = 400;
            SET @mensaje = 'Nivel educativo no válido. Use "Preparatoria" o "Universidad"';
            RETURN;
        END

        IF EXISTS (
            SELECT 1 FROM Institucion 
            WHERE (@nivelEducativo IS NULL OR nivelEducativo = @nivelEducativo)
        )
        BEGIN
            SELECT 
                idInstitucion,
                nombreInstitucion,
                nivelEducativo
            FROM Institucion
            WHERE (@nivelEducativo IS NULL OR nivelEducativo = @nivelEducativo)
            ORDER BY nivelEducativo, nombreInstitucion;
            
            SET @resultado = 200;
            IF @nivelEducativo IS NULL
                SET @mensaje = 'Instituciones recuperadas exitosamente';
            ELSE
                SET @mensaje = 'Instituciones de ' + @nivelEducativo + ' recuperadas exitosamente';
        END
        ELSE
        BEGIN
            SET @resultado = 404;
            IF @nivelEducativo IS NULL
                SET @mensaje = 'No se encontraron instituciones registradas';
            ELSE
                SET @mensaje = 'No se encontraron instituciones de ' + @nivelEducativo + ' registradas';
        END
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al recuperar las instituciones: ' + ERROR_MESSAGE();
    END CATCH
END
GO

CREATE OR ALTER PROCEDURE spi_VerificarCredenciales
    @identifier NVARCHAR(256),      
    @contrasenia NVARCHAR(300),
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT,
    @idUsuarioRegistrado INT OUTPUT,
    @nombre NVARCHAR(30) OUTPUT,
    @fotoPerfil NVARCHAR(MAX) OUTPUT,
    @correo NVARCHAR(256) OUTPUT,
    @nombreUsuario NVARCHAR(15) OUTPUT,
    @primerApellido NVARCHAR(30) OUTPUT,
    @segundoApellido NVARCHAR(30) OUTPUT,
    @tipoAcceso NVARCHAR(20) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        DECLARE @idAcceso INT
        DECLARE @estado NVARCHAR(10)
        
        IF @identifier LIKE '%_@_%.__%'
        BEGIN
            SELECT 
                @idAcceso = idAcceso, 
                @estado = estado, 
                @correo = correo, 
                @nombreUsuario = nombreUsuario,
                @tipoAcceso = tipoAcceso
            FROM Acceso
            WHERE correo = @identifier AND contrasenia = @contrasenia
        END
        ELSE
        BEGIN
            SELECT 
                @idAcceso = idAcceso, 
                @estado = estado, 
                @correo = correo, 
                @nombreUsuario = nombreUsuario,
                @tipoAcceso = tipoAcceso
            FROM Acceso
            WHERE nombreUsuario = @identifier AND contrasenia = @contrasenia
        END
        
        IF @idAcceso IS NULL
        BEGIN
            SET @resultado = 401; 
            SET @mensaje = 'Credenciales incorrectas'
            RETURN
        END
        
        IF @estado != 'Activo'
        BEGIN
            SET @resultado = 403; 
            SET @mensaje = 'La cuenta fue baneada'
            RETURN
        END
        
        SELECT 
            @idUsuarioRegistrado = ur.idUsuarioRegistrado,
            @nombre = ur.nombre,
            @fotoPerfil = ur.fotoPerfil,
            @primerApellido = ur.primerApellido,
            @segundoApellido = ur.segundoApellido
        FROM UsuarioRegistrado ur
        WHERE ur.idAcceso = @idAcceso
        
        SET @resultado = 200; 
        SET @mensaje = 'Inicio de sesión exitoso'
    END TRY
    BEGIN CATCH
        SET @resultado = 500; 
        SET @mensaje = 'Error al verificar credenciales: ' + ERROR_MESSAGE()
    END CATCH
END
GO

-- Procedimiento almacenado para registrar una notificación
CREATE OR ALTER PROCEDURE sps_RegistrarNotificacion
    @usuarioDestinoId INT,
    @titulo NVARCHAR(255),
    @mensajeNotificacion NVARCHAR(MAX),
    @usuarioOrigenId INT,
    @tipo NVARCHAR(50),
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        INSERT INTO Notificaciones (
            UsuarioDestinoId,
            Titulo,
            Mensaje,
            UsuarioOrigenId,
            Tipo,
            FechaCreacion
        )
        VALUES (
            @usuarioDestinoId,
            @titulo,
            @mensajeNotificacion,
            @usuarioOrigenId,
            @tipo,
            GETDATE()
        );

        SET @resultado = 201;
        SET @mensaje = 'Notificación registrada exitosamente';
        
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al registrar la notificación: ' + ERROR_MESSAGE();
    END CATCH
END
GO

-- Procedimiento almacenado para obtener las notificaciones propias de un usuario
CREATE OR ALTER PROCEDURE sps_ObtenerNotificacionesPropias
    @usuarioDestinoId INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF EXISTS (SELECT 1 FROM Notificaciones WHERE UsuarioDestinoId = @usuarioDestinoId)
        BEGIN
            SELECT 
                Id,
                UsuarioDestinoId,
                Titulo,
                Mensaje,
                UsuarioOrigenId,
                Tipo,
                FechaCreacion
            FROM Notificaciones
            WHERE UsuarioDestinoId = @usuarioDestinoId
            ORDER BY FechaCreacion DESC;
            
            SET @resultado = 200;
            SET @mensaje = 'Notificaciones recuperadas exitosamente';
        END
        ELSE
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'No se encontraron notificaciones para este usuario';
        END
        
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al obtener las notificaciones: ' + ERROR_MESSAGE();
    END CATCH
END
GO


-- Procedimiento almacenado para obtener datos de perfil propio
CREATE OR ALTER PROCEDURE sps_ObtenerPerfilPropio
    @idUsuario INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuario)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'Usuario no encontrado';
            RETURN;
        END

        SELECT 
            ur.idUsuarioRegistrado,
            ur.nombre,
            ur.primerApellido,
            ur.segundoApellido,
            ur.fotoPerfil,
            a.correo,
            a.nombreUsuario,
            i.idInstitucion,
            i.nombreInstitucion,
            i.nivelEducativo,
            (SELECT COUNT(*) FROM Seguidor s WHERE s.idUsuarioSeguido = ur.idUsuarioRegistrado) AS numeroSeguidores,
            (SELECT COUNT(*) FROM Seguidor s WHERE s.idUsuarioSeguidor = ur.idUsuarioRegistrado) AS numeroSeguidos
        FROM UsuarioRegistrado ur
        INNER JOIN Acceso a ON ur.idAcceso = a.idAcceso
        INNER JOIN Institucion i ON ur.idInstitucion = i.idInstitucion
        WHERE ur.idUsuarioRegistrado = @idUsuario;
        
        SET @resultado = 200;
        SET @mensaje = 'Perfil recuperado exitosamente';
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al recuperar el perfil: ' + ERROR_MESSAGE();
    END CATCH
END
GO

-- Procedimiento almacenado para actualizar perfil
CREATE OR ALTER PROCEDURE spu_ActualizarPerfil
    @idUsuario INT,
    @nombre NVARCHAR(30),
    @correo NVARCHAR(256),
    @primerApellido NVARCHAR(30),
    @segundoApellido NVARCHAR(30),
    @nombreUsuario NVARCHAR(15),
    @idInstitucion INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuario)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'Usuario no encontrado';
            RETURN;
        END

        IF NOT EXISTS (SELECT 1 FROM Institucion WHERE idInstitucion = @idInstitucion)
        BEGIN
            SET @resultado = 400;
            SET @mensaje = 'La institución especificada no existe';
            RETURN;
        END

        DECLARE @idAccesoActual INT;
        SELECT @idAccesoActual = idAcceso FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuario;
        
        IF EXISTS (SELECT 1 FROM Acceso WHERE nombreUsuario = @nombreUsuario AND idAcceso != @idAccesoActual)
        BEGIN
            SET @resultado = 409;
            SET @mensaje = 'El nombre de usuario ya está en uso';
            RETURN;
        END

        UPDATE UsuarioRegistrado 
        SET 
            nombre = @nombre,
            primerApellido = @primerApellido,
            segundoApellido = @segundoApellido,
            idInstitucion = @idInstitucion
        WHERE idUsuarioRegistrado = @idUsuario;

        UPDATE Acceso 
        SET 
            nombreUsuario = @nombreUsuario,
            correo = @correo
        WHERE idAcceso = @idAccesoActual;

        SELECT 
            ur.idUsuarioRegistrado,
            ur.nombre,
            ur.primerApellido,
            ur.segundoApellido,
            ur.fotoPerfil,
            a.nombreUsuario,
            a.correo,
            i.idInstitucion,
            i.nombreInstitucion,
            i.nivelEducativo
        FROM UsuarioRegistrado ur
        INNER JOIN Acceso a ON ur.idAcceso = a.idAcceso
        INNER JOIN Institucion i ON ur.idInstitucion = i.idInstitucion
        WHERE ur.idUsuarioRegistrado = @idUsuario;

        SET @resultado = 200;
        SET @mensaje = 'Perfil actualizado exitosamente';
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al actualizar el perfil: ' + ERROR_MESSAGE();
    END CATCH
END
GO


CREATE OR ALTER PROCEDURE spu_ActualizarAvatar
    @idUsuario INT,
    @fotoPerfil NVARCHAR(MAX),
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuario)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'Usuario no encontrado';
            RETURN;
        END

        UPDATE UsuarioRegistrado 
             SET fotoPerfil = @fotoPerfil
        WHERE idUsuarioRegistrado = @idUsuario;

        SELECT 
            idUsuarioRegistrado,
            fotoPerfil
        FROM UsuarioRegistrado
        WHERE idUsuarioRegistrado = @idUsuario;

        SET @resultado = 200;
        SET @mensaje = 'Avatar actualizado exitosamente';
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al actualizar el avatar: ' + ERROR_MESSAGE();
    END CATCH
END
GO

CREATE OR ALTER PROCEDURE sps_ObtenerPerfilPorId
    @idUsuario INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuario)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'Usuario no encontrado';
            RETURN;
        END

        SELECT 
            ur.idUsuarioRegistrado,
            ur.nombre,
            ur.primerApellido,
            ur.segundoApellido,
            ur.fotoPerfil,
            a.nombreUsuario,
            i.idInstitucion,
            i.nombreInstitucion,
            i.nivelEducativo,
            (SELECT COUNT(*) FROM Seguidor s WHERE s.idUsuarioSeguido = ur.idUsuarioRegistrado) AS numeroSeguidores,
            (SELECT COUNT(*) FROM Seguidor s WHERE s.idUsuarioSeguidor = ur.idUsuarioRegistrado) AS numeroSeguidos
        FROM UsuarioRegistrado ur
        INNER JOIN Acceso a ON ur.idAcceso = a.idAcceso
        INNER JOIN Institucion i ON ur.idInstitucion = i.idInstitucion
        WHERE ur.idUsuarioRegistrado = @idUsuario;
        
        SET @resultado = 200;
        SET @mensaje = 'Perfil recuperado exitosamente';
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al recuperar el perfil: ' + ERROR_MESSAGE();
    END CATCH
END
GO

CREATE OR ALTER PROCEDURE sps_RecuperarPerfiles
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        SELECT 
            ur.idUsuarioRegistrado,
            ur.nombre,
            a.nombreUsuario,
            ur.primerApellido,
            ur.segundoApellido,
            ur.fotoPerfil,
            (SELECT COUNT(*) FROM Publicacion p WHERE p.idUsuarioRegistrado = ur.idUsuarioRegistrado) AS numeroPublicaciones,
            (SELECT COUNT(*) FROM Seguidor s WHERE s.idUsuarioSeguido = ur.idUsuarioRegistrado) AS numeroSeguidores,
            i.nivelEducativo
        FROM UsuarioRegistrado ur
        INNER JOIN Acceso a ON ur.idAcceso = a.idAcceso
        INNER JOIN Institucion i ON ur.idInstitucion = i.idInstitucion
        WHERE a.estado = 'Activo'
        ORDER BY ur.nombre, ur.primerApellido;
        
        SET @resultado = 200;
        SET @mensaje = 'Perfiles recuperados exitosamente';
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al recuperar los perfiles: ' + ERROR_MESSAGE();
    END CATCH
END
GO

CREATE OR ALTER PROCEDURE spi_CambiarContrasena
    @correo NVARCHAR(256),
    @nuevaContrasenia NVARCHAR(300),
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Acceso WHERE correo = @correo)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El correo proporcionado no está registrado en el sistema';
            RETURN;
        END
        
        UPDATE Acceso
        SET contrasenia = @nuevaContrasenia
        WHERE correo = @correo;
        
        SET @resultado = 200;
        SET @mensaje = 'Contraseña actualizada correctamente';
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al actualizar la contraseña: ' + ERROR_MESSAGE();
    END CATCH
END
GO


CREATE OR ALTER PROCEDURE spi_InsertarDocumento
    @titulo NVARCHAR(100),
    @ruta NVARCHAR(MAX),
    @idUsuarioRegistrado INT, 
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT,
    @idDocumento INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    SET @resultado = 500;
    SET @mensaje = 'Error interno';
    SET @idDocumento = NULL;
    
    BEGIN TRY
        BEGIN TRANSACTION;

        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuarioRegistrado)
        BEGIN
            SET @resultado = 401;
            SET @mensaje = 'Usuario no autorizado';
            GOTO ExitWithRollback;
        END

        INSERT INTO Documento (titulo, ruta)
        VALUES (@titulo, @ruta);
        
        SET @idDocumento = SCOPE_IDENTITY();
        SET @resultado = 201;
        SET @mensaje = 'Documento creado exitosamente';

        COMMIT TRANSACTION;
        GOTO ExitSuccess;

        ExitWithRollback:
            ROLLBACK TRANSACTION;
            GOTO ExitSuccess;

        ExitSuccess:
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        SET @resultado = 500;
        SET @mensaje = ERROR_MESSAGE();
        SET @idDocumento = NULL;
    END CATCH
END
GO

-- Procedimiento almacenado para insertar una nueva publicación
CREATE OR ALTER PROCEDURE spi_InsertarPublicacion
    @idCategoria INT,
    @resuContenido NVARCHAR(200),
    @estado NVARCHAR(20),
    @nivelEducativo NVARCHAR(20),
    @idUsuarioRegistrado INT,
    @idMateriaYRama INT,
    @idDocumento INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT,
    @idPublicacion INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    SET @resultado = 500;
    SET @mensaje = 'Error interno';
    SET @idPublicacion = NULL;
    
    BEGIN TRY
        BEGIN TRANSACTION;

        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuarioRegistrado)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El usuario registrado no existe';
            GOTO ExitWithRollback;
        END

        IF NOT EXISTS (SELECT 1 FROM MateriaYRama WHERE idMateriaYRama = @idMateriaYRama)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La materia en esa rama o la rama no existe';
            GOTO ExitWithRollback;
        END

        IF NOT EXISTS (SELECT 1 FROM Documento WHERE idDocumento = @idDocumento)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El documento no existe';
            GOTO ExitWithRollback;
        END

        INSERT INTO Publicacion (
            idCategoria, 
            fecha, 
            resuContenido, 
            estado, 
            numeroLiker, 
            nivelEducativo, 
            numeroVisualizaciones, 
            numeroDescargas, 
            idUsuarioRegistrado, 
            idMateriaYRama, 
            idDocumento
        )
        VALUES (
            @idCategoria, 
            GETDATE(), 
            @resuContenido, 
            @estado, 
            0, -- Inicializar número de likes en 0
            @nivelEducativo, 
            0, -- Inicializar número de visualizaciones en 0
            0, -- Inicializar número de descargas en 0
            @idUsuarioRegistrado, 
            @idMateriaYRama, 
            @idDocumento
        );

        SET @idPublicacion = SCOPE_IDENTITY();
        SET @resultado = 201;
        SET @mensaje = 'Publicación creada exitosamente';

        COMMIT TRANSACTION;
        GOTO ExitSuccess;

        ExitWithRollback:
            ROLLBACK TRANSACTION;
            GOTO ExitSuccess;

        ExitSuccess:
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        SET @resultado = 500;
        SET @mensaje = ERROR_MESSAGE();
        SET @idPublicacion = NULL;
    END CATCH
END
GO

CREATE OR ALTER PROCEDURE sps_ObtenerPublicaciones
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            p.idPublicacion,
            p.idCategoria,
            p.fecha,
            p.resuContenido,
            p.estado,
            p.numeroLiker,
            p.nivelEducativo,
            p.numeroVisualizaciones,
            p.numeroDescargas,
            p.idUsuarioRegistrado,
            p.idMateriaYRama,
            p.idDocumento,
            d.titulo,
            d.ruta,
            ur.nombre + ' ' + ur.primerApellido + ' ' + ur.segundoApellido AS nombreCompleto
        FROM Publicacion p
        INNER JOIN UsuarioRegistrado ur ON p.idUsuarioRegistrado = ur.idUsuarioRegistrado
        INNER JOIN Documento d ON p.idDocumento = d.idDocumento
        WHERE p.estado = 'Aceptado'
        ORDER BY p.fecha DESC;

        SET @resultado = 200;
        SET @mensaje = 'Publicaciones obtenidas exitosamente';
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = ERROR_MESSAGE();
    END CATCH
END
GO

CREATE OR ALTER PROCEDURE sps_ObtenerPublicacionesPendientes
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        SELECT 
            p.idPublicacion,
            p.idCategoria,
            p.fecha,
            p.resuContenido,
            p.estado,
            p.numeroLiker,
            p.nivelEducativo,
            p.numeroVisualizaciones,
            p.numeroDescargas,
            p.idUsuarioRegistrado,
            p.idMateriaYRama,
            p.idDocumento,
            d.titulo,
            d.ruta,
            ur.nombre + ' ' + ur.primerApellido + ' ' + ur.segundoApellido AS nombreCompleto
        FROM Publicacion p
        INNER JOIN UsuarioRegistrado ur ON p.idUsuarioRegistrado = ur.idUsuarioRegistrado
        INNER JOIN Documento d ON p.idDocumento = d.idDocumento
        WHERE p.estado = 'EnRevision'
        ORDER BY p.fecha DESC;

        SET @resultado = 200;
        SET @mensaje = 'Publicaciones obtenidas exitosamente';
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = ERROR_MESSAGE();
    END CATCH
END
GO

CREATE OR ALTER PROCEDURE sps_ObtenerPublicacionPorId
    @idPublicacion INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Publicacion WHERE idPublicacion = @idPublicacion)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La publicación no existe';
            RETURN;
        END

        SELECT 
            p.idPublicacion,
            p.idCategoria,
            p.fecha,
            p.resuContenido,
            p.estado,
            p.numeroLiker,
            p.nivelEducativo,
            p.numeroVisualizaciones,
            p.numeroDescargas,
            p.idUsuarioRegistrado,
            p.idMateriaYRama,
            p.idDocumento,
            d.titulo,
            d.ruta,
            ur.nombre + ' ' + ur.primerApellido + ' ' + ur.segundoApellido AS nombreCompleto
        FROM Publicacion p
        INNER JOIN UsuarioRegistrado ur ON p.idUsuarioRegistrado = ur.idUsuarioRegistrado
        INNER JOIN Documento d ON p.idDocumento = d.idDocumento
        WHERE p.idPublicacion = @idPublicacion AND p.estado = 'Aceptado';

        -- Incrementar número de visualizaciones
        UPDATE Publicacion 
        SET numeroVisualizaciones = numeroVisualizaciones + 1
        WHERE idPublicacion = @idPublicacion;

        SET @resultado = 200;
        SET @mensaje = 'Publicación obtenida exitosamente';
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = ERROR_MESSAGE();
    END CATCH
END
GO

CREATE OR ALTER PROCEDURE sps_ObtenerPublicacionesPropias
    @idUsuario INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuario)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El usuario no existe';
            RETURN;
        END

        SELECT 
            p.idPublicacion,
            p.idCategoria,
            p.fecha,
            p.resuContenido,
            p.estado,
            p.numeroLiker,
            p.nivelEducativo,
            p.numeroVisualizaciones,
            p.numeroDescargas,
            p.idUsuarioRegistrado,
            p.idMateriaYRama,
            p.idDocumento,
            d.titulo,
            d.ruta,
            ur.nombre + ' ' + ur.primerApellido + ' ' + ur.segundoApellido AS nombreCompleto
        FROM Publicacion p
        JOIN UsuarioRegistrado ur ON p.idUsuarioRegistrado = ur.idUsuarioRegistrado
        JOIN Documento d ON p.idDocumento = d.idDocumento
        WHERE p.idUsuarioRegistrado = @idUsuario
        ORDER BY p.fecha DESC;

        SET @resultado = 200;
        SET @mensaje = 'Publicaciones del usuario obtenidas exitosamente';
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = ERROR_MESSAGE();
    END CATCH
END
GO

CREATE OR ALTER PROCEDURE sps_ObtenerPublicacionesPorCategoria
    @idCategoria INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Categoria WHERE idCategoria = @idCategoria)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La categoría no existe';
            RETURN;
        END

        SELECT 
            p.idPublicacion,
            p.idCategoria,
            p.fecha,
            p.resuContenido,
            p.estado,
            p.numeroLiker,
            p.nivelEducativo,
            p.numeroVisualizaciones,
            p.numeroDescargas,
            p.idUsuarioRegistrado,
            p.idMateriaYRama,
            p.idDocumento,
            d.titulo,
            d.ruta,
            ur.nombre + ' ' + ur.primerApellido + ' ' + ur.segundoApellido AS nombreCompleto
        FROM Publicacion p
        JOIN UsuarioRegistrado ur ON p.idUsuarioRegistrado = ur.idUsuarioRegistrado
        JOIN Documento d ON p.idDocumento = d.idDocumento
        WHERE p.idCategoria = @idCategoria AND p.estado = 'Aceptado'
        ORDER BY p.fecha DESC;

        SET @resultado = 200;
        SET @mensaje = 'Publicaciones por categoría obtenidas exitosamente';
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = ERROR_MESSAGE();
    END CATCH
END
GO

-- Procedimiento para obtener publicaciones por rama
CREATE OR ALTER PROCEDURE sps_ObtenerPublicacionesPorRama
    @idRama INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Rama WHERE idRama = @idRama)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La rama no existe';
            RETURN;
        END

        SELECT 
            p.idPublicacion,
            p.idCategoria,
            p.fecha,
            p.resuContenido,
            p.estado,
            p.numeroLiker,
            p.nivelEducativo,
            p.numeroVisualizaciones,
            p.numeroDescargas,
            p.idUsuarioRegistrado,
            p.idMateriaYRama,
            p.idDocumento,
            d.titulo,
            d.ruta,
            ur.nombre + ' ' + ur.primerApellido + ' ' + ur.segundoApellido AS nombreCompleto
        FROM Publicacion p
        JOIN UsuarioRegistrado ur ON p.idUsuarioRegistrado = ur.idUsuarioRegistrado
        JOIN Documento d ON p.idDocumento = d.idDocumento
        JOIN MateriaYRama myr ON p.idMateriaYRama = myr.idMateriaYRama
        WHERE myr.idRama = @idRama AND p.estado = 'Aceptado'
        ORDER BY p.fecha DESC;

        SET @resultado = 200;
        SET @mensaje = 'Publicaciones por rama obtenidas exitosamente';
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = ERROR_MESSAGE();
    END CATCH
END
GO

-- Procedimiento para obtener publicaciones por nivel educativo
CREATE OR ALTER PROCEDURE sps_ObtenerPublicacionesPorNivelEducativo
    @nivelEducativo NVARCHAR(20),
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        -- Validar que el nivel educativo sea válido
        IF @nivelEducativo NOT IN ('Preparatoria', 'Universidad')
        BEGIN
            SET @resultado = 400;
            SET @mensaje = 'El nivel educativo debe ser Preparatoria o Universidad';
            RETURN;
        END

        SELECT 
            p.idPublicacion,
            p.idCategoria,
            p.fecha,
            p.resuContenido,
            p.estado,
            p.numeroLiker,
            p.nivelEducativo,
            p.numeroVisualizaciones,
            p.numeroDescargas,
            p.idUsuarioRegistrado,
            p.idMateriaYRama,
            p.idDocumento,
            d.titulo,
            d.ruta,
            ur.nombre + ' ' + ur.primerApellido + ' ' + ur.segundoApellido AS nombreCompleto
        FROM Publicacion p
        JOIN UsuarioRegistrado ur ON p.idUsuarioRegistrado = ur.idUsuarioRegistrado
        JOIN Documento d ON p.idDocumento = d.idDocumento
        WHERE p.nivelEducativo = @nivelEducativo AND p.estado = 'Aceptado'
        ORDER BY p.fecha DESC;

        SET @resultado = 200;
        SET @mensaje = 'Publicaciones por nivel educativo obtenidas exitosamente';
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = ERROR_MESSAGE();
    END CATCH
END
GO

CREATE OR ALTER PROCEDURE sps_ObtenerPublicacionesPorUsuario
    @idUsuario INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuario)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El usuario no existe';
            RETURN;
        END

        SELECT 
            p.idPublicacion,
            p.idCategoria,
            p.fecha,
            p.resuContenido,
            p.estado,
            p.numeroLiker,
            p.nivelEducativo,
            p.numeroVisualizaciones,
            p.numeroDescargas,
            p.idUsuarioRegistrado,
            p.idMateriaYRama,
            p.idDocumento,
            d.titulo,
            d.ruta,
            ur.nombre + ' ' + ur.primerApellido + ' ' + ur.segundoApellido AS nombreCompleto
        FROM Publicacion p
        JOIN UsuarioRegistrado ur ON p.idUsuarioRegistrado = ur.idUsuarioRegistrado
        JOIN Documento d ON p.idDocumento = d.idDocumento
        WHERE p.idUsuarioRegistrado = @idUsuario AND p.estado = 'Aceptado'
        ORDER BY p.fecha DESC;

        SET @resultado = 200;
        SET @mensaje = 'Publicaciones del usuario obtenidas exitosamente';
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = ERROR_MESSAGE();
    END CATCH
END
GO

CREATE OR ALTER PROCEDURE spi_DarLikePublicacion
    @idPublicacion INT,
    @idUsuario INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Publicacion WHERE idPublicacion = @idPublicacion)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La publicación no existe';
            RETURN;
        END
        
        IF EXISTS (SELECT 1 FROM LikePublicacion WHERE idPublicacion = @idPublicacion AND idUsuario = @idUsuario)
        BEGIN
            SET @resultado = 409;
            SET @mensaje = 'Ya has dado like a esta publicación';
            RETURN;
        END
        
        BEGIN TRANSACTION;
        
        INSERT INTO LikePublicacion (idPublicacion, idUsuario)
        VALUES (@idPublicacion, @idUsuario);
        
        UPDATE Publicacion 
        SET numeroLiker = numeroLiker + 1
        WHERE idPublicacion = @idPublicacion;
        
        COMMIT TRANSACTION;
        
        SET @resultado = 201;
        SET @mensaje = 'Like agregado exitosamente';
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        SET @resultado = 500;
        SET @mensaje = 'Error interno del servidor';
    END CATCH
END
GO

CREATE OR ALTER PROCEDURE spd_QuitarLikePublicacion
    @idPublicacion INT,
    @idUsuario INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Publicacion WHERE idPublicacion = @idPublicacion)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La publicación no existe';
            RETURN;
        END
        
        IF NOT EXISTS (SELECT 1 FROM LikePublicacion WHERE idPublicacion = @idPublicacion AND idUsuario = @idUsuario)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'No has dado like a esta publicación';
            RETURN;
        END
        
        BEGIN TRANSACTION;
        
        DELETE FROM LikePublicacion 
        WHERE idPublicacion = @idPublicacion AND idUsuario = @idUsuario;
        
        UPDATE Publicacion 
        SET numeroLiker = numeroLiker - 1
        WHERE idPublicacion = @idPublicacion;
        
        COMMIT TRANSACTION;
        
        SET @resultado = 200;
        SET @mensaje = 'Like eliminado exitosamente';
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        SET @resultado = 500;
        SET @mensaje = 'Error interno del servidor';
    END CATCH
END
GO

-- Procedimiento para verificar si un usuario ya dio like a una publicación
CREATE OR ALTER PROCEDURE sps_VerificarLikeUsuario
    @idPublicacion INT,
    @idUsuario INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF EXISTS (SELECT 1 FROM LikePublicacion WHERE idPublicacion = @idPublicacion AND idUsuario = @idUsuario)
        BEGIN
            SET @resultado = 200;
            SET @mensaje = 'El usuario ya dio like a esta publicación';
        END
        ELSE
        BEGIN
            SET @resultado = 204;
            SET @mensaje = 'El usuario no ha dado like a esta publicación';
        END
        
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error interno del servidor';
    END CATCH
END
GO


-- Procedimiento para registrar visualización
CREATE OR ALTER PROCEDURE spu_RegistrarVisualizacion
    @idPublicacion INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Publicacion WHERE idPublicacion = @idPublicacion)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La publicación no existe';
            RETURN;
        END
        
        UPDATE Publicacion 
        SET numeroVisualizaciones = numeroVisualizaciones + 1
        WHERE idPublicacion = @idPublicacion;
        
        SET @resultado = 200;
        SET @mensaje = 'Visualización registrada correctamente';
        
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error interno del servidor al registrar la visualización';
    END CATCH
END;
GO

-- Procedimiento para registrar descarga
CREATE OR ALTER PROCEDURE spu_RegistrarDescarga
    @idPublicacion INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Publicacion WHERE idPublicacion = @idPublicacion)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La publicación no existe';
            RETURN;
        END
        
        UPDATE Publicacion 
        SET numeroDescargas = numeroDescargas + 1
        WHERE idPublicacion = @idPublicacion;
        
        SET @resultado = 200;
        SET @mensaje = 'Descarga registrada correctamente';
        
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error interno del servidor al registrar la descarga';
    END CATCH
END;
GO

-- Procedimiento para aprobar publicación
CREATE OR ALTER PROCEDURE spu_AprobarPublicacion
    @idPublicacion INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Publicacion WHERE idPublicacion = @idPublicacion)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La publicación no existe';
            RETURN;
        END
        
        IF NOT EXISTS (SELECT 1 FROM Publicacion WHERE idPublicacion = @idPublicacion AND estado = 'EnRevision')
        BEGIN
            SET @resultado = 400;
            SET @mensaje = 'Solo se pueden aprobar publicaciones en revisión';
            RETURN;
        END
        
        UPDATE Publicacion 
        SET estado = 'Aceptado'
        WHERE idPublicacion = @idPublicacion;
        
        SET @resultado = 200;
        SET @mensaje = 'Publicación aprobada correctamente';
        
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error interno del servidor al aprobar la publicación';
    END CATCH
END;
GO

-- Procedimiento para rechazar publicación
CREATE OR ALTER PROCEDURE spu_RechazarPublicacion
    @idPublicacion INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Publicacion WHERE idPublicacion = @idPublicacion)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La publicación no existe';
            RETURN;
        END
        
        IF NOT EXISTS (SELECT 1 FROM Publicacion WHERE idPublicacion = @idPublicacion AND estado = 'EnRevision')
        BEGIN
            SET @resultado = 400;
            SET @mensaje = 'Solo se pueden rechazar publicaciones en revisión';
            RETURN;
        END
        
        UPDATE Publicacion 
        SET estado = 'Rechazado'
        WHERE idPublicacion = @idPublicacion;
        
        SET @resultado = 200;
        SET @mensaje = 'Publicación rechazada correctamente';
        
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error interno del servidor al rechazar la publicación';
    END CATCH
END;
GO


CREATE OR ALTER PROCEDURE sps_verificarUsuarioAdminoPropietario
    @idUsuario INT,
    @idPublicacion INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Publicacion WHERE idPublicacion = @idPublicacion)
    BEGIN 
        SET @resultado = 404;
        SET @mensaje = 'La publicación no existe';
        RETURN;
    END

    IF EXISTS (
        SELECT 1 FROM Publicacion 
        WHERE idPublicacion = @idPublicacion AND idUsuarioRegistrado = @idUsuario
    )
    BEGIN
        SET @resultado = 200;
        SET @mensaje = 'El usuario es el propietario de la publicación';
    END
    ELSE
    BEGIN
        SET @resultado = 403;
        SET @mensaje = 'El usuario no es el propietario de la publicación';
    END
END
GO

CREATE OR ALTER PROCEDURE sp_EliminarPublicacion
    @idPublicacion INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Publicacion WHERE idPublicacion = @idPublicacion)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La publicación no existe';
            RETURN;
        END
        
        BEGIN TRANSACTION;
        
        DECLARE @idDocumento INT;
        SELECT @idDocumento = idDocumento FROM Publicacion WHERE idPublicacion = @idPublicacion;
        
        DELETE FROM LikePublicacion WHERE idPublicacion = @idPublicacion;
        DELETE FROM Comentario WHERE idPublicacion = @idPublicacion;
        DELETE FROM Publicacion WHERE idPublicacion = @idPublicacion;
        
        IF @idDocumento IS NOT NULL
        BEGIN
            DELETE FROM Documento WHERE idDocumento = @idDocumento;
        END
        
        COMMIT TRANSACTION;
        
        SET @resultado = 200;
        SET @mensaje = 'Publicación eliminada exitosamente';
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        SET @resultado = 400;
        SET @mensaje = 'Error al eliminar la publicación: ' + ERROR_MESSAGE();
    END CATCH
END


CREATE OR ALTER PROCEDURE spi_SeguirUsuario
    @idUsuarioSeguidor INT,
    @idUsuarioSeguido INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuarioSeguidor)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El usuario seguidor no existe.';
            RETURN;
        END
        
        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuarioSeguido)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El usuario a seguir no existe.';
            RETURN;
        END
        
        IF @idUsuarioSeguidor = @idUsuarioSeguido
        BEGIN
            SET @resultado = 400;
            SET @mensaje = 'No puedes seguirte a ti mismo.';
            RETURN;
        END
        
        IF EXISTS (SELECT 1 FROM Seguidor WHERE idUsuarioSeguidor = @idUsuarioSeguidor AND idUsuarioSeguido = @idUsuarioSeguido)
        BEGIN
            SET @resultado = 409;
            SET @mensaje = 'Ya sigues a este usuario.';
            RETURN;
        END
        
        INSERT INTO Seguidor (idUsuarioSeguidor, idUsuarioSeguido)
        VALUES (@idUsuarioSeguidor, @idUsuarioSeguido);
        
        SET @resultado = 200;
        SET @mensaje = 'Ahora sigues a este usuario.';
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al seguir al usuario: ' + ERROR_MESSAGE();
    END CATCH;
END;
GO

-- Procedimiento para dejar de seguir a un usuario
CREATE OR ALTER PROCEDURE spi_DejarDeSeguirUsuario
    @idUsuarioSeguidor INT,
    @idUsuarioSeguido INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM Seguidor WHERE idUsuarioSeguidor = @idUsuarioSeguidor AND idUsuarioSeguido = @idUsuarioSeguido)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'No sigues a este usuario.';
            RETURN;
        END
        
        DELETE FROM Seguidor 
        WHERE idUsuarioSeguidor = @idUsuarioSeguidor AND idUsuarioSeguido = @idUsuarioSeguido;
        
        SET @resultado = 200;
        SET @mensaje = 'Has dejado de seguir a este usuario.';
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al dejar de seguir al usuario: ' + ERROR_MESSAGE();
    END CATCH;
END;
GO

-- Procedimiento para obtener los seguidores de un usuario
CREATE OR ALTER PROCEDURE spi_ObtenerSeguidores
    @idUsuario INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuario)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El usuario no existe.';
            RETURN;
        END
        
        SELECT 
            ur.idUsuarioRegistrado,
            ur.nombre,
            ur.primerApellido,
            ur.segundoApellido,
            ur.fotoPerfil,
            a.nombreUsuario,
            i.nombreInstitucion,
            i.nivelEducativo
        FROM Seguidor s
        INNER JOIN UsuarioRegistrado ur ON s.idUsuarioSeguidor = ur.idUsuarioRegistrado
        INNER JOIN Acceso a ON ur.idAcceso = a.idAcceso
        INNER JOIN Institucion i ON ur.idInstitucion = i.idInstitucion
        WHERE s.idUsuarioSeguido = @idUsuario
        ORDER BY ur.nombre, ur.primerApellido;
        
        SET @resultado = 200;
        SET @mensaje = 'Seguidores obtenidos exitosamente.';
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al obtener los seguidores: ' + ERROR_MESSAGE();
    END CATCH;
END;
GO

-- Procedimiento para obtener los usuarios seguidos por un usuario
CREATE OR ALTER PROCEDURE spi_ObtenerSeguidos
    @idUsuario INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuario)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El usuario no existe.';
            RETURN;
        END
        
        SELECT 
            ur.idUsuarioRegistrado,
            ur.nombre,
            ur.primerApellido,
            ur.segundoApellido,
            ur.fotoPerfil,
            a.nombreUsuario,
            i.nombreInstitucion,
            i.nivelEducativo
        FROM Seguidor s
        INNER JOIN UsuarioRegistrado ur ON s.idUsuarioSeguido = ur.idUsuarioRegistrado
        INNER JOIN Acceso a ON ur.idAcceso = a.idAcceso
        INNER JOIN Institucion i ON ur.idInstitucion = i.idInstitucion
        WHERE s.idUsuarioSeguidor = @idUsuario
        ORDER BY ur.nombre, ur.primerApellido;
        
        SET @resultado = 200;
        SET @mensaje = 'Usuarios seguidos obtenidos exitosamente.';
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al obtener los usuarios seguidos: ' + ERROR_MESSAGE();
    END CATCH;
END;
GO

-- Procedimiento para verificar si un usuario sigue a otro
CREATE OR ALTER PROCEDURE spi_VerificarSeguimiento
    @idUsuarioSeguidor INT,
    @idUsuarioSeguido INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuarioSeguidor)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El usuario seguidor no existe.';
            RETURN;
        END
        
        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuarioSeguido)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El usuario consultado no existe.';
            RETURN;
        END
        
        IF EXISTS (SELECT 1 FROM Seguidor WHERE idUsuarioSeguidor = @idUsuarioSeguidor AND idUsuarioSeguido = @idUsuarioSeguido)
        BEGIN
            SET @resultado = 200;
            SET @mensaje = 'El usuario está siendo seguido.';
        END
        ELSE
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El usuario no está siendo seguido.';
        END
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al verificar el seguimiento: ' + ERROR_MESSAGE();
    END CATCH;
END;
GO