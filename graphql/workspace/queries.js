import gql from 'graphql-tag'
import { UXER_FIELDS_FRAGMENT } from '../users/fragments'
import { SCHOOL_STUDENT_NUMBER_FRAGMENT, WORKSPACE_FRAGMENT } from './fragments'

export const ADMIN_WORKSPACE_QUERIES = gql`
  query adminWorkspaceQuery($workspaceId: Int!, $status: Int) {
    adminWorkspace(workspaceId: $workspaceId, status: $status) {
      ...WorkspaceFields
    }
  }
  ${WORKSPACE_FRAGMENT}
`
export const SCHOOL_QUERIES = gql`
  query SchoolsQuery {
    schools {
      ...WorkspaceFields
      user {
        ...UxerFields
      }
    }
  }
  ${UXER_FIELDS_FRAGMENT}
  ${WORKSPACE_FRAGMENT}
`

export const SCHOOL_STUDENT_NUMBER_QUERIES = gql`
  query schoolStudentNumbersQuery {
    numStudents {
      ...StudentNumber
    }
  }
  ${SCHOOL_STUDENT_NUMBER_FRAGMENT}
`

export const SCHOOL_QUERY = gql`
  query SchoolQuery($id: ID!) {
    school(id: $id) {
      ...WorkspaceFields
      user {
        ...UxerFields
      }
    }
  }
  ${UXER_FIELDS_FRAGMENT}
  ${WORKSPACE_FRAGMENT}
`
