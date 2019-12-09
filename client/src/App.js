import React, { Component } from 'react';

const base_url = 'http://localhost:3001/airports';

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

  async fetchWrapper(url) {
    // fetch does not reject on HTTP errors: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
    try {
      const response = await fetch(url);
      const body = await response.json();
      if (response.ok) {
        this.handleResponse(body);
      } else {
        throw new Error(body.message);
      }
    } catch (e) {
      this.handleError(e);
    }
  }

  handleError(error) {
    this.setState({
      inProgress: false
    });
    alert(error);
  }

  handleNextPage(pagination) {
    let params = new URLSearchParams({prevQuery: JSON.stringify(pagination)});
    return this.fetchWrapper(`${base_url}?${params}`);
  }

  async handleResponse(body) {
    let inProgress = false;
    if (body && body.pagination && body.pagination.remainingPages) {
      inProgress = true;
      await this.handleNextPage(body.pagination);
    }
    const sortedAirports = this.sortAirports(body.airports);
    this.setState({
      airports: sortedAirports,
      inProgress
    });
  }

  sortAirports(airports = []) {
    const items = [ ...this.state.airports, ...airports ];
    return items.sort((a, b) => a.distance - b.distance);
  }

  handleSubmit(evt) {
    evt.preventDefault();
    this.setState({
      airports: [],
      inProgress: true,
    });
    let params = new URLSearchParams({lat: this.state.lat, lon: this.state.lon, rad: this.state.rad});
    this.fetchWrapper(`${base_url}?${params}`);
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState(
      {
        [name]: value,
      });
  }

  render() {
    const airportsList = this.state.airports.map(function (item) {
      return (
        <li key={item.id}>
          {item.name} - distance: {item.distance} (Lat: {item.lat}, Lon: {item.lon})
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
              placeholder="-90 - 90"
              onChange={this.handleInputChange}
              value={this.state.lat}
            />
          </label>
          <label htmlFor="lon">
            Longitude
            <input
              name="lon"
              id="lon"
              placeholder="-180 - 180"
              onChange={this.handleInputChange}
              value={this.state.lon}
            />
          </label>
          <label htmlFor="rad">
            Radius (km)
            <input
              name="rad"
              id="rad"
              placeholder="1 - 500"
              onChange={this.handleInputChange}
              value={this.state.rad}
            />
          </label>
          <div>
            <input type="submit" value="Submit"/>
          </div>
        </form>
        <div>
          {this.state.inProgress &&
          <p>
            Loading...
          </p>
          }
          <ol>
            {airportsList}
          </ol>
        </div>
      </div>
    )
  }
}
