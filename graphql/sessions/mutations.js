import gql from 'graphql-tag'

export const CREATE_SESSION_MUTATION = gql`
  mutation createSessionwMutation($name: String!, $workspaceId: Int) {
    createSession(name: $name, workspaceId: $workspaceId) {
      id
      name
    }
  }
`
export const UPDATE_SESSION_MUTATION = gql`
  mutation updateSessionMutation($id: ID!, $name: String!, $workspaceId: Int) {
    updateSession(id: $id, name: $name, workspaceId: $workspaceId) {
      id
      name
    }
  }
`
export const DELETE_SESSION_MUTATION = gql`
  mutation DeleteSessionMutation($id: ID!) {
    deleteSession(id: $id) {
      id
      name
    }
  }
`
