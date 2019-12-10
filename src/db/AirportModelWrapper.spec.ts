import AirportModelWrapper from './AirportModelWrapper';

describe('AirportDB', () => {
    const mockAirportDBWrapper = {
        search: jest.fn(function() {
            return;
        }),
    };
    const airportModelWrapper = new AirportModelWrapper(mockAirportDBWrapper);

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call search with expected params', async () => {
        const design_name = expect.any(String);
        const search_name = expect.any(String);
        await airportModelWrapper.findAirports([-2, 2], [-40, 50]);

        expect(mockAirportDBWrapper.search).toHaveBeenCalledTimes(1);
        expect(mockAirportDBWrapper.search).toHaveBeenCalledWith(
            design_name,
            search_name,
             { q: 'lon:[ -40 TO 50] AND lat:[ -2 TO 2]' });

    });

     it('should call search with bookmark', async () => {
        const design_name = expect.any(String);
        const search_name = expect.any(String);
        await airportModelWrapper.findAirports([-2, 2], [-40, 50], 'whatever');

        expect(mockAirportDBWrapper.search).toHaveBeenCalledTimes(1);
        expect(mockAirportDBWrapper.search).toHaveBeenCalledWith(
            design_name,
            search_name,
            { q: 'lon:[ -40 TO 50] AND lat:[ -2 TO 2]', bookmark: 'whatever' })
     });
});
