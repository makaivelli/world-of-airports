import geo from '../helpers/geo';

import AirportDB from '../airportDB';
import { IAirportRow, IQuery } from '../types';

export default class AirportsApi {
    private airportsWithDistancesInRadius(rows: IAirportRow[], latCentre: number, lonCentre:number, radius:number) {
        if (rows && rows.length) {
            const airportsWithDistances = rows.map(airport => {
                const id = airport.id;
                const { lat, lon, name} = airport.fields;
                const distance: number = geo.getDistance(latCentre, lat, lonCentre, lon);
                // id used as key in react - there are airports with the same name ('Xakan')
                return {
                    id,
                    name,
                    lat,
                    lon,
                    distance
                }
            });
            const airportsInRadius = airportsWithDistances.filter(airport => geo.isInRadius(radius, airport.distance));
            return airportsInRadius;
        }
        return [];
    }
    async getNextPage(bookmark: string, remainingPages: number, latRange: number[], lonRange: number[], latCentre: number, lonCentre:number, radius: number) {
        const result = await AirportDB.findAirports(latRange, lonRange, radius, bookmark);
        const airportsWithDistancesInRadius = this.airportsWithDistancesInRadius(result.rows, latCentre, lonCentre, radius);
        remainingPages--;
        const query = {
            latRange,
            lonRange,
            latCentre,
            lonCentre,
            radius
        };
        return {
            airports: airportsWithDistancesInRadius,
            pagination: {
                query,
                remainingPages,
                bookmark: result.bookmark
            }
        }
    }

    async search(latCentre: number, lonCentre: number, radius: number) {
        const latOffset: number = geo.getLatitudeOffset(latCentre, radius);
        // Handle values under and over 90deg
        const latStart: number = geo.getLatitudeStart(latCentre, latOffset);
        const latEnd: number = geo.getLatitudeEnd(latCentre, latOffset);

        let lonStart: number;
        let lonEnd: number;
        let lonOffset: number;
        // Handle if radius overlaps the pole. We could have a second query only for the overlapping area, but that would add extra complexity around the pagination. Since there isn't too much airport around the poles, and we're filtering the results anyway, it's easier to query all.
        if (geo.isOverThePole(latCentre, latOffset)) {
            lonStart = -180;
            lonEnd = 180;
        } else {
            lonOffset = geo.getLongitudeOffset(lonCentre, latCentre, radius);
            // Handle values over and under 180 deg
            lonStart = geo.getLongitudeStart(lonCentre, lonOffset);
            lonEnd = geo.getLongitudeEnd(lonCentre, lonOffset);
        }
        const latRange = [latStart, latEnd];
        const lonRange = [lonStart, lonEnd];
        const result = await AirportDB.findAirports(latRange, lonRange, radius);
        const airportsWithDistancesInRadius = this.airportsWithDistancesInRadius(result.rows, latCentre, lonCentre, radius);
        const query: IQuery = {
            latRange,
            lonRange,
            latCentre,
            lonCentre,
            radius
        };
        const remainingPages = Math.ceil(result.total_rows / result.rows.length) -1;
        return {
            airports: airportsWithDistancesInRadius,
            pagination: {
                query,
                remainingPages,
                bookmark: result.bookmark
            }
        }
    }
}
