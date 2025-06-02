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
    BEGIN TRY
        BEGIN TRANSACTION;

        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuarioRegistrado)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El usuario registrado no existe';
            RETURN;
        END

        IF NOT EXISTS (SELECT 1 FROM MateriaYRama WHERE idMateriaYRama = @idMateriaYRama)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La materia en esa rama o la rama no existe';
            RETURN;
        END

        IF NOT EXISTS (SELECT 1 FROM Documento WHERE idDocumento = @idDocumento)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El documento no existe';
            RETURN;
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
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SET @resultado = 500;
        SET @mensaje = ERROR_MESSAGE();
        SET @idPublicacion = NULL;
    END CATCH
END
GO

CREATE OR ALTER PROCEDURE spd_EliminarPublicacion
    @idPublicacion INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        IF NOT EXISTS (SELECT 1 FROM Publicacion WHERE idPublicacion = @idPublicacion)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La publicación no existe';
            RETURN;
        END

        DELETE FROM Comentario WHERE idPublicacion = @idPublicacion;

        DELETE FROM Publicacion WHERE idPublicacion = @idPublicacion;

        SET @resultado = 200;
        SET @mensaje = 'Publicación eliminada exitosamente';

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SET @resultado = 500;
        SET @mensaje = ERROR_MESSAGE();
    END CATCH
END
GO


-- Procedimiento almacenado para incrementar el contador de descargas
CREATE OR ALTER PROCEDURE spu_IncrementarDescarga
    @idPublicacion INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

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
        SET @mensaje = 'Descarga incrementada exitosamente';

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SET @resultado = 500;
        SET @mensaje = ERROR_MESSAGE();
    END CATCH
END
GO

-- Procedimiento almacenado para incrementar el contador de likes
CREATE OR ALTER PROCEDURE spu_IncrementarLike
    @idPublicacion INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        IF NOT EXISTS (SELECT 1 FROM Publicacion WHERE idPublicacion = @idPublicacion)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La publicación no existe';
            RETURN;
        END

        UPDATE Publicacion
        SET numeroLiker = numeroLiker + 1
        WHERE idPublicacion = @idPublicacion;

        SET @resultado = 200;
        SET @mensaje = 'Like incrementado exitosamente';

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SET @resultado = 500;
        SET @mensaje = ERROR_MESSAGE();
    END CATCH
END
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