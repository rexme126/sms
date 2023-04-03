import gql from 'graphql-tag'

export const SCHOOL_STUDENT_NUMBER_FRAGMENT = gql`
  fragment StudentNumber on Numstudent {
    id
    name
    count
  }
`

export const WORKSPACE_FRAGMENT = gql`
  fragment WorkspaceFields on Workspace {
    id
    photo
    logo
    email
    status
    gender
    stamp
    bank
    account_name
    account_no
    paystack_secret_key
    numstudent {
      ...StudentNumber
    }
  }
  ${SCHOOL_STUDENT_NUMBER_FRAGMENT}
`
