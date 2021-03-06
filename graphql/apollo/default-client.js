import Swal from 'sweetalert2'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { omitDeep } from '~/utils/helpers'

const errorLink = ({ redirect, route }) => {
  return onError(({ graphQLErrors, networkError }) => {
    if (networkError) {
      const { statusCode, result } = networkError
      if (statusCode === 402 && result.message === 'NoSubscriptionOrExpired') {
        return false // Do not retry request
      } else {
        // eslint-disable-next-line no-console
        console.log(`[Network error]: ${networkError}`)
      }
    }

    if (graphQLErrors) {
      graphQLErrors.map(async (err) => {
        const { extensions } = err
        if (extensions.code && extensions.code === 'TokenExpired') {
          await Swal.queue([
            {
              icon: 'warning',
              title: 'Session Expired!',
              text: 'Please log in again to continue.',
              confirmButtonText: 'Okay',
              showLoaderOnConfirm: true,
              preConfirm: () => {
                redirect({
                  name: 'login',
                  query: { next: route.path },
                })
              },
            },
          ])
        }
      })

      return false
    }
  })
}

const cleanTypenameLink = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    operation.variables = omitDeep(operation.variables, '__typename')
  }
  return forward(operation).map((data) => {
    return data
  })
})

export default function DefaultConfig(ctx) {
  const { $config } = ctx

  return {
    link: ApolloLink.from([errorLink(ctx), cleanTypenameLink]),

    // required
    httpEndpoint: `${$config.APIRoot}/graphql`,

    // optional
    // See https://www.apollographql.com/docs/link/links/http.html#options
    httpLinkOptions: {
      credentials: 'same-origin',
    },
    // You can use `wss` for secure connection (recommended in production)
    // Use `null` to disable subscriptions
    // wsEndpoint: 'ws://localhost:4000', // optional
    // LocalStorage token
    // tokenName: 'apollo-token', // optional
    // Enable Automatic Query persisting with Apollo Engine
    persisting: false, // Optional
    // Use websockets for everything (no HTTP)
    // You need to pass a `wsEndpoint` for this to work
    websocketsOnly: false, // Optional
  }
}
