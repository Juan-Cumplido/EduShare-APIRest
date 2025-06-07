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
        
        -- Insertar en la tabla UsuarioRegistrado
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