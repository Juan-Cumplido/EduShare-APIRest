-- Login
CREATE OR ALTER PROCEDURE spi_VerificarCredenciales
    @identifier NVARCHAR(256),      
    @contrasenia NVARCHAR(300),
    @resultado INT OUTPUT,
    @mensaje NVARCHAR(200) OUTPUT,
    @idUsuarioRegistrado INT OUTPUT,
    @nombre NVARCHAR(30) OUTPUT,
    @fotoPerfil NVARCHAR(MAX) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        DECLARE @idAcceso INT
        DECLARE @estado NVARCHAR(10)
        
        IF @identifier LIKE '%_@_%.__%'
        BEGIN
            SELECT @idAcceso = idAcceso, @estado = estado
            FROM Acceso
            WHERE correo = @identifier AND contrasenia = @contrasenia
        END
        ELSE
        BEGIN
            SELECT @idAcceso = idAcceso, @estado = estado
            FROM Acceso
            WHERE nombreUsuario = @identifier AND contrasenia = @contrasenia
        END
        
        IF @idAcceso IS NULL
        BEGIN
            SET @resultado = 401; -- 401 Unauthorized
            SET @mensaje = 'Credenciales incorrectas'
            RETURN
        END
        
        IF @estado != 'Activo'
        BEGIN
            SET @resultado = 403; -- 403 Forbidden
            SET @mensaje = 'La cuenta no está activa'
            RETURN
        END
        
        SELECT 
            @idUsuarioRegistrado = ur.idUsuarioRegistrado,
            @nombre = ur.nombre,
            @fotoPerfil = ur.fotoPerfil
        FROM UsuarioRegistrado ur
        WHERE ur.idAcceso = @idAcceso
        
        SET @resultado = 200; -- 200 OK
        SET @mensaje = 'Inicio de sesión exitoso'
    END TRY
    BEGIN CATCH
        SET @resultado = 500; -- 500 Internal Server Error
        SET @mensaje = 'Error al verificar credenciales: ' + ERROR_MESSAGE()
    END CATCH
END
GO