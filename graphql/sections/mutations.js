import gql from 'graphql-tag'

export const CREATE_SECTION_MUTATION = gql`
  mutation createSectionMutation(
    $name: String!
    $workspaceId: Int
    $klase_id: Int!
  ) {
    createSection(name: $name, workspaceId: $workspaceId, klase_id: $klase_id) {
      id
      name
      klase {
        id
        name
      }
    }
  }
`
export const UPDATE_SECTION_MUTATION = gql`
  mutation updateSectionMutation($id: ID!, $name: String!, $workspaceId: Int) {
    updateSection(id: $id, name: $name, workspaceId: $workspaceId) {
      id
      name
      klase {
        id
        name
      }
    }
  }
`

export const DELETE_SECTION_MUTATION = gql`
  mutation DeleteSectionMutation($id: ID!) {
    deleteSection(id: $id) {
      id
      name
    }
  }
`
