import gql from 'graphql-tag'

import { STUDENT_FIELDS_FRAGMENT } from './fragments'

export const STUDENT_QUERIES = gql`
  query StudentsQuery($workspaceId: Int) {
    students(workspaceId: $workspaceId) {
      ...StudentFields
    }
  }
  ${STUDENT_FIELDS_FRAGMENT}
`
// DASHBOARD
export const STUDENT_DASHBOARD_QUERIEX = gql`
  query StudentxDashdashboardQuery($workspaceId: Int) {
    studentsDashboard(workspaceId: $workspaceId) {
      id
    }
  }
`
// DASHBOARD
export const ENCODED_IMAGE_QUERIES = gql`
  query EncodedImagesquery($workspaceId: Int!, $studentId: Int) {
    encodedImages(workspaceId: $workspaceId, studentId: $studentId) {
      id
      photoBase64
      logoBase64
      stampBase64
    }
  }
`

export const STUDENT_QUERY = gql`
  query StudentQuery($id: Int!, $workspaceId: Int) {
    student(id: $id, workspaceId: $workspaceId) {
      ...StudentFields
    }
  }
  ${STUDENT_FIELDS_FRAGMENT}
`
export const USER_STUDENT_QUERY = gql`
  query userStudent($id: ID!) {
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
      student {
        id
        slug
        first_name
        last_name
        middle_name
        phone
        gender
        photo
        adm_no
        code
        status
        klase {
          id
          name
        }
        address
        admitted_year
        guardian_name
        guardian_no
        guardian_email
        guardian_address
        term {
          id
          name
        }
        section {
          id
          name
        }
        cum_avg
        session {
          id
          name
        }
        birthday
      }
    }
  }
`

export const STUDENT_SUBJECT_ALLOCATION_QUERIES = gql`
  query StudentSubjectAllocationQuery($klaseId: Int!, $workspaceId: Int!) {
    studentSubjectAllocation(klaseId: $klaseId, workspaceId: $workspaceId) {
      id
      klase {
        id
        name
      }
      section {
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
