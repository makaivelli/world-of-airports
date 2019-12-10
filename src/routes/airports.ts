import * as express from 'express';


/**
 * Single route for getting the first and subsequent pages of airports in a radius (km) from a starting co-ord.
 * 1. Handling first / next page logic:
 * A) if `prevQuery` provided, use `airportsApi.getNextPage`
 * B) use `airportsApi.search`
 * 2. Validating query params:
 * A) `prevQuery` validate against `IPagination` interface's format
 * B) `lat` -90 <= number <= 90, `lon` -180 <= number <= 180, `rad` 1 <= number <= 500
 */
export default class AirportsRoute {
    private airportsApi: any;
    constructor(airportsApi) {
        this.airportsApi = airportsApi;
    }

    public async get (req: express.Request, res: express.Response): Promise<any> {
        // Handle next page search
        let { prevQuery, lat, lon, rad } = req.query;
        if (prevQuery) {
            let prevQueryObj = JSON.parse(prevQuery);
            const { bookmark, query, remainingPages } = prevQueryObj;
            const { latRange, lonRange, radius, latCentre, lonCentre } = query;
            // Manual validation - if it weren't a coding test, I'd use Joi or other validation library
            if (!bookmark || !latRange || !lonRange || !radius || !remainingPages || lonCentre === undefined || latCentre === undefined) {
                return res.status(400).json({
                    status: 'error',
                    message: `Fields 'bookmark', 'latRange', 'lonRange', 'radius', 'latCentre', 'lonCentre' and 'remainingPages' are required when 'prevQuery' is present`,
                });
            }

            const nextPage = await this.airportsApi.getNextPage(bookmark, remainingPages, latRange, lonRange, latCentre, lonCentre, radius);
            return res.json(nextPage);
        }

        // Handle first search
        // lat, lon and radius are required if first page search
        if (!lat || !lon || !rad) {
            return res.status(400).json({
                status: 'error',
                message: `Fields 'lat', 'lon' and 'range' are required when 'prevQuery' is not present`,
            });

        }

        // Validate lat: -90 <= number <= 90
        lat = parseFloat(lat);
        if (isNaN(lat)) {
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

        // Validate lon: -180 <= number <= 180
        lon = parseFloat(lon);
        if (isNaN(lon)) {
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

        // Validate radius: 1 <= number <= 500 - arbitrary, but probably sensible radius limit
        rad = parseFloat(rad);
        if (isNaN(lat)) {
            return res.status(400).json({
                status: 'error',
                message: `Field 'radius', must be a number`,
            });
        }
        if (rad < 1 || rad > 500) {
            return res.status(400).json({
                status: 'error',
                message: `Field 'radius', must be in the range of [1, 500]`,
            });
        }

        const result = await this.airportsApi.search(lat, lon, rad);
        return res.json(result);
    };
}
