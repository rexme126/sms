import gql from 'graphql-tag'
import { SINGLE_SUBJECTS_FIELDS_FRAGMENT } from '@/graphql/subjects/fragments'
import { SINGLE_TIMETABLE_FIELDS_FRAGMENT } from '~/graphql/timetables/fragments'

export const SINGLE_KLASE_FIELDS_FRAGMENT = gql`
  fragment SingleKlaseFields on Klase {
    id
    name
  }
`

export const KLASE_FIELDS_FRAGMENT = gql`
  fragment KlaseFields on Klase {
    id
    name
  }
`

export const KLASE_TIMETABLE_FIELDS_FRAGMENT = gql`
  fragment KlaseTimetableFields on Klase {
    id
    name
    timetables {
      ...SingleTimetableFields
    }
  }
  ${SINGLE_TIMETABLE_FIELDS_FRAGMENT}
`
