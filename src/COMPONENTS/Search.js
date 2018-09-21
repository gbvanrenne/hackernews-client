import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import Link from './Link'

// Search query takes in an argument called filter that will be used to constrain
// the list of links you want to retrieve. The actual filter is built and used in 
// the feed resolver which is implemented in server/src/resolvers/Query.js:
const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`

// Rendering an input field where the user can type a search string.
// The links field in the component state will hold all the links 
// to be rendered, so in this case we’re not accessing query results through 
// the component props
class Search extends Component {

  state = {
    links: [],
    filter: '',
  }

  render() {
    return (
      <div>
        <div>
          Search
          <input
            type='text'
            onChange={e => this.setState({ filter: e.target.value })}
          />
          <button onClick={() => this._executeSearch()}>OK</button>
          <button onClick={() => this._clearSearch()}>CLEAR</button>
        </div>
        {this.state.links.map((link, index) => (
          <Link key={link.id} link={link} index={index} />
        ))}
      </div>        
    )
  }

  _executeSearch = async () => {
    const { filter } = this.state
    const result = await this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter },
    })
    const links = result.data.feed.links
    this.setState({ links })
  }

  _clearSearch = () => {
    const links = []
     this.setState({ links })
  }

}

// withApollo injects the ApolloClient instance created in index.js into the 
// Search component as a new prop called client. This client has a method called 
// query which can be used to send a query manually instead of using the graphql
// higher-order component.
export default withApollo(Search)