import * as express from 'express';
import * as bodyParser from 'body-parser';

import AirportsApi from './api/Airports';

const app = express();
const airportsApi = new AirportsApi();

app.use(bodyParser.json());

app.get('/airports', (req: express.Request, res: express.Response) => {
    res.json(airportsApi.search())
});

app.listen(3000, () => {
    console.log('server listening on port 3000')
});
