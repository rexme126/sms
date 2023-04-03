import gql from 'graphql-tag'

export const UXER_FIELDS_FRAGMENT = gql`
  fragment UxerFields on User {
    id
    first_name
    last_name
    middle_name
    user_type
    phone
    gender
    religion
    photo
    email
    city
    lga
    password
    created_at
    updated_at
    blood_group {
      id
      name
    }
    country {
      id
      name
      state {
        id
        name
      }
    }
    state {
      id
      name
    }
  }
`

// login details
export const USER_FIELDS_FRAGMENT = gql`
  fragment UserFields on User {
    id
    first_name
    last_name
    middle_name
    user_type
    phone
    gender
    religion
    photo
    password
    email
    password
    created_at
    updated_at
    blood_group {
      id
      name
    }
  }
`

// this should be used
export const USERS_FIELDS_FRAGMENT = gql`
  fragment UserRolesFields on User {
    id
    first_name
    last_name
    middle_name
    user_type
    phone
    gender
    religion
    photo
    email
    city
    lga
    created_at
    updated_at
    blood_group {
      id
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
    workspace {
      id
      name
      slug
      logo
      status
      paystack_secret_key
    }
  }
`
export const PERMISSION_FIELDS_FRAGMENT = gql`
  fragment PermissionFields on Permission {
    id
    name
  }
`
export const ROLE_FIELDS_FRAGMENT = gql`
  fragment RoleFields on Role {
    id
    name
    permissions {
      ...PermissionFields
    }
  }
  ${PERMISSION_FIELDS_FRAGMENT}
`
