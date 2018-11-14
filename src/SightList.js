import React, { Component } from "react";
import SightInfo from "./SightInfo";

class SightList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: "",
      query: "",
      suggestions: true
    };

    this.filterLocations = this.filterLocations.bind(this);
  }

  /* Code reference
   * https://stackoverflow.com/questions/50672010/react-how-to-filter-an-array-of-objects-in-props
   * https://stackoverflow.com/questions/43643877/filtering-a-list-with-react
   * https://github.com/manishbisht/Neighborhood-Map-React/blob/master/src/components/LocationList.js
   */
  filterLocations(event) {
    this.props.closeInfoWindow();
    const { value } = event.target;
    let locations = [];
    this.props.alllocations.forEach(function(location) {
      if (location.longname.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        location.marker.setVisible(true);
        locations.push(location);
      } else {
        location.marker.setVisible(false);
      }
    });

    this.setState({
      locations: locations,
      query: value
    });
  }

  componentWillMount() {
    this.setState({
      locations: this.props.alllocations
    });
  }

  render() {
    let locationlist = this.state.locations.map(function(listItem, index) {
      return (
        <SightInfo
          key={index}
          openInfoWindow={this.props.openInfoWindow.bind(this)}
          data={listItem}
        />
      );
    }, this);

    return (
      <div className="search-area">
        <input
          role="search"
          aria-labelledby="search locations"
          id="search-field"
          className="search-input"
          type="text"
          placeholder="Popular Sights in Sofia"
          value={this.state.query}
          onChange={this.filterLocations}
        />
        <ul className="location-list">
          {this.state.suggestions && locationlist}
        </ul>
      </div>
    );
  }
}

export default SightList;
