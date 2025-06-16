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
