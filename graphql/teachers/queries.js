import gql from 'graphql-tag'

import {
  TEACHERS_FIELDS_FRAGMENT,
} from './fragments'

// dashboard
export const TEACHER_DASHBOARD_QUERIES = gql`
  query TeachersDashboardQueries($workspaceId: Int) {
    teachersDashboard(workspaceId: $workspaceId) {
      id
    }
  }
`

export const TEACHER_QUERY = gql`
  query TeacherQuery($id: Int!, $workspaceId: Int) {
    teacher(id: $id, workspaceId: $workspaceId) {
      ...TeachersFields
    }
  }
  ${TEACHERS_FIELDS_FRAGMENT}
`

// used by all
export const TEACHERS_QUERIES = gql`
  query TeachersQuery($workspaceId: Int) {
    teachers(workspaceId: $workspaceId) {
      ...TeachersFields
    }
  }
  ${TEACHERS_FIELDS_FRAGMENT}
`

export const USER_TEACHER_QUERY = gql`
  query userTeacher($id: ID!) {
    user(id: $id) {
      id
      blood_group {
        name
      }
      country {
        id
        name
      }
      state {
        id
        name  
      }
      city
      lga
      teacher {
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
    }
  }
`

// assign subject to teacher

export const ASSIGN_SUBJECT_TO_TEACHER_QUERIES = gql`
  query assignSubjectToTeacherQuery(
    $sectionId: Int!
    $workspaceId: Int!
    $klaseId: Int!
  ) {
    assignSubjectToTeachers(
      sectionId: $sectionId
      workspaceId: $workspaceId
      klaseId: $klaseId
    ) {
      id
      klase {
        id
        name
      }
      section{
        id
        name
      }
      subject {
        id
        subject
      }
      teacher {
        id
        first_name
        last_name
      }
    }
  }
`
export const TEACHER_SUBJECT_ALLOCATION_QUERIES = gql`
  query TeacherSubjectAllocationQuery(
    $teacherId: Int!
    $workspaceId: Int!
  ) {
    teacherSubjectAllocation(
      teacherId: $teacherId
      workspaceId: $workspaceId
    ) {
      id
      klase {
        id
        name
      }
      section{
        id
        name
      }
      subject {
        id
        subject
      }
      teacher {
        id
        first_name
        last_name
      }
    }
  }
`