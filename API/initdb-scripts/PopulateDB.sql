INSERT INTO Institucion (nombreInstitucion, nivelEducativo) VALUES
('Universidad Nacional Autónoma de México', 'Universidad'),
('Instituto Tecnológico y de Estudios Superiores de Monterrey', 'Universidad'),
('Universidad de Guadalajara', 'Universidad'),
('Benemérita Universidad Autónoma de Puebla', 'Universidad'),
('Universidad Autónoma Metropolitana', 'Universidad'),
('Universidad Veracruzana', 'Universidad'),
('Universidad Autónoma de Nuevo León', 'Universidad'),
('Universidad Autónoma de Querétaro', 'Universidad'),
('Universidad Michoacana de San Nicolás de Hidalgo', 'Universidad'),
('Universidad Autónoma de Baja California', 'Universidad');

INSERT INTO Institucion (nombreInstitucion, nivelEducativo) VALUES
('Preparatoria 5 UNAM', 'Preparatoria'),
('Preparatoria Tec de Monterrey Campus CDMX', 'Preparatoria'),
('Preparatoria Anáhuac', 'Preparatoria'),
('Colegio de Ciencias y Humanidades Vallejo', 'Preparatoria'),
('Preparatoria 2 UNAM', 'Preparatoria'),
('Preparatoria Anglo Mexicano', 'Preparatoria'),
('Centro Universitario Anglo Mexicano', 'Preparatoria'),
('Preparatoria Liceo Mexicano Japonés', 'Preparatoria'),
('Colegio de Bachilleres Plantel 1', 'Preparatoria'),
('Preparatoria La Salle', 'Preparatoria');

INSERT INTO Categoria (nombreCategoria) VALUES
('Apuntes'),
('Resúmenes'),
('Guías de estudio'),
('Tareas'),
('Plantillas'),
('Infografías'),
('Cuestionarios'),
('Mapas conceptuales'),
('Manuales');


INSERT INTO Rama (nombreRama)
VALUES 
('Informática'),
('Derecho'),
('Medicina'),
('Arte'),
('Ingeniería');

-- Informática
INSERT INTO Materia (nombreMateria) VALUES ('Programación');
INSERT INTO Materia (nombreMateria) VALUES ('Bases de Datos');
INSERT INTO Materia (nombreMateria) VALUES ('Redes');

-- Derecho
INSERT INTO Materia (nombreMateria) VALUES ('Derecho Penal');
INSERT INTO Materia (nombreMateria) VALUES ('Derecho Civil');
INSERT INTO Materia (nombreMateria) VALUES ('Derecho Constitucional');

-- Medicina
INSERT INTO Materia (nombreMateria) VALUES ('Anatomía');
INSERT INTO Materia (nombreMateria) VALUES ('Fisiología');
INSERT INTO Materia (nombreMateria) VALUES ('Farmacología');

-- Arte
INSERT INTO Materia (nombreMateria) VALUES ('Dibujo');
INSERT INTO Materia (nombreMateria) VALUES ('Pintura');
INSERT INTO Materia (nombreMateria) VALUES ('Diseño gráfico');

-- Ingeniería
INSERT INTO Materia (nombreMateria) VALUES ('Cálculo');
INSERT INTO Materia (nombreMateria) VALUES ('Física');
INSERT INTO Materia (nombreMateria) VALUES ('Termodinámica');

-- Asociar materias con ramas en la tabla MateriaYRama
DECLARE @idRama INT, @idMateria INT;

-- Informática
SELECT @idRama = idRama FROM Rama WHERE nombreRama = 'Informática';
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Programación';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Bases de Datos';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Redes';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);

-- Derecho
SELECT @idRama = idRama FROM Rama WHERE nombreRama = 'Derecho';
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Derecho Penal';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Derecho Civil';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Derecho Constitucional';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);

-- Medicina
SELECT @idRama = idRama FROM Rama WHERE nombreRama = 'Medicina';
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Anatomía';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Fisiología';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Farmacología';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);

-- Arte
SELECT @idRama = idRama FROM Rama WHERE nombreRama = 'Arte';
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Dibujo';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Pintura';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Diseño gráfico';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);

-- Ingeniería
SELECT @idRama = idRama FROM Rama WHERE nombreRama = 'Ingeniería';
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Cálculo';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Física';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Termodinámica';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);

