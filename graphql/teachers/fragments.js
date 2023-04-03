import gql from 'graphql-tag'
import { KLASE_FIELDS_FRAGMENT } from '~/graphql/klases/fragments'
import { UXER_FIELDS_FRAGMENT } from '@/graphql/users/fragments'

export const TEACHER_FIELDS_FRAGMENT = gql`
  fragment TeacherFields on Teacher {
    id
    slug
    first_name
    last_name
    middle_name
    phone
    gender
    code
    photo
    birthday
    qualification
    employment
  }
`
export const TEACHERS_FIELDS_FRAGMENT = gql`
  fragment TeachersFields on Teacher {
    id
    slug
    first_name
    last_name
    middle_name
    phone
    gender
    code
    photo
    birthday
    qualification
    employment
    user {
      ...UxerFields
    }
  }
  ${UXER_FIELDS_FRAGMENT}
`