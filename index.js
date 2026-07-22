import express from 'express';
import dotenv from 'dotenv';
import { conectaDB,supabase } from './config/supabase.js';
import AuthRoutes from './Routes/auth.js';
import UserRoutes from './Routes/user.js';
import HeladosRoutes from './Routes/helados.js';
import PedidosRoutes from './Routes/pedidos.js';
//Importamos las rutas de usuario


//Cargar variables de entorno
dotenv.config();
conectaDB();

//Creamos la aplicacio de express
const app = express();

//Leer el json 
app.use(express.json());

//Creamos la primera ruta

app.get('/', (req, res) => {
    res.json({
        Mensaje: "Bienvenido al Backend de Mimos",
        Estado: "En linea",
        Version: "1.0.0"
    });
});

//Creamos las rutas de usuario
app.use('/auth', AuthRoutes);
app.use('/usuarios', UserRoutes);
app.use('/api', HeladosRoutes);
app.use('/api', PedidosRoutes);

//Configuramos el puerto

const port = 3000;

//Poner a escuchar el servidor
app.listen(port, () => {
    console.log(`✅Servidor escuchando el puerto ${port}`);
    console.log(`http://localhost:${port}`);
});