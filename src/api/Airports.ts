import { IAirportRow, IAirports, IAirportsResult, IQuery } from '../types';

import geo from '../helpers/geo';

/**
 * AirportApi is the glue between the public route and the remote DB.
 * Responsible for the 'business logic':
 * - Handles the first and next page requests;
 * - Transforms the requests coming from the route, to get the airports from the AirportModelWrapper
 * - Adds the distances and filters the airports by the radius
 * - Formats the response to allow the client to request the next page
 */
export default class AirportsApi {
    private airportModelWrapper: any;
    constructor(airportModelWrapper) {
        this.airportModelWrapper = airportModelWrapper;
    }

    /**
     * Calculate distance from starting co-ords and filter by radius
     */
    private airportsWithDistancesInRadius(rows: IAirportRow[],
                                          latCentre: number,
                                          lonCentre:number,
                                          radius:number): IAirports[] {
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

    /**
     * Searching airports in radius, return the results
     * and some extra data - needed for pagination (handled by the client).
     * 1. Calculate the latitude and longitude ranges (radius is in km, but DB accepts co-ords)
     * 2. Query the DB
     * 3. Add distances to airports
     * 4. Filter airports
     * (DB returns bounding box, but we need a radius.
     * No need for sorting - client have to sort them anyway because of the pagination.)
     * 5. Add pagination data
     * 6. Return filtered airports and pagination data
     */
    async search(latCentre: number, lonCentre: number, radius: number): Promise<IAirportsResult> {

        const latOffset: number = geo.getLatitudeOffset(latCentre, radius);
        // Handle values under and over 90deg
        const latStart: number = geo.getLatitudeStart(latCentre, latOffset);
        const latEnd: number = geo.getLatitudeEnd(latCentre, latOffset);

        let lonStart: number;
        let lonEnd: number;
        let lonOffset: number;
        /**
         * Handle if radius overlaps the pole.
         * We could have a second query only for the overlapping area,
         * but that would add extra complexity to the pagination.
         * Since there aren't too much airport around the poles
         * and we're filtering the results anyway, it's easier to query the full longitude range.
         */
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

        const result = await this.airportModelWrapper.findAirports(latRange, lonRange);

        const airportsWithDistancesInRadius =
            this.airportsWithDistancesInRadius(result.rows, latCentre, lonCentre, radius);

        /**
         * Return data for pagination:
         * Data for next search:
         * - `bookmark`
         * - `remainingPages`
         * - `latRange`, `lonRange` - no need to calculate the offset again
         * Data for calculating the distances:
         * - `latCentre`, `lonCentre` - cannot rely on the ranges' middle if overlaps the pole
         * - `radius`
         */
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

    /**
     * Similar to [[search]], but with already provided pagination data
     */
    async getNextPage(bookmark: string,
                      remainingPages: number,
                      latRange: number[],
                      lonRange: number[],
                      latCentre: number,
                      lonCentre:number,
                      radius: number): Promise<IAirportsResult> {
        const result = await this.airportModelWrapper.findAirports(latRange, lonRange, bookmark);

        const airportsWithDistancesInRadius =
            this.airportsWithDistancesInRadius(result.rows, latCentre, lonCentre, radius);
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

}
