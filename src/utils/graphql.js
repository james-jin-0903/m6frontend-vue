const fBase = process.env.VUE_APP_FIREBASE_APIURL

import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const graphqlCache = new InMemoryCache()

export { graphqlCache }

export default new ApolloClient({
  // Provide the URL to the API server.
  link: new HttpLink({ uri: `${fBase}/graphql` }),
  // Using a cache for blazingly
  // fast subsequent queries.
  cache: graphqlCache,

  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore'
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all'
    }
  }
})
