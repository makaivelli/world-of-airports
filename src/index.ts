import * as express from 'express';
import * as bodyParser from 'body-parser';

import airportsRoute from './routes/airports';

const app = express();

app.use(bodyParser.json());

app.get('/airports', airportsRoute);

app.listen(3000, () => {
    console.log('server listening on port 3000')
});
