import gql from 'graphql-tag'

export const CREATE_SUBJECT_MUTATION = gql`
  mutation CreateSubjectMutation($subject: String!, $workspace: String) {
    createSubject(subject: $subject, workspace: $workspace) {
      id
      subject
      teachers {
        id
        first_name
        last_name
        slug
      }
    }
  }
`

export const UPDATE_SUBJECT_MUTATION = gql`
  mutation UpdateSubjectMutation($id: ID!, $subject: String!, $workspace: String) {
    updateSubject(id: $id, subject: $subject, workspace: $workspace) {
      id
      subject
    }
  }
`
export const DELETE_SUBJECT_MUTATION = gql`
  mutation DeleteSubjectMutation($id: ID!) {
    deleteSubject(id: $id) {
      id
      subject
    }
  }
`
// assign klase to teacher
export const ASSIGN_SUBJECT_TO_TEACHER_MUTATION = gql`
  mutation AssignSubjectTeacherMutation($subjects: [Int!], $teacher: Int!) {
    assignSubject(subjects: $subjects, teacher: $teacher) {
      id
      subject
    }
  }
`
