/**
 * Helper with every co-ord and globe specific logic.
 * Doing math with floats in JS is not always the best idea,
 * but here we need only 'rough' estimations.
 */

// ~ Earth's mean radius in km
const R = 6371;

const toRadians = (x) => {
    return (Math.PI / 180) * x;
};

const getLatitudeStart = (latCentre: number, latOffset: number) => {
    return latCentre - latOffset < -90 ? -90 : latCentre - latOffset;
};

const getLatitudeEnd = (latCentre: number, latOffset: number) => {
    return latCentre + latOffset > 90 ? 90 : latCentre + latOffset;
};

const getLongitudeStart = (lonCentre: number, lonOffset: number) => {
    let start = lonCentre - lonOffset;
    return start < -180 ? lonCentre - lonOffset + 360: start;
};

const getLongitudeEnd = (lonCentre: number, lonOffset: number) => {
    return lonCentre + lonOffset > 180 ? lonCentre + lonOffset - 360: lonCentre + lonOffset;
};

const isOverThePole = (latCentre: number, latOffset: number) => {
    return latCentre + latOffset > 90 ||  latCentre - latOffset < -90;
};

const getLongitudeOffset = (latCentre: number, radius: number) => {
    // https://en.wikipedia.org/wiki/Longitude#Length_of_a_degree_of_longitude
    // Longitude lengths are between 111.320 and 0 km, depending on the latitude. Using here 10-20% overestimation.

    const latCentreRad = toRadians(latCentre);
    const kmPerDeg = toRadians(1) * R * Math.cos(latCentreRad);

    const offsetDeg = radius / kmPerDeg;
    const plus10Percent = offsetDeg * 1.1;
    const roundUpToOneDecimal = Math.ceil(plus10Percent * 10) / 10;

    // Minimum return value is 1 to avoid edge cases (close to the pole and small radius)
    return Math.max(1, roundUpToOneDecimal);
};

const getLatitudeOffset = (radius: number) => {
    // https://en.wikipedia.org/wiki/Latitude#Length_of_a_degree_of_latitude
    // Latitude lengths are between 110.574 km and 111.694 km. Using here a rough (over)estimation.

    const kmPerDeg = 111.7;

    const offsetDeg = Math.ceil(radius / kmPerDeg);

    // Minimum return value is 1 to avoid edge cases.
    return Math.max(1, offsetDeg);
};

const isInRadius = (radius: number, distance: number) => {
    return radius >= distance;
};

const compareByDistance = (a, b) => {
    return a.distance - b.distance
};

const getDistance = (latCentre: number, latTarget: number, lonCentre: number, lonTarget: number) => {
    // Using 'haversine formula' - https://www.movable-type.co.uk/scripts/latlong.html
    const deltaLatRad = toRadians(latTarget - latCentre);
    const deltaLonRad = toRadians(lonTarget - lonCentre);
    const latCentreRad = toRadians(latCentre);
    const latTargetRad = toRadians(latTarget);

    const a = Math.sin(deltaLatRad/2) * Math.sin(deltaLatRad/2) +
        Math.cos(latCentreRad) * Math.cos(latTargetRad) *
        Math.sin(deltaLonRad/2) * Math.sin(deltaLonRad/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const haversineDistance = R * c;

    // Return 0 if calculation returns bigger than the max possible value (edge cases at the poles)
    // A simple comparison doesn't work with standard JS Number handling. Normally I'd use a library like BigInteger.js
    const isBig = R - haversineDistance == R;
    return isBig ? 0 : haversineDistance;
};

const geo = {
    getLatitudeOffset,
    getLongitudeOffset,
    getLatitudeStart,
    getLatitudeEnd,
    getLongitudeStart,
    getLongitudeEnd,
    isOverThePole,
    isInRadius,
    compareByDistance,
    getDistance
};

export default geo;
