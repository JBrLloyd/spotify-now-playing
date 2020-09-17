import path from 'path';
import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import lusca from 'lusca';
// import flash from 'express-flash';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import exphbs from 'express-handlebars';

import swagger from './swagger.json';
import { logStream } from './util/logger';
import * as routes from './routes';
import { errorHandler, cancelRequestHandler } from './middleware';

// Create Express server
const app = express();

// app.enable("trust proxy");
app.use(helmet());
app.use(cors());

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// eslint-disable-next-line @typescript-eslint/no-var-requires
app.use(require('morgan')('combined', { 'stream': logStream }));

// app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

app.use(cancelRequestHandler);

// Handlebars
const hbs = exphbs.create({
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    isdefined: function (value: any) { return value !== undefined && value !== null; }
  }
});

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));

routes.setup(app);

app.use(errorHandler);

export default app;
