//main.js
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import mysql from 'mysql'


const app = express();
app.use(bodyParser.json());
app.use(cors())

const puerto = 3000;

// Configuración para analizar el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'phpmyadmin'
});

connection.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conexión exitosa a la base de datos');
    }
});

app.get('/crear-tabla', (req, res) => {
    const createTableQuery = `
    CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    descripcion TEXT
    )
    `;

    connection.query(createTableQuery, (err, results) => {
        if (err) {
            console.error('Error al crear la tabla:', err);
            res.status(500).send('Error al crear la tabla');
        } else {
            console.log('Tabla creada exitosamente');
            res.send('Tabla creada exitosamente');
        }
    });
});

// Definir una ruta para crear la tabla
app.get('/productos', (req, res) => {
    const selectQuery = 'SELECT * FROM productos';

    connection.query(selectQuery, (err, results) => {
        if (err) {
            console.error('Error al seleccionar productos:', err);
            res.status(500).send('Error al seleccionar productos');
        } else {
            console.log('Productos seleccionados exitosamente');
            res.json(results);
        }
    });
});

app.post('/agregar-producto', (req, res) => {
    const { nombre, precio, descripcion } = req.body;

    const insertQuery = `
        INSERT INTO productos (nombre, precio, descripcion)
        VALUES (?, ?, ?)
        `;

    connection.query(insertQuery, [nombre, precio, descripcion], (err, results) => {
        if (err) {
            console.error('Error al agregar producto:', err);
            res.status(500).send('Error al agregar producto');
        } else {
            console.log('Producto agregado exitosamente');
            res.send('Producto agregado exitosamente');
        }
    });
});

app.put('/productos/:id', (req, res) => {
    const productId = req.params.id;
    const { nombre, precio, descripcion } = req.body;

    const updateQuery = `
    UPDATE productos
    SET nombre = ?, precio = ?, descripcion = ?
    WHERE id = ?
    `;


    connection.query(updateQuery, [nombre, precio, descripcion, productId], (err, results) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).send('Error al actualizar producto');
        } else {
            console.log('Producto actualizado exitosamente');
            res.send('Producto actualizado exitosamente');
        }
    });
});



let datos = [
    { id: 1, name: 'Ejemplo 1' },
    { id: 2, name: 'Ejemplo 2' },
];

//Ruta de data
app.get('/', (req, res) => {
    res.json(datos);
});


//Iniciar el servidor
app.listen(puerto, () => {
    console.log('Servidor en funcionamiento en el puerto ${puerto}');
});