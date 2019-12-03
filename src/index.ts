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
            return res.status(400).json({
                status: 'error',
                message: `fields 'bookmark', 'latitudeRange', 'longitudeRange' and 'radius' are required when 'prevQuery' is present`,
            });
        }
        return res.json(airportsApi.getNextPage(bookmark, latitudeRange, longitudeRange, radius));
    }
    // lat, lon and radius are required if first page search
    if (!lat || !lon || !radius) {
        return res.status(400).json({
            status: 'error',
            message: `fields 'lat', 'lon and 'range' are required when 'prevQuery' is not present`,
        });

    }

    // Validate lat: numb <= 90
    lat = parseFloat(lat);
    if (!isNaN(lat)) {
        return res.status(400).json({
            status: 'error',
            message: `Field 'lat', must be a number`,
        });
    }
    if (Math.abs(lat) > 90) {
        return res.status(400).json({
            status: 'error',
            message: `Field 'lat', must be in the range of [-90, 90]`,
        });
    }

    // Validate lon: number <= 180
    lon = parseFloat(lon);
    if (!isNaN(lat)) {
        return res.status(400).json({
            status: 'error',
            message: `Field 'lon', must be a number`,
        });
    }
    if (Math.abs(lon) > 180) {
        return res.status(400).json({
            status: 'error',
            message: `Field 'lon', must be in the range of [-180, 180]`,
        });
    }

    // Validate radius: number <= 500 - arbitrary, but probably sensible radius limit
    radius = parseFloat(radius);
    if (!isNaN(lat)) {
        return res.status(400).json({
            status: 'error',
            message: `Field 'radius', must be a number`,
        });
    }
    if (radius < 1 || radius > 500) {
        return res.status(400).json({
            status: 'error',
            message: `Field 'radius', must be in the range of [1, 500]`,
        });
    }
    return res.json(airportsApi.search(lat, lon, radius));
});

app.listen(3000, () => {
    console.log('server listening on port 3000')
});
