import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';


const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve('./src/docs/swagger.json'), 'utf8')
);

export const setupSwaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('📄 Documentación disponible en http://localhost:3011/api-docs');
};
