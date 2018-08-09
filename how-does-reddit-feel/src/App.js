import React, { Component } from 'react';
import logo from './logo.png';
import { Button, DropdownButton, FormGroup, InputGroup, MenuItem } from 'react-bootstrap'
import CircularProgress from '@material-ui/core/CircularProgress';
import Chart from "./react-google-charts";
import InputHints from 'react-input-hints';
import './App.css';

//const SEARCH_API = "https://boiling-stream-94503.herokuapp.com/?q=";
const SEARCH_API = "http://localhost:8080/search/?q=";
const TOP_API = "http://localhost:8080/top/?q=";
const vader = require('vader-sentiment');

class App extends Component {

  constructor(props) {

    super(props);
    this.state = {
      input: "",
      loadingAnalysis: false,
      loadingTrending: false,
      loadingStarted: false,
      analysis: {},
      searchType: "Type",
      trendingPost1: {},
      trendingPost2: {}
    };
  }

  handleSearchType = (key) => {
      this.setState({searchType: key});
    }

  handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        this.handleSearch();
      }
    }

  handleRefresh = () => {
    this.setState({ analysis: {} });
    this.setState({ loadingAnalysis: false });
    this.setState({ loadingTrending: false });
    this.setState({ loadingStarted: false });
    this.setState({ input: "" });;
    this.setState({ searchType: "Type" });;
  }

  handleSearchInput = (e) => {
    this.setState({input: e.target.value})
  }

  handleSearch = () => {
  var that = this;
  if (!this.state.input.length == 0) {
    this.setState({loadingStarted: true, loadingMessage: "Loading comments...", loadingAnalysis: true, loadingTrending: true})
    this.getTrendingPosts();
    var apiRequest = SEARCH_API + this.state.input.split(' ').join('%20') + "&type=" + this.state.searchType;
    fetch(apiRequest).then(function(response) {
      return response.json();
    }).then(function(data) {
      that.analyzeData(data.data);
    })
  }
}

  getTrendingPosts = () => {
    var that = this;
    var trendingRequest = TOP_API + this.state.input.split(' ').join('%20');
    fetch(trendingRequest)
    .then(function(response){
      console.log(response);
      return response.json();
    }).then(function(results){
      console.log(results);
      try {
        that.setState({trendingPost1: {
          subredditLink: "http://www.reddit.com/" + results[0].data.subreddit_name_prefixed,
          postLink: "http://www.reddit.com" + results[0].data.permalink,
          title: results[0].data.title,
          subreddit: results[0].data.subreddit_name_prefixed
        }})

        that.setState({trendingPost2: {
          subredditLink: "http://www.reddit.com/" + results[1].data.subreddit_name_prefixed,
          postLink: "http://www.reddit.com" + results[1].data.permalink,
          title: results[1].data.title,
          subreddit: results[1].data.subreddit_name_prefixed
        }})
      } catch (ex) {
        console.log(ex);
      }
      that.setState({loadingTrending: false})
    })
  }

  analyzeData ( data ) {
    //console.log(data);
    this.setState({loadingMessage: "Analyzing sentiments..."})
    let count = 0;
    let pos_sum = 0;
    let neg_sum = 0;
    if (this.state.searchType == "Comments" || this.state.searchType == "Type") {
      for(var i = 0; i < data.length; i++) {
        if (data[i].body.length < 500) {
          const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(data[i].body);
          pos_sum += intensity.pos;
          neg_sum += intensity.neg;
          count++;
        }
      }
    } else {
      for(var i = 0; i < data.length; i++) {
          const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(data[i].title);
          pos_sum += intensity.pos;
          neg_sum += intensity.neg;
          count++;
    }
  }

    this.setState({
      analysis: [["Sentiment", "Percentage"],
                  ["Positive", pos_sum/count],
                  ["Negative", neg_sum/count]

                ],
      loadingAnalysis: false
    });
  }

  render() {


    const options = {
      pieHole: 0.4,
      is3D: true
    };

    if( this.state.loadingAnalysis || this.state.loadingTrending) {
      return (
        <div className="App">
        <header className="App-header">
        <div className = "headerNav" onClick={this.handleRefresh}>
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        </header>
        <br/>
        <CircularProgress/>
        <br/>
        {this.state.loadingMessage}
        </div>
      )
    } else if ( this.state.loadingStarted ) {
      return (
        <div className="App">
        <header className="App-header">
        <div className = "headerNav" onClick={this.handleRefresh}>
          <img src={logo} className="App-logo" alt="logo" />

        </div>
        </header>
        <br/>
        <h2> Results for {this.state.input}</h2>
        <div className="col-sm-6 mx-3">
        <h3>Reddit's Sentiments</h3>
        <Chart
          chartType="PieChart"
          width="100%"
          height="400px"
          data={this.state.analysis}
          options={options}
        />

        </div>
      <div className="col-sm-6 mx-3">
      <h3>Trending Posts</h3>
        <blockquote className="reddit-card" data-card-preview="0">
          <a href={this.state.trendingPost1.postLink}>{this.state.trendingPost1.title}</a>
          from
          <a href={this.state.trendingPost1.subredditLink}>{this.state.trendingPost1.subreddit}</a>
        </blockquote>
        <blockquote className="reddit-card" data-card-preview="0">
          <a href={this.state.trendingPost2.postLink}>{this.state.trendingPost2.title}</a>
          from
          <a href={this.state.trendingPost2.subredditLink}>{this.state.trendingPost2.subreddit}</a>
        </blockquote>
      </div>
      <div className="col-sm-12">

        <Button variant="contained" className="analyzeButton mb-5" onClick={this.handleRefresh}>Retry</Button>
        <br/>
        <br/>
      </div>

        </div>)
      } else {
        return (
          <div className="App">
          <header className="App-header">
          <div className = "headerNav" onClick={this.handleRefresh}>
            <img src={logo} className="App-logo" alt="logo" />
          </div>
          </header>
          <p className="App-intro">
          <br/>
          To get started, enter a topic you would like to analyze:
          <br/>
          </p>
          <div className="col-sm-6 col-sm-offset-3">
          <FormGroup>
            <InputGroup>
              <InputHints className="search" onKeyPress={this.handleKeyPress} onChange={this.handleSearchInput}
              placeholders={[

                'Bitcoin',
                'A Quiet Place',
                'Lebron James',
                'Donald Trump'
              ]}
              />
              <DropdownButton
                componentClass={InputGroup.Button}
                name="typeDropdown"
                id="input-dropdown-addon"
                title={this.state.searchType}
                onSelect={this.handleSearchType}>
                <MenuItem eventKey="Posts">Posts</MenuItem>
                <MenuItem eventKey="Comments">Comments</MenuItem>
              </DropdownButton>
            </InputGroup>
          </FormGroup>
          <br/>
          <Button variant="contained" className="analyzeButton" onClick={this.handleSearch}>Analyze</Button>
          </div>
          </div>
        );
      }
    }
  }

  export default App;
