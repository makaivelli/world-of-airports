import * as express from 'express';
import * as bodyParser from 'body-parser'
import * as cors from 'cors';

import AirportDBWrapper from './db/AirportDBWrapper';
import AirportModelWrapper from './db/AirportModelWrapper';
import AirportsApi from './api/Airports';
import AirportsRoute from './routes/Airports';

const airportDBWrapper = new AirportDBWrapper();
const airportModelWrapper = new AirportModelWrapper(airportDBWrapper);
const airportsApi = new AirportsApi(airportModelWrapper);
const airportsRoute = new AirportsRoute(airportsApi);

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Using `post` would make the params handling a bit easier,
// but I think using `get` for getting a collection of items makes more sense.
app.get('/airports', airportsRoute.get);

app.listen(3001, () => {
    console.log('server listening on port 3000')
});
