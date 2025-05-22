-- Agregar universidades y 10 carreras por cada una
INSERT INTO @universidades (nombre, carrera)
SELECT nombre, carrera FROM (
    VALUES
        ('UNAM', 'Medicina'), ('UNAM', 'Derecho'), ('UNAM', 'Ingeniería Civil'), ('UNAM', 'Arquitectura'),
        ('UNAM', 'Psicología'), ('UNAM', 'Contaduría'), ('UNAM', 'Ciencias Políticas'), ('UNAM', 'Odontología'),
        ('UNAM', 'Biología'), ('UNAM', 'Economía'),

        ('IPN', 'Ingeniería Mecánica'), ('IPN', 'Ingeniería Eléctrica'), ('IPN', 'Ingeniería en Sistemas'),
        ('IPN', 'Ingeniería Civil'), ('IPN', 'Arquitectura'), ('IPN', 'Administración'),
        ('IPN', 'Contaduría'), ('IPN', 'Turismo'), ('IPN', 'Biotecnología'), ('IPN', 'Matemáticas Aplicadas'),

        ('ITESM', 'Negocios Internacionales'), ('ITESM', 'Ingeniería Industrial'), ('ITESM', 'Derecho'),
        ('ITESM', 'Ingeniería en Sistemas'), ('ITESM', 'Diseño Gráfico'), ('ITESM', 'Finanzas'),
        ('ITESM', 'Arquitectura'), ('ITESM', 'Mercadotecnia'), ('ITESM', 'Medicina'), ('ITESM', 'Animación'),

        ('UAM', 'Diseño Industrial'), ('UAM', 'Sociología'), ('UAM', 'Ingeniería de Alimentos'),
        ('UAM', 'Psicología'), ('UAM', 'Computación'), ('UAM', 'Antropología'), ('UAM', 'Matemáticas'),
        ('UAM', 'Medicina'), ('UAM', 'Arquitectura'), ('UAM', 'Derecho'),

        ('UANL', 'Ingeniería Mecánica'), ('UANL', 'Ingeniería Eléctrica'), ('UANL', 'Medicina'),
        ('UANL', 'Derecho'), ('UANL', 'Psicología'), ('UANL', 'Arquitectura'), ('UANL', 'Contaduría'),
        ('UANL', 'Odontología'), ('UANL', 'Economía'), ('UANL', 'Educación Física'),

        ('BUAP', 'Medicina'), ('BUAP', 'Derecho'), ('BUAP', 'Física'), ('BUAP', 'Arquitectura'),
        ('BUAP', 'Química'), ('BUAP', 'Biología'), ('BUAP', 'Administración'), ('BUAP', 'Contaduría'),
        ('BUAP', 'Turismo'), ('BUAP', 'Psicología'),

        ('UdeG', 'Psicología'), ('UdeG', 'Medicina'), ('UdeG', 'Derecho'), ('UdeG', 'Arquitectura'),
        ('UdeG', 'Diseño'), ('UdeG', 'Sociología'), ('UdeG', 'Enfermería'), ('UdeG', 'Administración'),
        ('UdeG', 'Ciencias Políticas'), ('UdeG', 'Contaduría'),

        ('UAEM', 'Ingeniería Civil'), ('UAEM', 'Derecho'), ('UAEM', 'Arquitectura'), ('UAEM', 'Psicología'),
        ('UAEM', 'Turismo'), ('UAEM', 'Enfermería'), ('UAEM', 'Diseño Gráfico'), ('UAEM', 'Contaduría'),
        ('UAEM', 'Computación'), ('UAEM', 'Sociología'),

        ('UABJO', 'Derecho'), ('UABJO', 'Medicina'), ('UABJO', 'Ciencias Políticas'), ('UABJO', 'Enfermería'),
        ('UABJO', 'Administración'), ('UABJO', 'Contaduría'), ('UABJO', 'Idiomas'), ('UABJO', 'Psicología'),
        ('UABJO', 'Educación'), ('UABJO', 'Trabajo Social'),

        ('UAS', 'Medicina'), ('UAS', 'Psicología'), ('UAS', 'Derecho'), ('UAS', 'Enfermería'),
        ('UAS', 'Ingeniería Civil'), ('UAS', 'Administración'), ('UAS', 'Contaduría'), ('UAS', 'Diseño Gráfico'),
        ('UAS', 'Odontología'), ('UAS', 'Educación Física')
) AS temp(nombre, carrera)

