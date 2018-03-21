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
      <form onSubmit={this.handleSubmit}>
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
          className='formButton'
          type='submit'
          value='Search' />
      </form>
    )
  }
}

class SearchResultList extends React.Component {
  constructor(props){
    super(props);
    this.createList = this.createList.bind(this);
  }

  createList(){
    return this.props.redditResults.data.children.map((item, i) => {
      return (
        <li key={i}>
          <a href={item.data.url}>
            <h1>Title: {item.data.title}</h1>
            <p>Up Votes: {item.data.ups}</p>
          </a>
        </li>
      )
    });
  }

  render(){
    if(!this.props.redditResults.data){
      return (
        <div>
        </div>
      )
    } else {
      const list = this.createList();
      return (
        <div>
          <ul>{list}</ul>
        </div>
      )
    }
  }
}

class SearchError extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <div>
        <p>Could not find {this.props.redditSearchError} subreddit, please try again.</p>
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
    request.get(`http://www.reddit.com/r/${search}.json?limit=${limit}`)
      .then( res => {
        let redditLookup = res.body;

        try{
          this.setState({
            redditLookup: redditLookup,
            redditSearchError: null,
          })
        } catch(err) {
          console.error(err);
        }
      })
      .catch(err => {
        console.error(err);
        this.setState({redditSearchError: search})
      });
  }

  render(){
    return (
      <div>
          <SearchForm redditSelect={this.redditSelect}/>
          { this.state.redditSearchError ? 
          <SearchError redditSearchError={this.state.redditSearchError} /> :
          <SearchResultList redditResults={this.state.redditLookup}/>}
      </div>
    )
  }
}

const container = document.createElement('main');
document.body.appendChild(container);
ReactDom.render(<App />, container);