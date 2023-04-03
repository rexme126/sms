import gql from 'graphql-tag'
import { SINGLE_STUDENT_FIELD_FRAGMENT, STUDENT_FIELDS_FRAGMENT } from './fragments'

export const CREATE_STUDENT_MUTATION = gql`
  mutation CreateStudentMutation(
    $workspaceId: Int
    $studentUser: StudentUserInput
    $student: StudentInput
  ) {
    createStudent(
      workspaceId: $workspaceId
      studentUser: $studentUser
      student: $student
    ) {
      id
    }
  }
`

export const UPDATE_STUDENT_MUTATION = gql`
  mutation UpdateStudentMutation(
    $id: ID!
    $workspaceId: Int
    $studentUser: EditStudentUserInput
    $student: EditStudentInput
  ) {
    updateStudent(
      id: $id
      workspaceId: $workspaceId
      studentUser: $studentUser
      student: $student
    ) {
      ...StudentFields
    }
  }
  ${STUDENT_FIELDS_FRAGMENT}
`
export const DELETE_STUDENT_MUTATION = gql`
  mutation DeleteStudentMutation($id: Int!, $workspaceId: Int) {
    deleteStudent(id: $id, workspaceId: $workspaceId)
  }
`
