import React, { Component } from 'react'
import Header from './Header'
import LinkList from './LinkList'
import CreateLink from './CreateLink'
import Login from './Login'
import Search from './Search'
import ShowLocation from './ShowLocation'
import EditLink from './EditLink'

import { Switch, Route } from 'react-router-dom'

class App extends Component {

  render() {
    return (
      <div className="center w85">
        <Header />
        <div className="ph3 pv1 background-gray">
          <Switch>
            <Route exact path="/" component={LinkList} />
            <Route exact path="/create" component={CreateLink} />
            <Route path="/editLink" component={EditLink} />
            <Route exact path="/login" component={Login} />
            <Route exact path='/search' component={Search} />
            <Route exact path='/current_path' component={ShowLocation} />
          </Switch>
        </div>
      </div>
    )
  }

}

export default App