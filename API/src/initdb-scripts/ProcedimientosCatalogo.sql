-- Procedimiento almacenado para recuperar todas las categorías
CREATE OR ALTER PROCEDURE spi_RecuperarCategorias
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
CREATE OR ALTER PROCEDURE spi_RecuperarRamas
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
CREATE OR ALTER PROCEDURE spi_RecuperarMaterias
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
CREATE OR ALTER PROCEDURE spi_RecuperarMateriasPorRama
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
                r.nombreRama
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
    @nivelEducativo NVARCHAR(20) = NULL, -- Parámetro opcional para filtrar por nivel
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

        -- Verificar si existen instituciones con el filtro aplicado
        IF EXISTS (
            SELECT 1 FROM Institucion 
            WHERE (@nivelEducativo IS NULL OR nivelEducativo = @nivelEducativo)
        )
        BEGIN
            SELECT 
                idInstitucion,
                nombreInstitucion,
                carrera,
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