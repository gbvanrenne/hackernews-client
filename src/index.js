import React from 'react'
import ReactDOM from 'react-dom'
import './STYLES/index.css'
import App from './COMPONENTS/App'
import registerServiceWorker from './registerServiceWorker'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { BrowserRouter } from 'react-router-dom'
import { setContext } from 'apollo-link-context'
import { AUTH_TOKEN } from './constants'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000'
})

// This middleware will be invoked every time ApolloClient sends a request to 
// the server. Apollo Links allow to create middlewares that let you modify 
// requests before they are sent to the server.
// https://www.apollographql.com/docs/react/recipes/authentication.html
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem(AUTH_TOKEN)
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    }
})

// You’re instantiating a WebSocketLink that knows the subscriptions endpoint. 
// The subscriptions endpoint in this case is similar to the HTTP endpoint except
// that it uses the ws instead of http protocol. Notice that you’re also 
// authenticating the websocket connection with the user’s token that you retrieve 
// from localStorage.
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000`,
  options: {
    reconnect: true,
    connectionParams: {
        authToken: localStorage.getItem(AUTH_TOKEN),
    },
  },
})

// split is used to “route” a request to a specific middleware link. It takes three 
// arguments, the first one is a test function which returns a boolean. The remaining
// two arguments are of type ApolloLink. If test returns true, the request will be
// forwarded to the link passed as the second argument. If false, to the third one.
// In this case, the test function is checking whether the requested operation is a 
// subscription. If so, it will set link to point to the web socket. Ootherwise 
// (if it’s a query or mutation), the link will be set to point to the http path.
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  authLink.concat(httpLink),
)

const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
})

ReactDOM.render(
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>,
    document.getElementById('root')
)

registerServiceWorker()