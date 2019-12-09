import * as express from 'express';
import * as bodyParser from 'body-parser'
import * as cors from 'cors';

import airportsRoute from './routes/airports';

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/airports', airportsRoute);

app.listen(3001, () => {
    console.log('server listening on port 3000')
});
