import React, { Component } from "react";
import SightList from "./SightList";
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alllocations: require("./sights.json"), // Get locations
      map: "",
      infowindow: "",
      prevmarker: ""
    };
    this.drawMap = this.drawMap.bind(this);
    this.openInfoWindow = this.openInfoWindow.bind(this);
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
  }

  componentDidMount() {

    window.drawMap = this.drawMap;
    // Load the Google Maps script
    loadJS(
      "https://maps.googleapis.com/maps/api/js?libraries=places,geometry,drawing&key=AIzaSyCvh4MPgNXk8lsld9nOxy-LVLY2JK3I0Ac&callback=drawMap"
    );
  }

 /* Code reference
  * https://github.com/udacity/ud864/blob/master/Project_Code_13_DevilInTheDetailsPlacesDetails.html
  * https://github.com/StamatisDeli/Neighborhood-map/blob/master/src/App.js
  */
  drawMap() {
    let self = this;

    const sofia = new window.google.maps.LatLng(42.696496,23.327045)

    let mapview = document.getElementById("map");
    mapview.style.height = window.innerHeight + "px";
    let map = new window.google.maps.Map(mapview, {
      center: sofia,
      zoom: 14,
      mapTypeControl: false
    });

    const InfoWindow = new window.google.maps.InfoWindow({});

    window.google.maps.event.addListener(InfoWindow, "closeclick", function() {
      self.closeInfoWindow();
    });

    this.setState({
      map: map,
      infowindow: InfoWindow
    });

    window.google.maps.event.addDomListener(window, "resize", function() {
      let center = map.getCenter();
      window.google.maps.event.trigger(map, "resize");
      self.state.map.setCenter(center);
    });

    window.google.maps.event.addListener(map, "click", function() {
      self.closeInfoWindow();
    });

    let alllocations = [];
    this.state.alllocations.forEach(function(location) {
      let longname = location.name;
      let marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(
          location.location.lat,
          location.location.lng
        ),
        animation: window.google.maps.Animation.DROP,
        map: map
      });

      marker.addListener("click", function() {
        self.openInfoWindow(marker);
      });

      location.longname = longname;
      location.marker = marker;
      location.display = true;
      alllocations.push(location);
    });
    this.setState({
      alllocations: alllocations
    });
  }


  openInfoWindow(marker) {
    this.closeInfoWindow();
    this.state.infowindow.open(this.state.map, marker);
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    this.setState({
      prevmarker: marker
    });
    this.state.infowindow.setContent("Loading Data...");
    this.state.map.setCenter(marker.getPosition());
    this.state.map.panBy(0, -200);
    this.getMarkerInfo(marker);
  }

 /* Code reference
  * https://github.com/Matildevoldsen/Neighborhood-Map-React-
  */
  getMarkerInfo(marker) {
    let self = this;

    // Api keys for foursquare
    const clientId = "CWSETWEVEL5A4GNH3V0VNYBBBKVEVRNYDLQGGWIY3VPAFH2N";
    const clientSecret = "GZVIB3C1LTVQY0UXB4WLJMHGRWIKWP3LGB04J5PAKPHW5VWG";

    let url =
      "https://api.foursquare.com/v2/venues/search?client_id=" +
      clientId +
      "&client_secret=" +
      clientSecret +
      "&v=20130815&ll=" +
      marker.getPosition().lat() +
      "," +
      marker.getPosition().lng() +
      "&limit=1";
    fetch(url)
      .then(function(response) {
        if (response.status !== 200) {
          self.state.infowindow.setContent("Oops, something went wrong!");
          return;
        }

        response.json().then(function(data) {
          console.log(data);

          let location_data = data.response.venues[0];
          let place = `<h3>${location_data.name}</h3>`;
          let street = `<p>${location_data.location.formattedAddress[0]}</p>`;
          let contact = "";
          if (location_data.contact.phone)
            contact = `<p><small>${location_data.contact.phone}</small></p>`;
          //let checkinsCount =
            //"<b>Number of CheckIn: </b>" +
            //location_data.stats.checkinsCount +
            //"<br>";
          let readMore =
            '<a href="https://foursquare.com/v/' +
            location_data.id +
            '" target="_blank">Read More on <b>Foursquare Website</b></a>';
          self.state.infowindow.setContent(
            place + street + contact + readMore
          );
        });
      })
      .catch(function(err) {
        self.state.infowindow.setContent("Oops, something went wrong!");
      });
  }


  closeInfoWindow() {
    if (this.state.prevmarker) {
      this.state.prevmarker.setAnimation(null);
    }
    this.setState({
      prevmarker: ""
    });
    this.state.infowindow.close();
  }

  render() {
    return (
      <div className='App' role='main'>

        <div className="sidebar">
            <SightList
            key="100"
            alllocations={this.state.alllocations}
            openInfoWindow={this.openInfoWindow}
            closeInfoWindow={this.closeInfoWindow}
            />
        </div>
        <section ref="map" className="map" id="map" role="application"></section>
      </div>
    );
  }
}

export default App;

function loadJS(src) {
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  script.onerror = function() {
    document.write("Google Maps can't be loaded");
  };
  ref.parentNode.insertBefore(script, ref);
}
