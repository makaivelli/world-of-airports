/*
 Helper with every co-ord and globe specific logic.
 Doing math with floats in JS is probably not the best idea,
 but here we need only 'rough' estimations
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

const getLatitudeOffset = (latCentre: number, radius: number) => {
    // https://en.wikipedia.org/wiki/Latitude#Length_of_a_degree_of_latitude
    // Latitude lengths are between 110.574 and 111.694 km. Using here a rough (over)estimation
    const kmPerDeg = 112;
    const offsetDeg:number = Math.ceil(radius / kmPerDeg);
    return offsetDeg;
};

const getLongitudeOffset = (lonCentre: number, latCentre: number, radius: number) => {
    // https://en.wikipedia.org/wiki/Longitude#Length_of_a_degree_of_longitude
    const latCentreRad: number = toRadians(latCentre);
    const kmPerDeg: number = toRadians(1) * R * Math.cos(latCentreRad);
    const offsetDeg: number = Math.ceil(radius / kmPerDeg);
    return offsetDeg;
};

const isInRadius = (radius, distance) => {
    return radius >= distance;
};

const compareByDistance = (a, b) => {
    return a.distance - b.distance
};

const getDistance = (latitudeCentre: number, latitudeTarget: number, longitudeCentre: number, longitudeTarget: number) => {
    // Using 'haversine formula' - https://www.movable-type.co.uk/scripts/latlong.html
};

const geo = {
    getLatitudeRange,
    getLongitudeRange,
    isInRadius,
    compareByDistance,
    getDistance
};

export default geo;
