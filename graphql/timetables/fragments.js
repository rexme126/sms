import gql from 'graphql-tag'

export const TIMETABLE_FIELDS_FRAGMENT = gql`
  fragment TimetableFields on Timetable {
    id
    monday
    tuesday
    wednesday
    thursday
    friday
    time
    klase {
      id
      slug
      name
    }
  }
`

export const SINGLE_TIMETABLE_FIELDS_FRAGMENT = gql`
  fragment SingleTimetableFields on Timetable {
    id
    monday
    tuesday
    wednesday
    thursday
    friday
    time
  }
`
// export const TEACHER_TIMETABLE_FIELDS_FRAGMENT = gql`
//   fragment TeacherTimetableFields on TeacherTimetable {
//     id
//     teacher {
//       id
//       first_name
//       last_name
//     }
//     subject {
//       id
//       subject
//     }
//     klase {
//       id
//       name
//     }
//     section {
//       id
//       name
//     }
//   }
// `