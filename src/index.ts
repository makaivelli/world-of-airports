import * as express from 'express';
import * as bodyParser from 'body-parser';

import AirportsApi from './api/Airports';

const app = express();
const airportsApi = new AirportsApi();

app.use(bodyParser.json());

app.get('/airports', (req: express.Request, res: express.Response) => {
    let { prevQuery, lat, lon, radius } = req.query;
    // TODO validate manually?
    // manual validation - if it weren't a coding test, I'd use Joi or other validation library
    // Handle next page search
    if (prevQuery) {
        const { bookmark, latitudeRange, longitudeRange, radius } = prevQuery;
        // Validate
        if (!bookmark || !latitudeRange || !longitudeRange || !radius) {
            // send error
            return res.header(`err: fields 'bookmark', 'latitudeRange', 'longitudeRange' and 'radius' are required when 'prevQuery' is present`);
        }
        return res.json(airportsApi.getNextPage(bookmark, latitudeRange, longitudeRange, radius));
    }
    // lat, lon and radius are required if first page search
    if (!lat || !lon || !radius) {
        // send error
        return res.header(`err: fields 'lat', 'lon and 'range' are required when 'prevQuery' is not present`);

    }

    // Validate lat: numb <= 90
    try {
        // int or float? -- check if it throws error
        lat = parseFloat(lat)
    } catch (e) {
        // todo check node error return
        throw new Error()
    }
    if (!(Math.abs(lat) <= 90)) {
        // throw out of range error
    }

    // Validate lon: number <= 180
    try {
        // int or float? -- check if it throws error
        lon = parseFloat(lon)
    } catch (e) {
        // todo check node error return
        throw new Error()
    }
    if (!(Math.abs(lon) <= 180)) {
        // throw out of range error
    }

    // Validate radius: number <= 3000 - arbitrary, but probably sensible radius limit
    try {
        // int or float? -- check if it throws error
        radius = parseFloat(radius)
    } catch (e) {
        // todo check node error return
        throw new Error()
    }
    if (!(Math.abs(lon) <= 3000)) {
        // throw out of range error
    }
    return res.json(airportsApi.search(lat, lon, radius));
});

app.listen(3000, () => {
    console.log('server listening on port 3000')
});
