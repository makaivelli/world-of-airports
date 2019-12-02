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

});
