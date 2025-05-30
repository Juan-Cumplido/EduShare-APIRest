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

-- Procedimiento almacenado para eliminar una publicación
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

-- Procedimiento almacenado para obtener publicaciones con paginación y filtros
CREATE OR ALTER PROCEDURE sps_ObtenerPublicaciones
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
CREATE OR ALTER PROCEDURE sps_ObtenerPublicacionPorId
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
CREATE OR ALTER PROCEDURE spu_ActualizarPublicacion
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


-- Procedimiento almacenado para incrementar el contador de visualizaciones
CREATE OR ALTER PROCEDURE spu_IncrementarVisualizacion
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
CREATE OR ALTER PROCEDURE spu_IncrementarDescarga
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
CREATE OR ALTER PROCEDURE spu_IncrementarLike
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

CREATE OR ALTER PROCEDURE sps_verificarUsuarioAdminoPropietario
    @idUsuarioRegistrado INT,
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
        WHERE idPublicacion = @idPublicacion AND idUsuario = @idUsuarioRegistrado
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