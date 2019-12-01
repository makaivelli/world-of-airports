import AirportsApi from './Airports';
import geo from '../helpers/geo';

const airportsApi = new AirportsApi();

describe('Airports API', () => {
    const latitudeCentre = 50;
    const longitudeCentre = 0;
    const radius = 224;

    it(`should call 'getLatitudeRange with' 'latitudeCentre'`, () => {
        geo.getLatitudeRange = jest.fn().mockImplementation(() => [48, 52]);

        airportsApi.search(latitudeCentre, longitudeCentre, radius);
        expect(geo.getLatitudeRange).toHaveBeenCalledWith(50, 224);
    });

    it(`should call 'getLongitudeRange with' expected params`, () => {
        geo.getLongitudeRange = jest.fn().mockImplementation(() => [-2, 2]);

        airportsApi.search(latitudeCentre, longitudeCentre, radius);
        expect(geo.getLongitudeRange).toHaveBeenCalledWith(0, 50, 224);
    });

    // should call the db with the right params (lat, long, query format)
    // TODO should handle pagination
    // should call the getDistance function
    // should call the filter distance function (boundig box > radius)
    // should sort the airports by distance

    // integration:
    // endpoint test: TODO validation!!!
    // where to put helpers?
});
