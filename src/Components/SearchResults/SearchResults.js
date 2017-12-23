import React from 'react'
import './SearchResults.css'
import Tracklist from '../Tracklist/Tracklist.js'

class SearchResults extends React.Component{

    render(){
        return (
        <div className="SearchResults">
            <h2>Results</h2>
            <Tracklist trackInfos={this.props.trackInfos} isRemoval={false} onAdd={this.props.onAdd}/>
        </div>
        );
    }
}

export default SearchResults;