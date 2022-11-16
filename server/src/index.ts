import 'dotenv/config';
import * as express from 'express';
import databaseConn from './db/databaseConn';
import routes from './routes';

const cors = require('cors');
const app: express.Application = express();
const PORT = process.env.PORT;
const passport = require('passport');
const passportConfig = require('./middleware/passport');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({ credentials: true, exposedHeaders: ['Content-Disposition'] }));
app.use(passport.initialize());
passportConfig();

//api
app.use('/api', routes);

databaseConn()
  .then(() => {
    app.listen(PORT || 3000, () => {
      console.log('🚀 DB connection successful!');
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(error => console.log(error));

export default app;
