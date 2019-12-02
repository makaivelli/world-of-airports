const getLatitudeRange = (latCentre: number, radius: number) => {
    // TODO check if db accepts -1
    // TODO 185 -> -175
    // https://en.wikipedia.org/wiki/Latitude#Length_of_a_degree_of_latitude
    // TODO handle 180 + 5!!!
};

const getLongitudeRange = (lonCentre: number, latCentre: number, radius: number) => {
    // https://en.wikipedia.org/wiki/Longitude#Length_of_a_degree_of_longitude
    // TODO handle 90 + 5
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
