import React, { Component } from 'react'
import { last, getWithCancel } from '../../util.js'

const apiUrl = searchText => {
  const apiEndpoint = 'https://en.wikipedia.org/w/api.php'
  const params = new URLSearchParams()
  params.append('action', 'opensearch')
  params.append('format', 'json')
  params.append('limit', 50)
  params.append('search', searchText)
  params.append('origin', '*')

  return apiEndpoint + '?' + params
}

export default class Layout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchText: '',
      results: [],
    }

    // This will make a request like fetch but it cancels unfinished requests
    // when making a new one
    this.singleFetch = last(getWithCancel)

    // Bind this on local methods
    this.onSearchTextChanged = this.onSearchTextChanged.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
  }

  handleResponse(data) {
    this.setState(state => {
      state.results = []
      for (let i = 0; i < data[1].length; ++i) {
        const name = data[1][i]
        const descr = data[2][i]
        const link = data[3][i]
        state.results.push({name, descr, link})
      }
      return state
    })
  }

  onSearchTextChanged(event) {
    // Extract text from event to work around event reuse
    const newText = String(event.target.value).trimLeft()
    this.setState(state => {
      state.searchText = newText
      if (newText === '')
        state.results = []
      return state
    })
    // We must not perform an empty search as that is an error
    if (newText !== '')
      // Perform api search
      this.singleFetch(apiUrl(newText))
        .then(r => JSON.parse(r))
        .then(this.handleResponse)
        .catch(err => {
          if (err !== 'cancelled')
            throw new Error('Could not connect with Wikipedia API')
        })

  }

  render() {
    const state = this.state
    const results = state.results.map((article, i) => (
      <div className="article" key={i}>
        <a href={article.link}>
          <h2>{article.name}</h2>
          <p>{article.descr}</p>
        </a>
      </div>
    ))
    const className =
      state.searchText === '' ? 'collapsed' : 'expanded'
    return (
      <div className={'layout ' + className}>
        <div className="search-box">
          <input
            type="text"
            onChange={this.onSearchTextChanged}
            value={state.searchText} />
        </div>
        <div className="articles">{results}</div>
      </div>
    )
  }
}
