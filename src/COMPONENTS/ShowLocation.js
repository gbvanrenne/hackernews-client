import React from 'react'
import ReactJson from 'react-json-view'

// A simple component that shows the pathname of the current location
class ShowLocation extends React.Component {

  render() {
    // const { match, location, history } = this.props

    return (
      <div>
        <ReactJson src={this.props} />
      </div>
    )
  }
}

// Create a new component that is "connected" (to borrow redux
// terminology) to the router.
export default ShowLocation
//const ShowTheLocationWithRouter = withRouter(ShowTheLocation)