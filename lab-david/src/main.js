'use strict';

import React from 'react';
import ReactDom from 'react-dom';
import request from 'superagent';

// const REDDIT_API_URL = `http://reddit.com/r/${searchFormBoard}.json?limit=${searchFormLimit}`;

class SearchForm extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      redditSearch: '',
      searchLimit: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRedditSearchChange = this.handleRedditSearchChange.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
  }

  handleRedditSearchChange(e){
    this.setState({redditSearch: e.target.value});
  }

  handleLimitChange(e){
    this.setState({searchLimit: e.target.value});
  }

  handleSubmit(e){
    e.preventDefault();
    this.props.redditSelect(this.state.redditSearch, this.state.searchLimit);
  }

  render(){
    return (
      <form>
        <input
          type='text'
          name='redditSearch'
          placeholder='Search Subreddit'
          value={this.state.redditSearch}
          onChange={this.handleRedditSearchChange} />
        <input
          type='number'
          name='searchLimit'
          placeholder='0-100 results'
          min='0'
          max='100'
          value={this.state.searchLimit}
          onChange={this.handleLimitChange} />
        <input
          type='submit'
          value='Search'
          onSubmit={this.handleSearch}/>
      </form>
    )
  }
}

class SearchResultList extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      redditLookup : {},
      redditSelected: null,
      redditSearchError: null,
    }
    this.redditSelect = this.redditSelect.bind(this);
  }

  redditSelect(search, limit){
    if(this.state.redditLookup[search] && this.state.redditLookup[search].count >= limit){
      request.get(this.state.redditLookup[search])
        .then( res => {
          this.setState({
            redditSelected: res.body,
            redditSearchError: null
          })
        })
        .catch(console.error);
    } else {
      request.get(`http://reddit.com/r/${search}.json?=${limit}`)
        .then( res => {
          let redditLookup = res.body;
          console.log('redditLookup', redditLookup);
        })
        .catch(console.error);
    }
  }

  render(){
    return (
      <div>
          <SearchForm redditSelect={this.redditSelect}/>
          <SearchResultList />
      </div>
    )
  }
}

const container = document.createElement('main');
document.body.appendChild(container);
ReactDom.render(<App />, container);