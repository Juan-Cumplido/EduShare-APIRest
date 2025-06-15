-- Procedimiento almacenado para registrar una notificación
CREATE OR ALTER PROCEDURE sps_RegistrarNotificacion
    @usuarioDestinoId INT,
    @titulo NVARCHAR(255),
    @mensajeNotificacion NVARCHAR(MAX),
    @usuarioOrigenId INT,
    @tipo NVARCHAR(50),
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        INSERT INTO Notificaciones (
            UsuarioDestinoId,
            Titulo,
            Mensaje,
            UsuarioOrigenId,
            Tipo,
            FechaCreacion
        )
        VALUES (
            @usuarioDestinoId,
            @titulo,
            @mensajeNotificacion,
            @usuarioOrigenId,
            @tipo,
            GETDATE()
        );

        SET @resultado = 201;
        SET @mensaje = 'Notificación registrada exitosamente';
        
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al registrar la notificación: ' + ERROR_MESSAGE();
    END CATCH
END
GO

-- Procedimiento almacenado para obtener las notificaciones propias de un usuario
CREATE OR ALTER PROCEDURE sps_ObtenerNotificacionesPropias
    @usuarioDestinoId INT,
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        IF EXISTS (SELECT 1 FROM Notificaciones WHERE UsuarioDestinoId = @usuarioDestinoId)
        BEGIN
            SELECT 
                Id,
                UsuarioDestinoId,
                Titulo,
                Mensaje,
                UsuarioOrigenId,
                Tipo,
                FechaCreacion
            FROM Notificaciones
            WHERE UsuarioDestinoId = @usuarioDestinoId
            ORDER BY FechaCreacion DESC;
            
            SET @resultado = 200;
            SET @mensaje = 'Notificaciones recuperadas exitosamente';
        END
        ELSE
        BEGIN
            SET @resultado = 404;
            SET @mensaje = 'No se encontraron notificaciones para este usuario';
        END
        
    END TRY
    BEGIN CATCH
        SET @resultado = 500;
        SET @mensaje = 'Error al obtener las notificaciones: ' + ERROR_MESSAGE();
    END CATCH
END
GO