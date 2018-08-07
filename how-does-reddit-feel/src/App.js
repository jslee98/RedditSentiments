import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
const SEARCH_API = "http://localhost:8080/?q=";
const vader = require('vader-sentiment');


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      input: "",
      loading: false,
      loaded: false,
      analysis: {}
    };
  }

  handleRefresh = () => {
    this.setState({ analysis: {} });
    this.setState({ loading: false });
    this.setState({ loaded: false });
    this.setState({ input: "" });;
  }

  handleSearchInput = () => {
    this.setState({input: this.refs.searchInput.value})
  }

  handleSearch = () => {
    var that = this;
    this.setState({loading: true})
    var apiRequest = SEARCH_API + this.state.input.split(' ').join('%20');
    fetch(apiRequest)
    .then(function(response){
      console.log('hit');
      return response.json();
    }).then(function(data){
      that.analyzeData(data.data);
    })
  }

  analyzeData ( data ) {
    console.log(data);
    let count = 0;
    let pos_sum = 0;
    let neg_sum = 0;
    let neu_sum = 0;
    for(var i = 0; i < data.length; i++) {
      if (data[i].body.length < 500) {
        const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(data[i].body);
        console.log(intensity);
        pos_sum += intensity.pos;
        neg_sum += intensity.neg;
        neu_sum += intensity.neu;
        count++;
      }
    }
    this.setState({
      analysis: {
                  pos: pos_sum/count,
                  neu: neu_sum/count,
                  neg: neg_sum/count
                }
    });
    this.setState({ loading: false });
    this.setState({ loaded: true });
  }


  render() {
    if( this.state.loading ) {
      return (
        <div className="App">
        <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title"> How Does Reddit Feel?</h1>
        </header>
        <p className="App-intro">
        Loading...
        </p>
        </div>
      )
    } else if ( this.state.loaded ) {
      return (
        <div className="App">
        <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title"> How Does Reddit Feel?</h1>
        </header>
        <p className="App-intro">
        <b> Score for {this.state.input} </b>
        <br/>
        {this.state.analysis.pos * 100}% Positive
        <br/>
        {this.state.analysis.neu * 100}% Neutral
        <br/>
        {this.state.analysis.neg * 100}% Negative
        </p>
        <button onClick={this.handleRefresh}>Retry</button>
        </div>)
      } else {
        return (
          <div className="App">
          <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title"> How Does Reddit Feel?</h1>
          </header>
          <p className="App-intro">
          To get started, enter a name you would like to analyze:
          <br/>
          Search: <input ref='searchInput' type="text" placeholder="Celebrity" onChange={this.handleSearchInput}/>
          <button type="submit" onClick={this.handleSearch}>Analyze</button>
          </p>
          </div>
        );
      }
    }
  }

  export default App;
