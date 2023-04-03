import gql from 'graphql-tag'

import { SINGLE_SUBJECTS_FIELDS_FRAGMENT } from './fragments'

export const SUBJECT_QUERIES = gql`
  query subjectsQuery($klase_id: Int!, $workspaceId: Int, $section_id: Int!) {
    subjects(klase_id: $klase_id, workspaceId: $workspaceId, section_id: $section_id) {
      ...SingleSubjectsFields
    }
  }
  ${SINGLE_SUBJECTS_FIELDS_FRAGMENT}
`
export const SUBJECT_QUERY = gql`
  query subjectQuey($id: ID!, $workspaceId: Int) {
    subject(id: $id, workspaceId: $workspaceId) {
      ...SingleSubjectsFields
    }
  }
  ${SINGLE_SUBJECTS_FIELDS_FRAGMENT}
`
export const SUBJECTS_QUERIES = gql`
  query subjectsQueries($workspaceId: Int) {
    subjects(workspaceId: $workspaceId) {
      id
      subject
      subject_code
    }
  }
`
