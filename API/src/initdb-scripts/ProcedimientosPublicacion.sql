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
            ur.nombre + ' ' + ur.primerApellido + ' ' + ur.segundoApellido AS nombreCompleto
        FROM Publicacion p
        INNER JOIN UsuarioRegistrado ur ON p.idUsuarioRegistrado = ur.idUsuarioRegistrado
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
            ur.nombre + ' ' + ur.apellidoPaterno + ' ' + ur.apellidoMaterno AS nombreCompleto
        FROM Publicacion p
        INNER JOIN UsuarioRegistrado ur ON p.idUsuarioRegistrado = ur.idUsuarioRegistrado
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
            ur.nombre + ' ' + ur.primerApellido + ' ' + ur.segundoApellido AS nombreCompleto
        FROM Publicacion p
        JOIN UsuarioRegistrado ur ON p.idUsuarioRegistrado = ur.idUsuarioRegistrado
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
            ur.nombre + ' ' + ur.primerApellido + ' ' + ur.segundoApellido AS nombreCompleto
        FROM Publicacion p
        JOIN UsuarioRegistrado ur ON p.idUsuarioRegistrado = ur.idUsuarioRegistrado
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
            ur.nombre + ' ' + ur.primerApellido + ' ' + ur.segundoApellido AS nombreCompleto
        FROM Publicacion p
        JOIN UsuarioRegistrado ur ON p.idUsuarioRegistrado = ur.idUsuarioRegistrado
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
            ur.nombre + ' ' + ur.primerApellido + ' ' + ur.segundoApellido AS nombreCompleto
        FROM Publicacion p
        JOIN UsuarioRegistrado ur ON p.idUsuarioRegistrado = ur.idUsuarioRegistrado
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
            ur.nombre + ' ' + ur.primerApellido + ' ' + ur.segundoApellido AS nombreCompleto
        FROM Publicacion p
        INNER JOIN UsuarioRegistrado ur ON p.idUsuarioRegistrado = ur.idUsuarioRegistrado
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

---------------------------------------------------------------------------------------------

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