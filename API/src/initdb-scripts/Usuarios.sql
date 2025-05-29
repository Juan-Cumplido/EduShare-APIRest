USE master;
GO

-- ==============================================
-- 1. CREAR LOGINS (a nivel de servidor)
-- ==============================================

-- Admin
CREATE LOGIN UsuarioAdmin
WITH PASSWORD = 'Kp:d~4CJAw66';
GO

-- Registrado
CREATE LOGIN UsuarioRegistrado
WITH PASSWORD = '£A3_*8bRqz1m';
GO

-- ==============================================
-- 2. CREAR USUARIOS EN LA BASE DE DATOS
-- ==============================================

USE EduShare_DB;
GO


-- Admin
CREATE USER UsuarioAdmin FOR LOGIN UsuarioAdmin;
GO
-- Registrado
CREATE USER UsuarioRegistrado FOR LOGIN UsuarioRegistrado;
GO

-- ==============================================
-- 3. OTORGAR PERMISOS ERICK PUTO
-- ==============================================

-- 3.1 Admin: todos los permisos sobre la base
EXEC sp_addrolemember 'db_owner', 'UsuarioAdmin';
GO

-- 3.2 Registrado: puede modificar datos y ejecutar funciones/procs
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::dbo TO UsuarioRegistrado;
GRANT EXECUTE TO UsuarioRegistrado;

