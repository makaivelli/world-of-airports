import React, { Component } from 'react';

const base_url = '/airports';

export default class Index extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      lat: 0,
      lon: 0,
      rad: 100,
      inProgress: false,
      airports: []
    };
  }

  handleError(error) {
    this.setState({
      inProgress: false
    });
    console.error('error', error);
  }

  async handleNextPage(response) {
    //let params = new URLSearchParams();
    //params.set('prevQuery', response.query);
    return fetch(`${base_url}?${params}`)
  }

  async handleResponse(response, previousPage) {
    console.info('response', response);
    const fetchedAirports = [ ...previousPage, response.rows ];
    console.info('fetchedAirports', fetchedAirports);
    if (response.total_rows > fetchedAirports.length) {
      const nextPage = await this.handleNextPage(response);
      this.handleResponse(nextPage, fetchedAirports);
    } else {
      this.sortAirports(fetchedAirports);
    }
  }

  sortAirports(airports) {
    const items = [ ...airports ];
    items.sort((a, b) => a.distance - b.distance);
    this.setState({
      airports: items,
      inProgress: false
    });
  }

  handleSubmit(evt) {
    alert('submit');
    console.info('handleSubmit', evt);
    evt.preventDefault();
    this.setState({
      airports: [],
      inProgress: true,
    });
    //let params = new URLSearchParams({lat: this.state.lat, lon: this.state.lon, rad: this.state.rad});
    // params.set('lat', this.state.lat);
    // params.append('lon', this.state.lon);
    // params.append('rad', this.state.rad);
    fetch('/airports')
      .then(this.handleResponse.bind(this))
      .catch(this.handleError.bind(this));
  }

  handleInputChange(event) {
    console.info('handleInputCghange', event);
    const { name, value } = event.target;
    this.setState(
      {
        [name]: value,
      });
  }

  render() {
    const airportsList = this.state.airports.map(function (item) {
      return (
        <li key="{item.name}">
          {item.name} - distance: {item.distance} (Lat: {item.lat}, Lon: {item / lon})
        </li>
      );
    });

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="lat">
            Latitude
            <input
              name="lat"
              id="lat"
              min={-90}
              max={90}
              onChange={this.handleInputChange}
              value={this.state.lat}
            />
          </label>
          <label htmlFor="lon">
            Longitude
            <input
              name="lon"
              id="lon"
              min={-180}
              max={180}
              onChange={this.handleInputChange}
              value={this.state.lon}
            />
          </label>
          <label htmlFor="rad">
            Radius
            <input
              name="rad"
              id="rad"
              min={1}
              max={500}
              onChange={this.handleInputChange}
              value={this.state.rad}
            />
          </label>
          <div>
            <input type="submit" value="Submit"/>
            {/*<button type="submit" disabled={this.state.inProgress}>*/}
            {/*  Find airports*/}
            {/*</button>*/}
          </div>
        </form>
        <div>
          <ol>
            {airportsList}
          </ol>
        </div>
      </div>
    )
  }
}

module.exports = Index;