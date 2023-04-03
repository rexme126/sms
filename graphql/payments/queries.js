import gql from 'graphql-tag'
import {
  PAYMENT_FIELDS_FRAGMENT,
  PAYMENT_RECORD_FIELDS_FRAGMENT,
} from './fragments'

export const PAYMENT_QUERIES = gql`
  query paymentQueries($workspaceId: Int) {
    payments(workspaceId: $workspaceId) {
      ...PaymentFields
    }
  }
  ${PAYMENT_FIELDS_FRAGMENT}
`
export const PAYMENT_QUERY = gql`
  query paymentQuery($id: ID!, $workspaceId: Int) {
    payment(id: $id, workspaceId: $workspaceId) {
      id
      amount
    }
  }
`
export const PAYMENT_RECORD_QUERIES = gql`
  query paymentRecordQueries(
    $klase_id: Int!
    $session_id: Int!
    $term_id: Int!
    $workspaceId: Int
  ) {
    paymentRecords(
      klase_id: $klase_id
      session_id: $session_id
      term_id: $term_id
      workspaceId: $workspaceId
    ) {
      ...PaymentRecordFields
    }
  }
  ${PAYMENT_RECORD_FIELDS_FRAGMENT}
`
export const PAID_PAYMENT_RECORD_QUERIES = gql`
  query paidPaymentRecordQueries(
    $klase_id: Int!
    $session_id: Int!
    $term_id: Int!
    $workspaceId: Int
  ) {
    paidPaymentRecords(
      klase_id: $klase_id
      session_id: $session_id
      term_id: $term_id
      workspaceId: $workspaceId
    ) {
      ...PaymentRecordFields
    }
  }
  ${PAYMENT_RECORD_FIELDS_FRAGMENT}
`

// student query
export const STUDENT_PAYMENT_RECORD_QUERIES = gql`
  query StudentPaymentRecordQueries(
    $student_id: Int
    $status: String!
    $workspaceId: Int
  ) {
    studentPaymentRecords(
      student_id: $student_id
      status: $status
      workspaceId: $workspaceId
    ) {
      ...PaymentRecordFields
    }
  }
  ${PAYMENT_RECORD_FIELDS_FRAGMENT}
`

export const STUDENT_PAID_PAYMENT_RECORD_QUERIES = gql`
  query StudentPaidPaymentRecordQueries(
    $student_id: Int
    $status: String!
    $workspaceId: Int
  ) {
    studentPaidPaymentRecords(
      student_id: $student_id
      status: $status
      workspaceId: $workspaceId
    ) {
      ...PaymentRecordFields
    }
  }
  ${PAYMENT_RECORD_FIELDS_FRAGMENT}
`

export const STUDENT_PAYMENT_RECORD_QUERY = gql`
  query StudentPaymentRecordQuery(
    $student_id: Int
    $session_id: Int
    $term_id: Int
    $status: String!
    $workspaceId: Int
    $klase_id: Int
  ) {
    studentPaymentRecord(
      student_id: $student_id
      session_id: $session_id
      term_id: $term_id
      status: $status
      klase_id: $klase_id
      workspaceId: $workspaceId
    ) {
      ...PaymentRecordFields
    }
  }
  ${PAYMENT_RECORD_FIELDS_FRAGMENT}
`
export const ALL_DUE_PAYMENT_QUERY = gql`
  query AllDuePaymentRecordsQuery(
    $workspaceId: Int
    $first: Int!
    $page: Int!
  ) {
    allDuePaymentRecords(
      workspaceId: $workspaceId
      first: $first
      page: $page
    ) {
      data {
        ...PaymentRecordFields
      }
      paginatorInfo {
        currentPage
        lastPage
        count
        hasMorePages
        lastItem
        perPage
        total
      }
    }
  }
  ${PAYMENT_RECORD_FIELDS_FRAGMENT}
`
