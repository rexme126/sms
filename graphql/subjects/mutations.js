import gql from 'graphql-tag'
import { SINGLE_SUBJECTS_FIELDS_FRAGMENT } from './fragments'

export const CREATE_SUBJECT_MUTATION = gql`
  mutation CreateSubjectMutation(
    $subject: String!
    $subject_code: String!
    $klase_id: Int!
    $section_id: Int!
    $workspaceId: Int
  ) {
    createSubject(
      subject: $subject
      subject_code: $subject_code
      klase_id: $klase_id
      section_id: $section_id
      workspaceId: $workspaceId
    ) {
      ...SingleSubjectsFields
    }
  }
  ${SINGLE_SUBJECTS_FIELDS_FRAGMENT}
`

export const UPDATE_SUBJECT_MUTATION = gql`
  mutation UpdateSubjectMutation(
    $id: ID!
    $subject: String!
    $subject_code: String!
    $workspaceId: Int
  ) {
    updateSubject(
      id: $id
      subject: $subject
      subject_code: $subject_code
      workspaceId: $workspaceId
    ) {
      ...SingleSubjectsFields
    }
  }
  ${SINGLE_SUBJECTS_FIELDS_FRAGMENT}
`
export const DELETE_SUBJECT_MUTATION = gql`
  mutation DeleteSubjectMutation($id: ID!) {
    deleteSubject(id: $id) {
      id
      subject
    }
  }
`
