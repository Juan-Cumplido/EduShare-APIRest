-- Crear la base de datos
CREATE DATABASE EduShare_DB;
GO

USE EduShare_DB;
GO

-- Tabla Acceso
CREATE TABLE Acceso (
    idAcceso INT IDENTITY(1,1) PRIMARY KEY,
    correo NVARCHAR(256) NOT NULL,
    contrasenia NVARCHAR(300) NOT NULL,
    nombreUsuario NVARCHAR(15) NOT NULL,
    estado NVARCHAR(10) NOT NULL,
    tipoAcceso NVARCHAR(20) NOT NULL
);
GO

-- Tabla Institucion
CREATE TABLE Institucion (
    idInstitucion INT IDENTITY(1,1) PRIMARY KEY,
    nombreInstitucion NVARCHAR(100) NOT NULL,
    nivelEducativo NVARCHAR(20) NOT NULL
);
GO

-- Tabla UsuarioRegistrado
CREATE TABLE UsuarioRegistrado (
    idUsuarioRegistrado INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(30) NOT NULL,
    primerApellido NVARCHAR(30) NOT NULL,
    segundoApellido NVARCHAR(30) NULL,
    idAcceso INT NOT NULL,
    idInstitucion INT NOT NULL,
    fotoPerfil NVARCHAR(MAX) NULL,
    FOREIGN KEY (idAcceso) REFERENCES Acceso(idAcceso),
    FOREIGN KEY (idInstitucion) REFERENCES Institucion(idInstitucion)
);
GO

-- Tabla Seguidor
CREATE TABLE Seguidor (
    idSeguidor INT IDENTITY(1,1) PRIMARY KEY,
    idUsuarioSeguidor INT NOT NULL,
    idUsuarioSeguido INT NOT NULL,
    UNIQUE (idUsuarioSeguidor, idUsuarioSeguido),
    FOREIGN KEY (idUsuarioSeguidor) REFERENCES UsuarioRegistrado(idUsuarioRegistrado)
);
GO

-- Tabla Rama
CREATE TABLE Rama (
    idRama INT IDENTITY(1,1) PRIMARY KEY,
    nombreRama NVARCHAR(50) NOT NULL
);
GO

-- Tabla Materia
CREATE TABLE Materia (
    idMateria INT IDENTITY(1,1) PRIMARY KEY,
    nombreMateria NVARCHAR(45) NOT NULL
);
GO

-- Tabla Documento
CREATE TABLE Documento (
    idDocumento INT IDENTITY(1,1) PRIMARY KEY,
    titulo NVARCHAR(100) NOT NULL,
    ruta NVARCHAR(MAX) NOT NULL
);
GO

-- Tabla MateriaYRama
CREATE TABLE MateriaYRama (
  idMateriaYRama INT IDENTITY(1,1) PRIMARY KEY,
  idMateria INT NOT NULL,
  idRama INT NOT NULL,
  FOREIGN KEY (idRama) REFERENCES Rama(idRama),
  FOREIGN KEY (idMateria) REFERENCES Materia(idMateria),
  UNIQUE(idMateria, idRama)
);
GO

CREATE TABLE Categoria (
    idCategoria INT IDENTITY(1,1) PRIMARY KEY,
    nombreCategoria NVARCHAR(25) NOT NULL UNIQUE
);

-- Tabla Publicacion
CREATE TABLE Publicacion (
    idPublicacion INT IDENTITY(1,1) PRIMARY KEY,
    idCategoria INT NOT NULL,
    fecha DATE NOT NULL,
    resuContenido NVARCHAR(200) NOT NULL,
    estado NVARCHAR(20) NOT NULL,
    numeroLiker INT NOT NULL,
    nivelEducativo NVARCHAR(20) NOT NULL,
    numeroVisualizaciones INT NOT NULL,
    numeroDescargas INT NOT NULL,
    idUsuarioRegistrado INT NOT NULL,
    idDocumento INT NOT NULL,
    idMateriaYRama INT NOT NULL,
    FOREIGN KEY (idMateriaYRama) REFERENCES MateriaYRama(idMateriaYRama),
    FOREIGN KEY (idUsuarioRegistrado) REFERENCES UsuarioRegistrado(idUsuarioRegistrado),
    FOREIGN KEY (idDocumento) REFERENCES Documento(idDocumento),
    FOREIGN KEY (idCategoria) REFERENCES Categoria(idCategoria)
);
GO

-- Tabla Comentario
CREATE TABLE Comentario (
    idComentario INT IDENTITY(1,1) PRIMARY KEY,
    contenido NVARCHAR(200) NOT NULL,
    fecha DATE NOT NULL,
    idPublicacion INT NOT NULL,
    idUsuarioRegistrado INT NOT NULL,
    FOREIGN KEY (idPublicacion) REFERENCES Publicacion(idPublicacion),
    FOREIGN KEY (idUsuarioRegistrado) REFERENCES UsuarioRegistrado(idUsuarioRegistrado)
);
GO

CREATE TABLE LikePublicacion (
    idLike INT IDENTITY(1,1) PRIMARY KEY,
    idPublicacion INT NOT NULL,
    idUsuario INT NOT NULL,
    FOREIGN KEY (idPublicacion) REFERENCES Publicacion(idPublicacion),
    FOREIGN KEY (idUsuario) REFERENCES UsuarioRegistrado(idUsuarioRegistrado),
    UNIQUE(idPublicacion, idUsuario)
);
GO

-- Tabla AgendaChat
CREATE TABLE AgendaChat (
    idAgendaChat INT IDENTITY(1,1) PRIMARY KEY,
    titulo NVARCHAR(45) NOT NULL,
    descripcion NVARCHAR(45) NOT NULL,
    hora TIME NOT NULL,
    fecha DATE NOT NULL,
    idUsuarioRegistrado INT NOT NULL,
    FOREIGN KEY (idUsuarioRegistrado) REFERENCES UsuarioRegistrado(idUsuarioRegistrado)
);
GO

CREATE TABLE Notificaciones (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UsuarioDestinoId INT NOT NULL,
    Titulo NVARCHAR(255) NOT NULL,
    Mensaje NVARCHAR(MAX),
    UsuarioOrigenId INT NOT NULL,
    Tipo NVARCHAR(50),
    FechaCreacion DATETIME
);
GO
