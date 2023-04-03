<template>
  <div class="payment-fonts">
    <template v-if="$apollo.queries.studentPaymentRecord.loading"
      ><Preload
    /></template>
    <template v-else>
      <div class="card-body">
        <div class="card-student" style="background-color: #fff">
          <div style="padding: 2rem; margin: auto; min-height: 100vh">
            <div class="mt-4">
              <div class="text-center mb-4">
                <div v-if="mainWorkspace.logo == null"></div>
                <img
                  v-else
                  :src="`${$config.APIRoot}/storage/${mainWorkspace.id}/logo/${mainWorkspace.logo}`"
                  alt="logo"
                  width="100"
                />
              </div>

              <h2
                class="text-center"
                style="
                  color: #1c0988;
                  text-transform: uppercase;
                  font-weight: bold;
                "
              >
                {{ mainWorkspace.name }}
              </h2>
              <h6
                class="text-center"
                style="
                  text-transform: uppercase;
                  color: #1c0988;
                  font-weight: bold;
                  margin-bottom: 5rem;
                "
              >
                {{ studentPaymentRecord.session.name }}
                Session
              </h6>
            </div>

            <div
              class="d-flex justify-content-align mt-2 p-2"
              style="background-color: #007bff; color: #fff"
            >
              STUDENT INFORMATION
            </div>

            <div class="text-center mt-3">
              <div v-if="studentPaymentRecord.student.photo == null"></div>
              <b-img
                v-else
                :src="`${$config.APIRoot}/storage/${mainWorkspace.id}/students/${studentPaymentRecord.student.photo}`"
                alt="student"
                width="100"
              ></b-img>
            </div>

            <div class="d-flex justify-content-between mt-5">
              <div>
                <h6>FULL NAME:</h6>
                <h6>ADM_NO:</h6>
                <h6>CLASS:</h6>
              </div>

              <div style="text-transform: uppercase">
                <h6>
                  {{ studentPaymentRecord.student.first_name }}
                  {{ studentPaymentRecord.student.last_name }}
                  {{ studentPaymentRecord.student.middle_name }}
                </h6>
                <h6>
                  {{ studentPaymentRecord.student.adm_no }}
                </h6>
                <h6>{{ studentPaymentRecord.student.last_name }}</h6>
                <h6>{{ studentPaymentRecord.klase.name }}</h6>
              </div>
            </div>

            <h5
              class="d-flex justify-content-align mt-4 p-2"
              style="background-color: #007bff; color: #fff"
            >
              PAYMENT INFORMATION
            </h5>
            <div class="d-flex justify-content-between mt-4">
              <div>
                <h6>TITLE:</h6>

                <h6>REFERENCE:</h6>

                <h6>Amount</h6>

                <h6>Amount Paid:</h6>

                <h6>Balance</h6>
                <h6>Payment Date</h6>
              </div>

              <div style="margin-left: 3rem">
                <h6>{{ studentPaymentRecord.title }}</h6>
                <h6>{{ studentPaymentRecord.ref_no }}</h6>
                <h6><span>&#x20A6;</span>{{ studentPaymentRecord.amount }}</h6>
                <h6>
                  <span>&#x20A6;</span>{{ studentPaymentRecord.amt_paid }}
                </h6>
                <h6><span>&#x20A6;</span>{{ studentPaymentRecord.balance }}</h6>
                <h6>{{ studentPaymentRecord.created_at | formatDate }}</h6>
              </div>
            </div>

            <h5
              class="d-flex justify-content-align mt-4 p-2"
              style="background-color: #007bff; color: #fff"
            >
              SCHOOL BANK DETIALS
            </h5>
            <div class="d-flex justify-content-between mt-4">
              <div>
                <h6>Account Name</h6>
                <h6>Account Number</h6>
                <h6>Bank</h6>
              </div>

              <div>
                <h6>{{ mainWorkspace.account_name }}</h6>
                <h6 style="letter-spacing: 2px">
                  {{ mainWorkspace.account_no }}
                </h6>
                <h6>{{ mainWorkspace.bank }}</h6>
              </div>
            </div>
            <h3 class="text-center mt-2" style="color: green">
              After payment please take your proof of payment to the school for
              confrmation
            </h3>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import { STUDENT_PAYMENT_RECORD_QUERY } from '~/graphql/payments/queries'
import Preload from '~/components/Preload.vue'

export default {
  components: { Preload },
  middleware: 'auth',
  filters: {
    formatDate(value) {
      const date = moment.utc(value).local()
      return date.format('D MMM YYYY')
    },
  },
  data() {
    return {
      form: new this.$form({
        amount: null,
      }),
    }
  },
  // pk_test_d5fd91ddaacfe58b24ad1d30afa93df737aff214
  computed: {
    ...mapState(useWorkspaceStore, ['currentWorkspace']),
    mainWorkspace() {
      return this.currentWorkspace
    },
    studentId() {
      return this.$route.query.student_id
    },

    sessionId() {
      return this.$route.query.session_id
    },
    termId() {
      return this.$route.query.term_id
    },
  },
  apollo: {
    studentPaymentRecord: {
      query: STUDENT_PAYMENT_RECORD_QUERY,
      variables() {
        return {
          student_id: parseInt(this.studentId),
          session_id: parseInt(this.sessionId),
          term_id: parseInt(this.termId),
          workspaceId: parseInt(this.mainWorkspace.id),
          status: 'Due',
        }
      },
    },
  },
}
</script>
