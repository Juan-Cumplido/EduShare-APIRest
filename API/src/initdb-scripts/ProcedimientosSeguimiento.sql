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