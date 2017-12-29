import React from "react";
import "./SearchResults.css";
import Tracklist from "../Tracklist/Tracklist.js";
import PropTypes from "prop-types";

class SearchResults extends React.Component {
  render() {
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <Tracklist
          trackInfos={this.props.trackInfos}
          isRemoval={false}
          onAdd={this.props.onAdd}
        />
      </div>
    );
  }
}

SearchResults.propTypes = {
  trackInfos: PropTypes.array,
  isRemoval: PropTypes.bool,
  onAdd: PropTypes.func
};

export default SearchResults;
