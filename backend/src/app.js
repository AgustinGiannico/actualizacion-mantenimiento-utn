import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { setupSwaggerDocs } from './../swagger.js';

import authRoutes from './Routes/auth.Routes.js';
import assetTypeRoutes from './Routes/Asset_type.routes.js'
import availableRoutes from './Routes/Available.routes.js'
import edificeRoutes from './Routes/Edifice.routes.js'
import floorRoutes from './Routes/Floor.routes.js'
import locationRoutes from './Routes/Location.routes.js'
import logoutRoutes from './Routes/Logout.routes.js'
import otRoutes from './Routes/Ot.Routes.js'
import otStateRoutes from './Routes/Ot_state.routes.js'
import priorityRoutes from './Routes/Priority.routes.js'
import provinceRoutes from './Routes/Province.routes.js'
import sectorRoutes from './Routes/Sector.routes.js'
import siteRoutes from './Routes/Site.routes.js'
import tagRoutes from './Routes/Tag.routes.js'
import taskListRoutes from './Routes/Task_list.routes.js'
import taskTypeRoutes from './Routes/Task_type.routes.js'
import taskRoutes from './Routes/Task.routes.js'
import userRoutes from './Routes/User.routes.js'

const app = express();

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:4200',
    credentials: true,
}

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

app.use('/api', authRoutes);
app.use('/api', assetTypeRoutes)
app.use('/api', availableRoutes)
app.use('/api', edificeRoutes)
app.use('/api', floorRoutes)
app.use('/api', locationRoutes)
app.use('/api', logoutRoutes )
app.use('/api', otRoutes)
app.use('/api', otStateRoutes)
app.use('/api', priorityRoutes)
app.use('/api', provinceRoutes)
app.use('/api', sectorRoutes)
app.use('/api', siteRoutes)
app.use('/api', tagRoutes)
app.use('/api', taskListRoutes)
app.use('/api', taskTypeRoutes)
app.use('/api', taskRoutes)
app.use('/api', userRoutes)

setupSwaggerDocs(app);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal en el servidor.' });
});

export default app