-- Insertar universidades
INSERT INTO Institucion (nombreInstitucion, carrera, nivelEducativo)
SELECT nombre, carrera, 'Universidad'
FROM @universidades;

-- PREPARATORIAS
DECLARE @prepas TABLE (
    nombre NVARCHAR(100),
    carrera NVARCHAR(70)
)

-- Agregar preparatorias con áreas de estudio
INSERT INTO @prepas (nombre, carrera)
SELECT nombre, carrera FROM (
    VALUES
        ('Prepa UNAM Plantel Sur', 'Físico-Matemáticas'), ('Prepa UNAM Plantel Sur', 'Químico-Biológicas'),
        ('Prepa UNAM Plantel Sur', 'Ciencias Sociales'), ('Prepa UNAM Plantel Sur', 'Humanidades'),
        ('Prepa UNAM Plantel Sur', 'Economía'), ('Prepa UNAM Plantel Sur', 'Administración'),
        ('Prepa UNAM Plantel Sur', 'Literatura'), ('Prepa UNAM Plantel Sur', 'Historia'),
        ('Prepa UNAM Plantel Sur', 'Psicología'), ('Prepa UNAM Plantel Sur', 'Arte'),

        ('Prepa Tec de Monterrey', 'Ingeniería'), ('Prepa Tec de Monterrey', 'Negocios'),
        ('Prepa Tec de Monterrey', 'Ciencias Sociales'), ('Prepa Tec de Monterrey', 'Biotecnología'),
        ('Prepa Tec de Monterrey', 'Salud'), ('Prepa Tec de Monterrey', 'Emprendimiento'),
        ('Prepa Tec de Monterrey', 'Tecnología'), ('Prepa Tec de Monterrey', 'Diseño'),
        ('Prepa Tec de Monterrey', 'Educación'), ('Prepa Tec de Monterrey', 'Ciencias Exactas'),

        ('Colegio de Ciencias y Humanidades (CCH) Vallejo', 'Matemáticas'), ('CCH Vallejo', 'Biología'),
        ('CCH Vallejo', 'Química'), ('CCH Vallejo', 'Historia'), ('CCH Vallejo', 'Literatura'),
        ('CCH Vallejo', 'Geografía'), ('CCH Vallejo', 'Filosofía'), ('CCH Vallejo', 'Derecho'),
        ('CCH Vallejo', 'Física'), ('CCH Vallejo', 'Artes'),

        ('Prepa Ibero', 'Ciencias Sociales'), ('Prepa Ibero', 'Comunicación'),
        ('Prepa Ibero', 'Filosofía'), ('Prepa Ibero', 'Arte'), ('Prepa Ibero', 'Derecho'),
        ('Prepa Ibero', 'Negocios'), ('Prepa Ibero', 'Liderazgo'), ('Prepa Ibero', 'Ingeniería'),
        ('Prepa Ibero', 'Psicología'), ('Prepa Ibero', 'Tecnología'),

        ('Preparatoria 5 UNAM', 'Físico-Matemáticas'), ('Preparatoria 5 UNAM', 'Biológicas'),
        ('Preparatoria 5 UNAM', 'Ciencias Sociales'), ('Preparatoria 5 UNAM', 'Humanidades'),
        ('Preparatoria 5 UNAM', 'Economía'), ('Preparatoria 5 UNAM', 'Derecho'),
        ('Preparatoria 5 UNAM', 'Literatura'), ('Preparatoria 5 UNAM', 'Tecnología'),
        ('Preparatoria 5 UNAM', 'Psicología'), ('Preparatoria 5 UNAM', 'Historia'),

        ('Prepa Anáhuac', 'Administración'), ('Prepa Anáhuac', 'Salud'), ('Prepa Anáhuac', 'Ingeniería'),
        ('Prepa Anáhuac', 'Derecho'), ('Prepa Anáhuac', 'Economía'), ('Prepa Anáhuac', 'Finanzas'),
        ('Prepa Anáhuac', 'Psicología'), ('Prepa Anáhuac', 'Biotecnología'), ('Prepa Anáhuac', 'Ciencias'),
        ('Prepa Anáhuac', 'Educación'),

        ('Prepa La Salle', 'Contaduría'), ('Prepa La Salle', 'Humanidades'), ('Prepa La Salle', 'Física'),
        ('Prepa La Salle', 'Tecnología'), ('Prepa La Salle', 'Literatura'), ('Prepa La Salle', 'Artes Visuales'),
        ('Prepa La Salle', 'Salud'), ('Prepa La Salle', 'Derecho'), ('Prepa La Salle', 'Comunicación'),
        ('Prepa La Salle', 'Educación'),

        ('Preparatoria del Estado de México', 'Ciencias Sociales'), ('Preparatoria del Estado de México', 'Psicología'),
        ('Preparatoria del Estado de México', 'Literatura'), ('Preparatoria del Estado de México', 'Historia'),
        ('Preparatoria del Estado de México', 'Derecho'), ('Preparatoria del Estado de México', 'Tecnología'),
        ('Preparatoria del Estado de México', 'Arte'), ('Preparatoria del Estado de México', 'Matemáticas'),
        ('Preparatoria del Estado de México', 'Física'), ('Preparatoria del Estado de México', 'Química'),

        ('Colegio de Bachilleres Plantel 1', 'Ciencias Biológicas'), ('Colegio de Bachilleres Plantel 1', 'Matemáticas'),
        ('Colegio de Bachilleres Plantel 1', 'Ciencias Sociales'), ('Colegio de Bachilleres Plantel 1', 'Humanidades'),
        ('Colegio de Bachilleres Plantel 1', 'Tecnología'), ('Colegio de Bachilleres Plantel 1', 'Psicología'),
        ('Colegio de Bachilleres Plantel 1', 'Filosofía'), ('Colegio de Bachilleres Plantel 1', 'Arte'),
        ('Colegio de Bachilleres Plantel 1', 'Historia'), ('Colegio de Bachilleres Plantel 1', 'Comunicación'),

        ('Conalep Plantel Naucalpan', 'Contabilidad'), ('Conalep Plantel Naucalpan', 'Administración'),
        ('Conalep Plantel Naucalpan', 'Informática'), ('Conalep Plantel Naucalpan', 'Mecatrónica'),
        ('Conalep Plantel Naucalpan', 'Electricidad'), ('Conalep Plantel Naucalpan', 'Electrónica'),
        ('Conalep Plantel Naucalpan', 'Automotriz'), ('Conalep Plantel Naucalpan', 'Biotecnología'),
        ('Conalep Plantel Naucalpan', 'Salud'), ('Conalep Plantel Naucalpan', 'Medio Ambiente')
) AS temp(nombre, carrera)

