-- Procedimiento almacenado para insertar una nueva publicación
CREATE PROCEDURE spi_InsertarPublicacion
    @categoria NVARCHAR(25),
    @resuContenido NVARCHAR(200),
    @estado NVARCHAR(20),
    @nivelEducativo NVARCHAR(20),
    @idUsuarioRegistrado INT,
    @idRama INT,
    @idMateria INT,
    @idDocumento INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT,
    @idPublicacion INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Verificar si existe el usuario registrado
        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuarioRegistrado)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El usuario registrado no existe';
            RETURN;
        END

        -- Verificar si existe la rama
        IF NOT EXISTS (SELECT 1 FROM Rama WHERE idRama = @idRama)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La rama no existe';
            RETURN;
        END

        -- Verificar si existe la materia
        IF NOT EXISTS (SELECT 1 FROM Materia WHERE idMateria = @idMateria)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La materia no existe';
            RETURN;
        END

        -- Verificar si existe el documento
        IF NOT EXISTS (SELECT 1 FROM Documento WHERE idDocumento = @idDocumento)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El documento no existe';
            RETURN;
        END

        -- Insertar la publicación
        INSERT INTO Publicacion (
            categoria, 
            fecha, 
            resuContenido, 
            estado, 
            numeroLiker, 
            nivelEducativo, 
            numeroVisualizaciones, 
            numeroDescargas, 
            idUsuarioRegistrado, 
            idRama, 
            idMateria, 
            idDocumento
        )
        VALUES (
            @categoria, 
            GETDATE(), 
            @resuContenido, 
            @estado, 
            0, -- Inicializar número de likes en 0
            @nivelEducativo, 
            0, -- Inicializar número de visualizaciones en 0
            0, -- Inicializar número de descargas en 0
            @idUsuarioRegistrado, 
            @idRama, 
            @idMateria, 
            @idDocumento
        );

        SET @idPublicacion = SCOPE_IDENTITY();
        SET @resultado = 201; -- Código HTTP Created
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

-- Procedimiento almacenado para obtener publicaciones con paginación y filtros
CREATE PROCEDURE sps_ObtenerPublicaciones
    @limite INT = 10,
    @pagina INT = 1,
    @categoria NVARCHAR(25) = NULL,
    @nivelEducativo NVARCHAR(20) = NULL,
    @idRama INT = NULL,
    @idMateria INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Calcular el offset para la paginación
    DECLARE @offset INT = (@pagina - 1) * @limite;
    
    -- Contar el total de registros que coinciden con los filtros
    SELECT COUNT(*) AS totalRegistros 
    FROM Publicacion p
    WHERE 
        (@categoria IS NULL OR p.categoria = @categoria)
        AND (@nivelEducativo IS NULL OR p.nivelEducativo = @nivelEducativo)
        AND (@idRama IS NULL OR p.idRama = @idRama)
        AND (@idMateria IS NULL OR p.idMateria = @idMateria);
    
    -- Obtener los resultados paginados
    SELECT 
        p.idPublicacion,
        p.categoria,
        p.fecha,
        p.resuContenido,
        p.estado,
        p.numeroLiker,
        p.nivelEducativo,
        p.numeroVisualizaciones,
        p.numeroDescargas,
        p.idUsuarioRegistrado,
        u.nombre AS nombreUsuario,
        u.primerApellido,
        u.segundoApellido,
        u.fotoRuta AS fotoUsuario,
        p.idRama,
        r.nombreRama,
        p.idMateria,
        m.nombreMateria,
        p.idDocumento,
        d.titulo AS tituloDocumento,
        COUNT(*) OVER() AS totalRegistros
    FROM 
        Publicacion p
        INNER JOIN UsuarioRegistrado u ON p.idUsuarioRegistrado = u.idUsuarioRegistrado
        INNER JOIN Rama r ON p.idRama = r.idRama
        INNER JOIN Materia m ON p.idMateria = m.idMateria
        INNER JOIN Documento d ON p.idDocumento = d.idDocumento
    WHERE 
        (@categoria IS NULL OR p.categoria = @categoria)
        AND (@nivelEducativo IS NULL OR p.nivelEducativo = @nivelEducativo)
        AND (@idRama IS NULL OR p.idRama = @idRama)
        AND (@idMateria IS NULL OR p.idMateria = @idMateria)
    ORDER BY 
        p.fecha DESC
    OFFSET @offset ROWS
    FETCH NEXT @limite ROWS ONLY;
END
GO

