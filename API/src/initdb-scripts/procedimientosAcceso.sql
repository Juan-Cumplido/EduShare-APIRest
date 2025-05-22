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
        
        DECLARE @documentosAEliminar TABLE (idDocumento INT);
        INSERT INTO @documentosAEliminar
        SELECT idDocumento FROM Publicacion WHERE idUsuarioRegistrado = @idUsuarioRegistrado;
        
        DELETE FROM Publicacion WHERE idUsuarioRegistrado = @idUsuarioRegistrado;
        
        -- Eliminar documentos asociados a las publicaciones
        DELETE FROM Documento WHERE idDocumento IN (SELECT idDocumento FROM @documentosAEliminar);
        
        -- Eliminar el usuario registrado
        DELETE FROM UsuarioRegistrado WHERE idAcceso = @idAcceso;
        
        -- Eliminar el acceso
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
