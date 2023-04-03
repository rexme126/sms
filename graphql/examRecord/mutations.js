import gql from 'graphql-tag'
import { EXAM_RECORD_FIELDS_FRAGMENT } from './fragments'

export const UPDATE_PUBLISH_RESULT_MUTATION = gql`
  mutation UpdatePublishResultMutation(
    $klase_id: Int!
    $status: String!
    $section_id: Int
    $session_id: Int!
    $term_id: Int!
    $workspaceId: Int
  ) {
    updatePublishResult(
      klase_id: $klase_id
      status: $status
      session_id: $session_id
      section_id: $section_id
      term_id: $term_id
      workspaceId: $workspaceId
    ) {
      ...ExamRecordFields
    }
  }
  ${EXAM_RECORD_FIELDS_FRAGMENT}
`
export const UPDATE_P_TC_OMMENTS_MUTATION = gql`
  mutation UpdateP_T_CommentMutation(
    $id: ID!
    $p_comment: String
    $t_comment: String
    $workspace_id: Int!
  ) {
    updatePTComment(
      id: $id
      p_comment: $p_comment
      t_comment: $t_comment
      workspace_id: $workspace_id
    ) {
      ...ExamRecordFields
    }
  }
  ${EXAM_RECORD_FIELDS_FRAGMENT}
`
// class attendance record

export const UPDATE_ATTENDANCE_MUTATION = gql`
  mutation UpdateAttendanceMutation(
    $attendances: [AttendanceInput]
    $num_total: Int
    $klase_id: Int!
    $term_id: Int!
    $session_id: Int!
    $section_id: Int!
    $workspaceId: Int
  ) {
    updateAttendance(
      attendances: $attendances
      num_total: $num_total
      klase_id: $klase_id
      term_id: $term_id
      session_id: $session_id
      section_id: $section_id
      workspaceId: $workspaceId
    ) {
      id
    }
  }
`
export const UPDATE_RESUMPTION_MUTATION = gql`
  mutation UpdateResumtionMutation(
    $term_id: Int!
    $term_start: String!
    $term_end: String!
    $session_id: Int!
    $workspaceId: Int!
  ) {
    updateResumption(
      term_id: $term_id
      term_start: $term_start
      term_end: $term_end
      session_id: $session_id
      workspaceId: $workspaceId
    ) {
      ...ExamRecordFields
    }
  }
  ${EXAM_RECORD_FIELDS_FRAGMENT}
`
// graduate students

export const CREATE_GRADUATE_MUTATION = gql`
  mutation CreateGraduateMutation(
    $klase_id: Int!
    $session_id: Int!
    $status: String!
    $workspaceId: Int!
  ) {
    createGraduates(
      klase_id: $klase_id
      session_id: $session_id
      status: $status
      workspaceId: $workspaceId
    ) {
      ...ExamRecordFields
    }
  }${EXAM_RECORD_FIELDS_FRAGMENT}
`
