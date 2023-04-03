import gql from 'graphql-tag'
import { TEACHERS_FIELDS_FRAGMENT } from './fragments'

export const CREATE_TEACHER_MUTATION = gql`
  mutation CreateTeacherMutation(
    $workspaceId: Int
    $userTable: UsersInput
    $teacherTable: WorkersInput
  ) {
    createTeacher(
      workspaceId: $workspaceId
      userTable: $userTable
      teacherTable: $teacherTable
    ) {
      id
    }
  }
`

export const UPDATE_TEACHER_MUTATION = gql`
  mutation UpdateTeacherMutation(
    $id: ID!
    $workspaceId: Int
    $userTable: EditUsersInput
    $teacherTable: WorkersInput
  ) {
    updateTeacher(
      id: $id
      userTable: $userTable
      teacherTable: $teacherTable
      workspaceId: $workspaceId
    ) {
      ...TeachersFields
    }
  }
  ${TEACHERS_FIELDS_FRAGMENT}
`
export const DELETE_TEACHER_MUTATION = gql`
  mutation DeleteTeacherMutation($id: Int!, $workspaceId: Int) {
    deleteTeacher(id: $id, workspaceId: $workspaceId)
  }
`
export const CREATE_ASSIGN_SUBJECT_TO_TEACHER_MUTATION = gql`
  mutation createSubjectToTeacherMutation(
    $sectionId: Int!
    $workspaceId: Int!
    $klaseId: Int!
    $subjectId: [String!]
    $teacherId: Int!
  ) {
    createSubjectToTeacher(
      sectionId: $sectionId
      workspaceId: $workspaceId
      klaseId: $klaseId
      subjectId: $subjectId
      teacherId: $teacherId
    ) {
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

export const UPDATE_ASSIGN_SUBJECT_TO_TEACHER_MUTATION = gql`
  mutation updateSubjectToTeacherMutation(
    $id: ID!
    $subjectId: Int!
    $teacherId: Int!
  ) {
    updateSubjectToTeacher(
      id: $id
      subjectId: $subjectId
      teacherId: $teacherId
    ) {
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
export const DELETE_ASSIGN_SUBJECT_TO_TEACHER_MUTATION = gql`
  mutation DeleteAssignToTeacherMutation($id: ID!) {
    deleteSubjectToTeacher(id: $id)
  }
`