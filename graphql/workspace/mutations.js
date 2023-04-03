import gql from 'graphql-tag'
import { UXER_FIELDS_FRAGMENT } from '../users/fragments'
import { SCHOOL_STUDENT_NUMBER_FRAGMENT, WORKSPACE_FRAGMENT } from './fragments'

export const CREATE_SCHOOL_MUTATION = gql`
  mutation CreateSchoolMutation(
    $name: String!
    $slug: String!
    $email: String!
    $phone: String!
    $gender: String!
    $numStudentId: Int!
    $first_name: String!
    $last_name: String!
    $lga: String
    $country: Int!
    $state: Int!
    $city: String!
    $photo: Upload
  ) {
    createSchool(
      name: $name
      slug: $slug
      email: $email
      gender: $gender
      numStudentId: $numStudentId
      phone: $phone
      first_name: $first_name
      last_name: $last_name
      lga: $lga
      country: $country
      state: $state
      city: $city
      photo: $photo
    )
  }
`
export const UPDATE_SCHOOL_MUTATION = gql`
  mutation UpdateSchoolMutation(
    $id: Int!
    $name: String!
    $slug: String!
    $email: String!
    $phone: String!
    $gender: String!
    $numStudentId: Int!
    $first_name: String!
    $last_name: String!
    $lga: String
    $country: Int!
    $state: Int!
    $city: String!
    $photo: Upload
  ) {
    updateSchool(
      id: $id
      name: $name
      slug: $slug
      email: $email
      phone: $phone
      gender: $gender
      numStudentId: $numStudentId
      first_name: $first_name
      last_name: $last_name
      lga: $lga
      country: $country
      state: $state
      city: $city
      photo: $photo
    ) {
      id
      name
      slug
      email
      status
      photo
      gender
      numstudent {
        ...StudentNumber
      }
      user {
        ...UxerFields
      }
    }
  }
  ${UXER_FIELDS_FRAGMENT}
  ${SCHOOL_STUDENT_NUMBER_FRAGMENT}
`

export const DELETE_SCHOOL_MUTATION = gql`
  mutation deleteSchoolMutation($workspaceId: Int!) {
    deleteSchool(workspaceId: $workspaceId)
  }
`
export const UPDATE_SETTING_ADMIN_MUTATION = gql`
  mutation UpdateSettingsMutation(
    $workspaceId: ID!
    $logo: Upload
    $stamp: Upload
    $bank: String
    $account_name: String
    $account_no: String
    $paystack_secret_key: String
  ) {
    updateAdminSettings(
      workspaceId: $workspaceId
      logo: $logo
      stamp: $stamp
      bank: $bank
      account_name: $account_name
      account_no: $account_no
      paystack_secret_key: $paystack_secret_key
    ) {
      ...WorkspaceFields
    }
  }
  ${WORKSPACE_FRAGMENT}
`
export const SUSPEND_SCHOOL_MUTATION = gql`
  mutation SuspendSchoolMutation($workspaceId: ID!, $status: Int!) {
    SuspendSchool(workspaceId: $workspaceId, status: $status) {
      ...WorkspaceFields
    }
  }
  ${WORKSPACE_FRAGMENT}
`
