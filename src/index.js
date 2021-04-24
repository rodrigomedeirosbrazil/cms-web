import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient, ApolloLink, InMemoryCache, HttpLink } from 'apollo-boost';

import { getAuth } from './services/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const httpLink = new HttpLink({ uri: 'https://cms-medeirostec.herokuapp.com/v1/graphql' });

const authLink = new ApolloLink((operation, forward) => {
  const auth = getAuth();
  const token = auth.token;

  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : ''
    }
  });

  // Call the next link in the middleware chain.
  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink), // Chain it with the HttpLink
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)