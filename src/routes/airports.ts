import * as express from 'express';

import AirportsApi from '../api/Airports';

const airportsApi = new AirportsApi();

export default async function airportsRoute (req: express.Request, res: express.Response) {
    let { prevQuery, lat, lon, rad } = req.query;
    // manual validation - if it weren't a coding test, I'd use Joi or other validation library
    // Handle next page search
    if (prevQuery) {
        let prevQueryObj = JSON.parse(prevQuery);
        const {bookmark, query, remainingPages} = prevQueryObj;
        const {latRange, lonRange, radius, latCentre, lonCentre} = query;
        // Validate
        if (!bookmark || !latRange || !lonRange || !radius || !remainingPages || !lonCentre || !latCentre) {
            return res.status(400).json({
                status: 'error',
                message: `Fields 'bookmark', 'latRange', 'longRange', 'radius', 'latCentre', 'lonCentre' and 'remainingPages' are required when 'prevQuery' is present`,
            });
        }
        const nextPage = await airportsApi.getNextPage(bookmark, remainingPages, latRange, lonRange, latCentre, lonCentre, radius);
        return res.json(nextPage);
    }
    // lat, lon and radius are required if first page search
    if (!lat || !lon || !rad) {
        return res.status(400).json({
            status: 'error',
            message: `Fields 'lat', 'lon and 'range' are required when 'prevQuery' is not present`,
        });

    }

    // Validate lat: numb <= 90
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

    // Validate lon: number <= 180
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

    // Validate radius: number <= 500 - arbitrary, but probably sensible radius limit
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
    const result = await airportsApi.search(lat, lon, rad);
    return res.json(result);
};