-- Procedimiento almacenado para obtener una publicación por su ID
CREATE PROCEDURE sps_ObtenerPublicacionPorId
    @idPublicacion INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        p.idPublicacion,
        p.categoria,
        p.fecha,
        p.resuContenido,
        p.estado,
        p.numeroLiker,
        p.nivelEducativo,
        p.numeroVisualizaciones,
        p.numeroDescargas,
        p.idUsuarioRegistrado,
        u.nombre AS nombreUsuario,
        u.primerApellido,
        u.segundoApellido,
        u.fotoRuta AS fotoUsuario,
        p.idRama,
        r.nombreRama,
        p.idMateria,
        m.nombreMateria,
        p.idDocumento,
        d.titulo AS tituloDocumento,
        d.ruta AS rutaDocumento
    FROM 
        Publicacion p
        INNER JOIN UsuarioRegistrado u ON p.idUsuarioRegistrado = u.idUsuarioRegistrado
        INNER JOIN Rama r ON p.idRama = r.idRama
        INNER JOIN Materia m ON p.idMateria = m.idMateria
        INNER JOIN Documento d ON p.idDocumento = d.idDocumento
    WHERE 
        p.idPublicacion = @idPublicacion;
END
GO

-- Procedimiento almacenado para actualizar una publicación
CREATE PROCEDURE spu_ActualizarPublicacion
    @idPublicacion INT,
    @categoria NVARCHAR(25),
    @resuContenido NVARCHAR(200),
    @estado NVARCHAR(20),
    @nivelEducativo NVARCHAR(20),
    @idRama INT,
    @idMateria INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Verificar si existe la publicación
        IF NOT EXISTS (SELECT 1 FROM Publicacion WHERE idPublicacion = @idPublicacion)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La publicación no existe';
            RETURN;
        END

        -- Verificar si existe la rama
        IF NOT EXISTS (SELECT 1 FROM Rama WHERE idRama = @idRama)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La rama no existe';
            RETURN;
        END

        -- Verificar si existe la materia
        IF NOT EXISTS (SELECT 1 FROM Materia WHERE idMateria = @idMateria)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La materia no existe';
            RETURN;
        END

        -- Actualizar la publicación
        UPDATE Publicacion
        SET 
            categoria = @categoria, 
            resuContenido = @resuContenido, 
            estado = @estado, 
            nivelEducativo = @nivelEducativo, 
            idRama = @idRama, 
            idMateria = @idMateria
        WHERE 
            idPublicacion = @idPublicacion;

        SET @resultado = 200;
        SET @mensaje = 'Publicación actualizada exitosamente';

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        SET @resultado = 500;
        SET @mensaje = ERROR_MESSAGE();
    END CATCH
END
GO

-- Procedimiento almacenado para eliminar una publicación
CREATE PROCEDURE spd_EliminarPublicacion
    @idPublicacion INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Verificar si existe la publicación
        IF NOT EXISTS (SELECT 1 FROM Publicacion WHERE idPublicacion = @idPublicacion)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La publicación no existe';
            RETURN;
        END

        -- Primero eliminar registros relacionados en Comentario
        DELETE FROM Comentario WHERE idPublicacion = @idPublicacion;

        -- Luego eliminar la publicación
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

-- Procedimiento almacenado para incrementar el contador de visualizaciones
CREATE PROCEDURE spu_IncrementarVisualizacion
    @idPublicacion INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Verificar si existe la publicación
        IF NOT EXISTS (SELECT 1 FROM Publicacion WHERE idPublicacion = @idPublicacion)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La publicación no existe';
            RETURN;
        END

        -- Incrementar el contador de visualizaciones
        UPDATE Publicacion
        SET numeroVisualizaciones = numeroVisualizaciones + 1
        WHERE idPublicacion = @idPublicacion;

        SET @resultado = 200;
        SET @mensaje = 'Visualización incrementada exitosamente';

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
CREATE PROCEDURE spu_IncrementarDescarga
    @idPublicacion INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Verificar si existe la publicación
        IF NOT EXISTS (SELECT 1 FROM Publicacion WHERE idPublicacion = @idPublicacion)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La publicación no existe';
            RETURN;
        END

        -- Incrementar el contador de descargas
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
CREATE PROCEDURE spu_IncrementarLike
    @idPublicacion INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Verificar si existe la publicación
        IF NOT EXISTS (SELECT 1 FROM Publicacion WHERE idPublicacion = @idPublicacion)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'La publicación no existe';
            RETURN;
        END

        -- Incrementar el contador de likes
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