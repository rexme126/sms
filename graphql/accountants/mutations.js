import gql from 'graphql-tag'
import { ACCOUNTANT_FIELDS_FRAGMENT } from './fragments'


export const CREATE_ACCOUNTANT_MUTATION = gql`
  mutation CreateAccountantMutation(
    $first_name: String!
    $last_name: String!
    $gender: String!
    $email: String
    $country_id: Int!
    $state_id: Int!
    $city_id: Int!
    $lga: String
    $birthday: String
    $middle_name: String
    $photo: Upload
    $phone: String
    $qualification: String
    $blood_group_id: Int
    $religion: String
  ) {
    createAccountant(
      first_name: $first_name
      last_name: $last_name
      middle_name: $middle_name
      email: $email
      phone: $phone
      gender: $gender
      birthday: $birthday
      photo: $photo
      qualification: $qualification
      blood_group_id: $blood_group_id
      country_id: $country_id
      state_id: $state_id
      city_id: $city_id
      lga: $lga
      religion: $religion
    ) {
      id
    }
  }
`

export const UPDATE_ACCOUNTANT_MUTATION = gql`
  mutation UpdateAccountantMutation(
    $id: ID!
    $userLib: LibarianUserInput
    $lib: LibarianInput
  ) {
    updateAccountant(id: $id, userLib: $userLib, lib: $lib) {
      ...AccountantFields
    }
  }
  ${ACCOUNTANT_FIELDS_FRAGMENT}
`
export const DELETE_ACCOUNTANT_MUTATION = gql`
  mutation DeleteAccountantMutation($id: Int!) {
    deleteAccountant(id: $id)
  }
`