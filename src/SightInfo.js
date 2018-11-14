import React from "react";

class SightInfo extends React.Component {
  render() {
    return (
      <li
        role="button"
        className="place"
        tabIndex="0"
        onKeyPress={this.props.openInfoWindow.bind(
          this,
          this.props.data.marker
        )}
        onClick={this.props.openInfoWindow.bind(this, this.props.data.marker)}
      >
        {this.props.data.longname}
      </li>
    );
  }
}

export default SightInfo;
