import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const VOTE_MUTATION = gql`
  mutation voteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
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
`

class Link extends Component {

  render()
  {
    const authToken = localStorage.getItem(AUTH_TOKEN)

    return (
      <div className="flex mt2 items-start">
        <div className="flex items-center">
          <span className="gray">{this.props.index + 1}.</span>
          {authToken && (
            <Mutation 
                mutation={VOTE_MUTATION} 
                variables={{ linkId: this.props.link.id }}
                update={ (store, { data: { vote } }) =>
                    this.props.updateStoreAfterVote(store, vote, this.props.link.id)
                }
            >
            {voteMutation => (
                <div className="ml1 gray f11" onClick={voteMutation}>
                ▲
                </div>
            )}
            </Mutation>
          )}
        </div>
        <div className="ml1">
          <div>
            {this.props.link.description} ({this.props.link.url})
            <span><a href={`/editLink?linkid=${this.props.link.id}&george=true`}>EDIT</a></span>
          </div>
          <div className="f6 lh-copy gray">
            {this.props.link.votes.length} votes | by{' '}
            {this.props.link.postedBy
              ? this.props.link.postedBy.name
              : 'Unknown'}{' '}
            {timeDifferenceForDate(this.props.link.createdAt)}
          </div>

          {/* If you know the link ID for the link, construct a url for an edit query
          that points to that link directly. */}          
          <div className="f6 lh-copy gray">
            Link ID: {this.props.link.id}
          </div>
        </div>
      </div>
    )
  }
}

export default Link