-- Insertar preparatorias
INSERT INTO Institucion (nombreInstitucion, carrera, nivelEducativo)
SELECT nombre, carrera, 'Preparatoria'
FROM @prepas;


-- Paso 1: Insertar 5 ramas
INSERT INTO Rama (nombreRama)
VALUES 
('Informática'),
('Derecho'),
('Medicina'),
('Administración'),
('Ingeniería');

-- Paso 2: Insertar materias para cada rama
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

-- Administración
INSERT INTO Materia (nombreMateria) VALUES ('Contabilidad');
INSERT INTO Materia (nombreMateria) VALUES ('Gestión Empresarial');
INSERT INTO Materia (nombreMateria) VALUES ('Marketing');

-- Ingeniería
INSERT INTO Materia (nombreMateria) VALUES ('Cálculo');
INSERT INTO Materia (nombreMateria) VALUES ('Física');
INSERT INTO Materia (nombreMateria) VALUES ('Termodinámica');

-- Paso 3: Asociar materias con ramas en la tabla MateriaYRama

-- Variables para almacenar los ID recién creados
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

-- Administración
SELECT @idRama = idRama FROM Rama WHERE nombreRama = 'Administración';
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Contabilidad';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Gestión Empresarial';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Marketing';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);

-- Ingeniería
SELECT @idRama = idRama FROM Rama WHERE nombreRama = 'Ingeniería';
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Cálculo';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Física';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
SELECT @idMateria = idMateria FROM Materia WHERE nombreMateria = 'Termodinámica';
INSERT INTO MateriaYRama (idMateria, idRama) VALUES (@idMateria, @idRama);
