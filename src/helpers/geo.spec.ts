 /*
 Tests for the geo helper.
 If it weren't a coding test, I wouldn't use unit tests for the helpers.
 No need to automatically rerun the tests when the other parts of the code are changed.
 Helpers are isolated (we test the other parts of the code if they are calling them), we need to know only once if they're working as expected.
 I'm not testing here the math, only the logic
 Integration test for the math?
 */

import geo from '../helpers/geo';

describe('geo helper', () => {
    describe('getLatitudeStart', () => {
        it('should return the latitude start point', () => {
            const latitudeStart = geo.getLatitudeStart(5, 8);
            expect(latitudeStart).toEqual(-3);
        });
        it('should handle values overlapping -90', () => {
            const latitudeStart = geo.getLatitudeStart(-85, 8);
            expect(latitudeStart).toEqual(-90);
        });
    });

    describe('getLatitudeEnd', () => {
        it('should return the latitude end point', () => {
            const latitudeEnd = geo.getLatitudeEnd(-3, 8);
            expect(latitudeEnd).toEqual(5);
        });
        it('should handle values overlapping 90', () => {
            const latitudeEnd = geo.getLatitudeEnd(85, 8);
            expect(latitudeEnd).toEqual(90);
        });
    });

    describe('getLongitudeStart', () => {
        it('should return the longitude start point', () => {
            const longitudeStart = geo.getLongitudeStart(5, 8);
            expect(longitudeStart).toEqual(-3);
        });
        it('should handle values overlapping -180', () => {
            const longitudeStart = geo.getLongitudeStart(-175, 8);
            expect(longitudeStart).toEqual(177);
        });
    });

    describe('getLongitudeEnd', () => {
        it('should return the latitude end point', () => {
            const longitudeEnd = geo.getLongitudeEnd(-3, 8);
            expect(longitudeEnd).toEqual(5);
        });
        it('should handle values overlapping 180', () => {
            const longitudeEnd = geo.getLongitudeEnd(175, 8);
            expect(longitudeEnd).toEqual(-177);
        });
    });

    describe('isOverThePole', () => {
        it('should return false is latitude not overlapping the pole', () => {
            const latCentres = [80, -80];
            const latOffset = 5;

            latCentres.map(latCentre => {
                const isOverLapping = geo.isOverThePole(latCentre, latOffset);
                expect(!isOverLapping);
            })
        });

        it('should return false is latitude touching the pole', () => {
            const latCentres = [80, -80];
            const latOffset = 10;

            latCentres.map(latCentre => {
                const isOverLapping = geo.isOverThePole(latCentre, latOffset);
                expect(!isOverLapping);
            });
        });

        it('should return true is latitude overlaps the pole', () => {
            const latCentres = [80, -80];
            const latOffset = 15;

            latCentres.map(latCentre => {
                const isOverLapping = geo.isOverThePole(latCentre, latOffset);
                expect(isOverLapping);
            });
        });
    });

    describe('getLongitudeOffset', () => {
        it('should not return smaller value than the real offset', () => {
            const latCentres = [0, 15, 30, 45, 60, 75, 89];
            const radius = [111.320, 107.551, 96.486, 78.847, 55.800, 28.902, 1];
            // https://en.wikipedia.org/wiki/Longitude#Length_of_a_degree_of_longitude

            latCentres.map((latCentre, index) => {
                const latOffset = geo.getLongitudeOffset(latCentre, radius[index]);
                expect(latOffset).toBeGreaterThanOrEqual(1);
            });
        });

        it('should not return bigger value than the real offset + 20%', () => {
            const latCentres = [0, 15, 30, 45, 60, 75, 89];
            const radius = [111.320, 107.551, 96.486, 78.847, 55.800, 28.902, 1];
            // https://en.wikipedia.org/wiki/Longitude#Length_of_a_degree_of_longitude

            latCentres.map((latCentre, index) => {
                const latOffset = geo.getLongitudeOffset(latCentre, radius[index] * 20);
                expect(latOffset).toBeLessThanOrEqual(24);
            });
        });
    });

    describe('getLatitudeOffset', () => {
        it('should return the expected latitude offsets', () => {
            const latCentres = [0, 15, 30, 45, 60, 75, 90];
            // https://en.wikipedia.org/wiki/Latitude#Length_of_a_degree_of_latitude
            const radius = [110.574, 110.649, 110.852, 111.133, 111.412, 111.618, 111.694];

            latCentres.map((latCentre, index) => {
                const latOffset = geo.getLatitudeOffset(radius[index]);
                expect(latOffset).toEqual(1);
            });
        });
    });
});
