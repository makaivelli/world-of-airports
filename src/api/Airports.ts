const Cloudant = require('@cloudant/cloudant');
const cloudant = Cloudant({ url: 'https://mikerhodes.cloudant.com'});
const airportsDB = cloudant.db.use('airportdb');
export default class AirportsApi {
    search() {
        return []
    }
}
