import gql from 'graphql-tag'

import {
  PERMISSION_FIELDS_FRAGMENT,
  ROLE_FIELDS_FRAGMENT,
  USERS_FIELDS_FRAGMENT,
} from './fragments'

export const COUNTRY_QUERIES = gql`
  query CountriesQuery {
    countries {
      id
      name
      state {
        id
        name
      }
    }
  }
`

export const COUNTRY_QUERY = gql`
  query CountryQuery($id: ID) {
    country(id: $id) {
      state {
        id
        name
      }
    }
  }
`

export const STATE_QUERY = gql`
  query StateQuery($id: ID) {
    state(id: $id) {
      cities {
        id
        name
      }
    }
  }
`
export const LGA_QUERY = gql`
  query LgaQuery {
    lga {
      id
      name
    }
  }
`

export const BLOOD_GROUP_QUERIES = gql`
  query BloodGroupQuery {
    bloodGroups {
      id
      name
    }
  }
`

export const USERS_ROLE_QUERY = gql`
  query UsersQuery {
    users {
      ...UserRolesFields
    }
  }
  ${USERS_FIELDS_FRAGMENT}
`

export const USER_QUERY = gql`
  query user($id: ID!) {
    user(id: $id) {
      ...UserRolesFields
    }
  }
  ${USERS_FIELDS_FRAGMENT}
`

export const USERS_QUERY = gql`
  query OtpQuery {
    users {
      email
    }
  }
`

export const ROLEX_QUERIEX = gql`
  query UserRoleQuery($id: ID) {
    user(id: $id) {
      roles {
        id
        name
      }
    }
  }
`
export const ROLES_QUERIES = gql`
  query rolesAssignQuery {
    roles {
      id
      name
    }
  }
`

// export const PERMISSIONS_QUERY = gql`
//   query PermissionsQuery {
//     permissions {
//       ...PermissionFields
//     }
//   }
//   ${PERMISSION_FIELDS_FRAGMENT}
// `

export const USER_ROLE_QUERY = gql`
  query userRoles($id: ID!) {
    user(id: $id) {
      id
      first_name
      roles {
        ...RoleFields
      }
    }
  }
  ${ROLE_FIELDS_FRAGMENT}
`
// export const ROLES_AND_PERMISSION_QUERIES = gql`
//   query rolesQuery {
//     roles {
//       id
//       name
//       permissions {
//         id
//         name
//       }
//     }
//   }
// `

export const USER_WORKSPACE_QUERY = gql`
  query userWorkspace($id: ID) {
    userWorkspace(id: $id) {
      id
      first_name
      workspace {
        id
        name
        slug
        logo
        stamp
        status
        photo
        gender
        bank
        account_no
        account_name
        numstudent {
          id
          name
          count
        }
        paystack_secret_key
      }
    }
  }
`
