import React, { Component } from 'react'
import Link from './Link'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      links {
        id
        createdAt
        url
        description
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
      count
    }
  }
`

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      node {
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

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      node {
        id
        link {
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
        user {
          id
        }
      }
    }
  }
`

class LinkList extends Component {

    _updateCacheAfterVote = (store, createVote, linkId) => {
        // Read the current state of the cached data for the FEED_QUERY from the store.
        const data = store.readQuery({ query: FEED_QUERY })
   
        // Now you’re retrieving the link that the user just voted for from that list. 
        // You’re also manipulating that link by resetting its votes to the votes that 
        // were just returned by the server.
        const votedLink = data.feed.links.find(link => link.id === linkId)
        votedLink.votes = createVote.link.votes
      
        // Finally, you take the modified data and write it back into the store.
        store.writeQuery({ query: FEED_QUERY, data })
      }

    _subscribeToNewLinks = subscribeToMore => {
        subscribeToMore({
            document: NEW_LINKS_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                const newLink = subscriptionData.data.newLink.node

                return Object.assign({}, prev, {
                    feed: {
                    links: [newLink, ...prev.feed.links],
                    count: prev.feed.links.length + 1,
                    __typename: prev.feed.__typename
                    }
                })
            }
        })
    }

    _subscribeToNewVotes = subscribeToMore => {
        subscribeToMore({
          document: NEW_VOTES_SUBSCRIPTION
        })
      }

    render() {

        return (
        <Query 
            query={FEED_QUERY} 
            variables={{ orderBy: `createdAt_DESC` }}
        >
            {({ loading, error, data, subscribeToMore }) => {
                if (loading) return <div>Fetching</div>
                if (error) return <div>Error: ${error.message}</div>

                this._subscribeToNewLinks(subscribeToMore)
                this._subscribeToNewVotes(subscribeToMore)

                const linksToRender = data.feed.links
        
                return (
                <div>
                    {linksToRender.map((link, index) => (
                        <Link
                            link={link}
                            index={index}
                            updateStoreAfterVote={this._updateCacheAfterVote}
                        />
                    ))}
                </div>
                )
            }}
        </Query>
        )
    }
}

export default LinkList