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