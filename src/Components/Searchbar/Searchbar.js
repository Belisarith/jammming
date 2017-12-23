import React from "react"
import './Searchbar.css'

class Searchbar extends React.Component{
    constructor(props){
        super(props);
        this.state = {term: ''***REMOVED***
        this.handleTermChange = this.handleTermChange.bind(this);
        this.search = this.search.bind(this);
  ***REMOVED***

    handleTermChange(event){        
        this.setState({term: event.target.value})
  ***REMOVED***

    search(){
        this.props.onSearch(this.state.term);
  ***REMOVED***

    render(){
        return (
            <div className="SearchBar">
            <input placeholder="Enter A Song Title" onChange={this.handleTermChange} />
            <a onClick={this.search}>SEARCH</a>
          </div>
        );
  ***REMOVED***
}

export default Searchbar;