import express from 'express';
import db from 'models';
import routes from 'routes';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';

const app = express();

app.use(bodyParser.urlencoded({ extended : true, limit : '2mb' }));
app.use(bodyParser.json({ limit : '5mb' }));

// Enable security helpers with various HTTP headers
app.use(helmet());

// Use CORS protocol
app.use(cors());

// Connect routes
app.use(routes);

// we can configure port variable
db.sequelize
  .sync()
  .then(() => {
    const server = app.listen(5000, err => {
      if (err) {
        console.error('Failed to start API : ', err);
        return;
      }
      console.log(`API listening on port ${server.address().port}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to database : ', err);
  });

module.exports = app;
