import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const EDIT_LINK_MUTATION = gql`
  mutation EditLinkMutation($url: String!, $description: String!, $linkID: ID!) {
    editLink(url: $url, description: $description, linkID: $linkID) {
      id
    	url
    	description
    	postedBy {
        name
      }
    }
  }
`

class EditLink extends Component {

  componentDidMount()
  {
    console.log("SEARCH PARAMS: " + this.props.location.search)
  }

  state = {
    description: '',
    url: '',
  }

  render() {

    const url = "www.testurl.com/1"
    const description = "Test Desc 1"
    const linkID = "cjmeb2l10m37a0b018bn1mc7t"

    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            // value={description}
            // onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder={description}
          />
          <input
            className="mb2"
            // value={url}
            // onChange={e => this.setState({ url: e.target.value })}
            type="text"
            placeholder={url}
          />
        </div>

        <Mutation
            mutation={EDIT_LINK_MUTATION} 
            variables={{ description, url, linkID }}
            onCompleted={() => this.props.history.push('/')}
            // update={(store, { data: { post } }) => {
            //     const data = store.readQuery({ query: FEED_QUERY })
            //     data.feed.links.unshift(post)
            //     store.writeQuery({
            //       query: FEED_QUERY,
            //       data
            //     })
            // }}            
        >
            {editLinkMutation => <button onClick={editLinkMutation}>Submit</button>}
        </Mutation>

      </div>
    )
  }
}

export default EditLink