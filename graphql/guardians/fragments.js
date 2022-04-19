import gql from 'graphql-tag'
import { SINGLE_STUDENT_FIELD_FRAGMENT } from '../students/fragments'

export const GUARDIANS_FIELDS_FRAGMENT = gql`
  fragment GuardiansFields on Guardian {
    id
    slug
    Students {
      ...SingleStudentField
    }
  }
`
export const SINLE_GUARDIANS_FIELDS_FRAGMENT = gql`
  fragment GuardianFields on Guardian {
    id
    slug
  }
`
