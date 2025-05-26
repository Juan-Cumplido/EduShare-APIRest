CREATE OR ALTER PROCEDURE spi_SeguirUsuario
    @idUsuarioSeguidor INT,
    @idUsuarioSeguido INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Verificar que ambos usuarios existen
        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuarioSeguidor)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El usuario seguidor no existe';
            RETURN;
        END
        
        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuarioSeguido)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El usuario a seguir no existe';
            RETURN;
        END
        
        -- Verificar que no se esté intentando seguir a sí mismo
        IF @idUsuarioSeguidor = @idUsuarioSeguido
        BEGIN
            SET @resultado = 400;
            SET @mensaje = 'No puedes seguirte a ti mismo';
            RETURN;
        END
        
        -- Verificar si ya existe la relación de seguimiento
        IF EXISTS (SELECT 1 FROM Seguidor WHERE idUsuarioSeguidor = @idUsuarioSeguidor AND idUsuarioSeguido = @idUsuarioSeguido)
        BEGIN
            SET @resultado = 409;
            SET @mensaje = 'Ya sigues a este usuario';
            RETURN;
        END
        
        -- Insertar la relación de seguimiento
        INSERT INTO Seguidor (idUsuarioSeguidor, idUsuarioSeguido)
        VALUES (@idUsuarioSeguidor, @idUsuarioSeguido);
        
        SET @resultado = 201;
        SET @mensaje = 'Usuario seguido exitosamente';
        
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al seguir al usuario: ' + ERROR_MESSAGE();
    END CATCH
END
GO

-- Procedimiento almacenado para dejar de seguir a un usuario
CREATE OR ALTER PROCEDURE spi_DejarDeSeguirUsuario
    @idUsuarioSeguidor INT,
    @idUsuarioSeguido INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Verificar que ambos usuarios existen
        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuarioSeguidor)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El usuario seguidor no existe';
            RETURN;
        END
        
        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuarioSeguido)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El usuario no existe';
            RETURN;
        END
        
        -- Verificar si existe la relación de seguimiento
        IF NOT EXISTS (SELECT 1 FROM Seguidor WHERE idUsuarioSeguidor = @idUsuarioSeguidor AND idUsuarioSeguido = @idUsuarioSeguido)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'No sigues a este usuario';
            RETURN;
        END
        
        -- Eliminar la relación de seguimiento
        DELETE FROM Seguidor 
        WHERE idUsuarioSeguidor = @idUsuarioSeguidor AND idUsuarioSeguido = @idUsuarioSeguido;
        
        SET @resultado = 200;
        SET @mensaje = 'Has dejado de seguir al usuario exitosamente';
        
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al dejar de seguir al usuario: ' + ERROR_MESSAGE();
    END CATCH
END
GO

CREATE OR ALTER PROCEDURE sps_VerificarSeguimiento
    @idUsuarioSeguidor INT,
    @idUsuarioSeguido INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Verificar que ambos usuarios existan
        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuarioSeguidor)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El usuario seguidor no existe.';
            SELECT 0 AS siguiendo;
            RETURN;
        END
        
        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuarioSeguido)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El usuario a verificar no existe.';
            SELECT 0 AS siguiendo;
            RETURN;
        END
        
        -- Verificar si existe la relación de seguimiento
        IF EXISTS (SELECT 1 FROM Seguidor WHERE idUsuarioSeguidor = @idUsuarioSeguidor AND idUsuarioSeguido = @idUsuarioSeguido)
        BEGIN
            SET @resultado = 200;
            SET @mensaje = 'El usuario sigue a la persona especificada.';
            SELECT 1 AS siguiendo;
        END
        ELSE
        BEGIN
            SET @resultado = 200;
            SET @mensaje = 'El usuario no sigue a la persona especificada.';
            SELECT 0 AS siguiendo;
        END
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al verificar el seguimiento: ' + ERROR_MESSAGE();
        SELECT 0 AS siguiendo;
    END CATCH
END
GO

-- Procedimiento para obtener la lista de seguidores de un usuario
CREATE OR ALTER PROCEDURE sps_RecuperarSeguidores
    @idUsuario INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Verificar que el usuario exista
        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuario)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El usuario especificado no existe.';
            SELECT 
                0 AS idUsuarioRegistrado,
                '' AS nombre,
                '' AS primerApellido,
                '' AS segundoApellido,
                '' AS nombreUsuario,
                '' AS fotoPerfil
            WHERE 1 = 0; -- Retorna estructura vacía
            RETURN;
        END
        
        -- Obtener lista de seguidores
        SELECT 
            ur.idUsuarioRegistrado,
            ur.nombre,
            ur.primerApellido,
            ur.segundoApellido,
            a.nombreUsuario,
            ur.fotoPerfil
        FROM Seguidor s
        INNER JOIN UsuarioRegistrado ur ON s.idUsuarioSeguidor = ur.idUsuarioRegistrado
        INNER JOIN Acceso a ON ur.idAcceso = a.idAcceso
        WHERE s.idUsuarioSeguido = @idUsuario
        ORDER BY ur.nombre, ur.primerApellido;
        
        SET @resultado = 200;
        SET @mensaje = 'Seguidores recuperados exitosamente.';
        
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al recuperar los seguidores: ' + ERROR_MESSAGE();
        SELECT 
            0 AS idUsuarioRegistrado,
            '' AS nombre,
            '' AS primerApellido,
            '' AS segundoApellido,
            '' AS nombreUsuario,
            '' AS fotoPerfil
        WHERE 1 = 0; -- Retorna estructura vacía en caso de error
    END CATCH
END
GO

-- Procedimiento para obtener la lista de usuarios seguidos por un usuario
CREATE OR ALTER PROCEDURE sps_RecuperarSeguidos
    @idUsuario INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Verificar que el usuario exista
        IF NOT EXISTS (SELECT 1 FROM UsuarioRegistrado WHERE idUsuarioRegistrado = @idUsuario)
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'El usuario especificado no existe.';
            SELECT 
                0 AS idUsuarioRegistrado,
                '' AS nombre,
                '' AS primerApellido,
                '' AS segundoApellido,
                '' AS nombreUsuario,
                '' AS fotoPerfil
            WHERE 1 = 0; -- Retorna estructura vacía
            RETURN;
        END
        
        -- Obtener lista de usuarios seguidos
        SELECT 
            ur.idUsuarioRegistrado,
            ur.nombre,
            ur.primerApellido,
            ur.segundoApellido,
            a.nombreUsuario,
            ur.fotoPerfil
        FROM Seguidor s
        INNER JOIN UsuarioRegistrado ur ON s.idUsuarioSeguido = ur.idUsuarioRegistrado
        INNER JOIN Acceso a ON ur.idAcceso = a.idAcceso
        WHERE s.idUsuarioSeguidor = @idUsuario
        ORDER BY ur.nombre, ur.primerApellido;
        
        SET @resultado = 200;
        SET @mensaje = 'Usuarios seguidos recuperados exitosamente.';
        
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al recuperar los usuarios seguidos: ' + ERROR_MESSAGE();
        SELECT 
            0 AS idUsuarioRegistrado,
            '' AS nombre,
            '' AS primerApellido,
            '' AS segundoApellido,
            '' AS nombreUsuario,
            '' AS fotoPerfil
        WHERE 1 = 0; -- Retorna estructura vacía en caso de error
    END CATCH
END
GO
