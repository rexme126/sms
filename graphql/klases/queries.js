import gql from 'graphql-tag'

export const KLASE_QUERIES = gql`
  query klasesQuery($workspaceId: Int) {
    klases(workspaceId: $workspaceId) {
      id
      name
    }
  }
`

export const KLASE_QUERY = gql`
  query klaseQuery($id: ID!, $workspaceId: Int) {
    klase(id: $id, workspaceId: $workspaceId) {
      id
      name
    }
  }
`
export const KLASES_QUERIES = gql`
  query myclassesQuery {
    klases {
      id
      name
    }
  }
`
