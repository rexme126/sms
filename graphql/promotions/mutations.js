import gql from 'graphql-tag'

export const CREATE_SET_PROMOTION_MUTATION = gql`
  mutation CreateSetPromotionMutation($id: ID!, $name: Int!) {
    CreateSetPromotion(id: $id, name: $name) {
      id
      name
    }
  }
`

export const CREATE_PROMOTION_MUTATION = gql`
  mutation CreatePromotionMutation(
    $klase_id: Int!
    $klaseTo: Int!
    $session_id: Int!
    $sessionTo: Int!
    $from_term: Int!
  ) {
    createPromoteStudents(
      klase_id: $klase_id
      klaseTo: $klaseTo
      session_id: $session_id
      sessionTo: $sessionTo
      from_term: $from_term
    ) {
      id
      first_name
      last_name
      adm_no
      status
      cum_avg
      klase {
        id
        name
      }
      session {
        id
        name
      }
    }
  }
`

export const CREATE_RESET_PROMOTION_MUTATION = gql`
  mutation CreateresetPromotionMutation(
    $from_class: Int!
    $status: Boolean!
    $from_session: Int!
    $from_term: Int!
  ) {
    createResetPromote(
      from_class: $from_class
      status: $status
      from_session: $from_session
      from_term: $from_term
    ) {
      id
      from_class
      from_session
      from_term
      student {
        adm_no
        status
        cum_avg
      }
    }
  }
`
