import gql from 'graphql-tag'

export const SINGLE_SUBJECTS_FIELDS_FRAGMENT = gql`
  fragment SingleSubjectsFields on Subject {
    id
    subject
    subject_code
  }
`