<template>
  <div class="student-paayment p-4">
    <div v-if="!klases && !terms && !sessions"></div>
    <div v-else>
      <b-card class="p-3 mb-4 d-flex">
        <b-form @submit.prevent="markSubmit">
          <b-row>
            <b-col md="2">
              <b-form-group label="Classes">
                <b-form-select
                  id="klases"
                  v-model="form.class"
                  value-field="id"
                  text-field="name"
                  :options="klases"
                  class="mb-3"
                  size="lg"
                >
                  <!-- This slot appears above the options from 'options' prop -->
                  <template #first>
                    <b-form-select-option :value="null" disabled
                      >-- Select class --</b-form-select-option
                    >
                  </template>

                  <!-- These options will appear after the ones from 'options' prop -->
                </b-form-select>
              </b-form-group>
            </b-col>

            <b-col md="2">
              <b-form-group label="Terms">
                <b-form-select
                  id="terms"
                  v-model="form.term"
                  value-field="id"
                  text-field="name"
                  :options="terms"
                  class="mb-3"
                  size="lg"
                >
                  <!-- This slot appears above the options from 'options' prop -->
                  <template #first>
                    <b-form-select-option :value="null" disabled
                      >-- Select term--</b-form-select-option
                    >
                  </template>

                  <!-- These options will appear after the ones from 'options' prop -->
                </b-form-select>
              </b-form-group>
            </b-col>

            <b-col md="2">
              <b-form-group label="Session">
                <b-form-select
                  id="sessions"
                  v-model="form.session"
                  value-field="id"
                  text-field="name"
                  :options="sessions"
                  class="mb-3"
                  size="lg"
                >
                  <!-- This slot appears above the options from 'options' prop -->
                  <template #first>
                    <b-form-select-option :value="null" disabled
                      >-- Select session--</b-form-select-option
                    >
                  </template>

                  <!-- These options will appear after the ones from 'options' prop -->
                </b-form-select>
              </b-form-group>
            </b-col>

            <b-button
              type="submit"
              variant="danger"
              size="lg"
              style="height: 3.8rem; margin-top: 2.83rem"
              >Submit</b-button
            >
          </b-row>
        </b-form>
      </b-card>

      <b-card v-show="paymentDropdownClass" class="p-4">
        <PaymentStudentPayment
          :paymentRecords="paymentRecords"
          :paidPaymentRecords="paidPaymentRecords"
          :student="[form.class, form.term, form.session]"
        />
      </b-card>
    </div>
  </div>
</template>

<script>
import { KLASES_QUERIES } from '~/graphql/klases/queries'
import { SESSION_QUERIES, TERM_QUERIES } from '~/graphql/marks/queries'
import {
  PAID_PAYMENT_RECORD_QUERIES,
  PAYMENT_RECORD_QUERIES,
} from '~/graphql/payments/queries'
export default {
  middleware: 'auth',
  data() {
    return {
      paymentRecords: [],
      paidPaymentRecords: [],
      paymentDropdownClass: false,
      form: {
        class: null,
        term: null,
        session: null,
      },
    }
  },
  apollo: {
    klases: {
      query: KLASES_QUERIES,
    },
    terms: {
      query: TERM_QUERIES,
    },
    sessions: {
      query: SESSION_QUERIES,
    },
  },
  methods: {
    markSubmit() {
      if (
        this.form.class === null ||
        this.form.term === null ||
        this.form.session === null
      ) {
        return false
      } else {
        this.paymentDropdownClass = true
      }
      this.$apollo.addSmartQuery('paymentRecords', {
        query: PAYMENT_RECORD_QUERIES,
        variables: {
          klase_id: parseInt(this.form.class),
          session_id: parseInt(this.form.session),
          term_id: parseInt(this.form.term),
        },
        result({ loading, data }, key) {
          if (!loading) {
            this.paymentRecords = data.paymentRecords
          }
        },
      })

      setTimeout(() => {
        this.$apollo.addSmartQuery('paidPaymentRecords', {
          query: PAID_PAYMENT_RECORD_QUERIES,
          variables: {
            klase_id: parseInt(this.form.class),
            session_id: parseInt(this.form.session),
            term_id: parseInt(this.form.term),
          },
          result({ loading, data }, key) {
            if (!loading) {
              this.paidPaymentRecords = data.paidPaymentRecords
            }
          },
        })
      }, 100)
    },
  },
}
</script>

<style lang="scss" scoped>
.student-paayment {
  font-size: 1.6rem;

  .custom-select:focus {
    box-shadow: none;
  }

  .custom-select,
  .form-control,
  .mb-3 {
    height: 4rem;
    font-size: 1.4rem;
    color: #000;
  }
}
</style>