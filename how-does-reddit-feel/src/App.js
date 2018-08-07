import React, { Component } from 'react';
import logo from './logo.svg';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Chart from "./react-google-charts";
import InputHints from 'react-input-hints';
import './App.css';

const SEARCH_API = "https://boiling-stream-94503.herokuapp.com/?q=";
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

  _handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        this.handleSearch();
      }
    }

  handleRefresh = () => {
    this.setState({ analysis: {} });
    this.setState({ loading: false });
    this.setState({ loaded: false });
    this.setState({ input: "" });;
  }

  handleSearchInput = (e) => {
    this.setState({input: e.target.value})
  }

  handleSearch = () => {
    var that = this;
    this.setState({loading: true, loadingMessage: "Loading comments..."})
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
    this.setState({loadingMessage: "Analyzing sentiments..."})
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
      analysis: [["Sentiment", "Percentage"],
                  ["Positive", pos_sum/count],
                  ["Negative", neg_sum/count]

                ],
      loading: false,
      loaded: true
    });
  }

  render() {
    const options = {
      pieHole: 0.4,
      is3D: true
    };

    if( this.state.loading ) {
      return (
        <div className="App">
        <header className="App-header">
        <div className = "headerNav" onClick={this.handleRefresh}>
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title"> How Does Reddit Feel?</h1>
        </div>
        </header>
        <br/>
        <CircularProgress/>
        <br/>
        {this.state.loadingMessage}
        </div>
      )
    } else if ( this.state.loaded ) {
      return (
        <div className="App">
        <header className="App-header">
        <div className = "headerNav" onClick={this.handleRefresh}>
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title"> How Does Reddit Feel?</h1>
        </div>
        </header>
        <br/>
        <h2> Results for {this.state.input}</h2>
        <Chart
          chartType="PieChart"
          width="100%"
          height="400px"
          data={this.state.analysis}
          options={options}
        />
        <Button variant="contained" color="primary" onClick={this.handleRefresh}>Retry</Button>

        </div>)
      } else {
        return (
          <div className="App">
          <header className="App-header">
          <div className = "headerNav" onClick={this.handleRefresh}>
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title"> How Does Reddit Feel?</h1>
          </div>
          </header>
          <p className="App-intro">
          <br/>
          To get started, enter a name you would like to analyze:
          <br/>
          </p>
          Search: <InputHints className ="search" onKeyPress={this._handleKeyPress} onChange={this.handleSearchInput}
          placeholders={[
            'Donald Trump',
            'A Quiet Place',
            'Lebron James',
            'Kim Jong Un'
          ]}
          />
          <br/>
          <br/>
          <Button variant="contained" color="primary" onClick={this.handleSearch}>Analyze</Button>
          </div>
        );
      }
    }
  }

  export default App;
