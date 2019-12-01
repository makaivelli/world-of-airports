import AirportsApi from './Airports';
import geo from '../helpers/geo';

const airportsApi = new AirportsApi();

describe('Airports API', () => {
    it(`should call 'getLatitudeRange with' 'latitudeCentre'`, () => {
        const latitudeCentre = 50;
        const longitudeCentre = 0;
        const radius = 224;
        geo.getLatitudeRange = jest.fn().mockImplementation(() => [48, 52]);

        airportsApi.search(latitudeCentre, longitudeCentre, radius);
        expect(geo.getLatitudeRange).toHaveBeenCalledWith(50, 224);
    });

    // should generate get the long range
    // should generate the lat range
    // should call the db with the right params (lat, long, query format)
    // TODO should handle pagination
    // should call the getDistance function
    // should call the filter distance function (boundig box > radius)
    // should sort the airports by distance

    // integration:
    // endpoint test: TODO validation!!!
    // where to put helpers?
});
