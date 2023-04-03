<template>
  <div class="p-3">
    <div v-if="nowLoading"><Preload /></div>
    <div v-else>
      <b-card class="px-2 mb-4">
        <b-form @submit.prevent="onSubmit">
          <div class="d-flex">
            <div v-if="!user">
              <b-form-group label="Select Student">
                <b-form-select class="mb-3">
                  <b-form-select-option value="null"> </b-form-select-option>
                </b-form-select>
              </b-form-group>
            </div>

            <div v-else class="student-width">
              <b-form-group label="Select Student">
                <b-form-select v-model="form.student_id" class="mb-3">
                  <b-form-select-option
                    v-for="student in user.guardian.students"
                    :key="student.id"
                    :value="student.id"
                    >{{ student.last_name }} {{ student.first_name }}
                  </b-form-select-option>

                  <template #first>
                    <b-form-select-option :value="null" disabled
                      >-- select student--</b-form-select-option
                    >
                  </template>
                </b-form-select>
              </b-form-group>
            </div>

            <b-button
              type="submit"
              variant="primary"
              size="md"
              style="height: 46px; margin-top: 33px"
            >
              <b-spinner
                v-if="isBusy"
                class="mr-1 mb-1"
                small
                variant="light"
              />
              Submit</b-button
            >
          </div>
        </b-form>
      </b-card>

      <div v-show="timetableDropdownClass">
        <PaymentGuardianPaymentRecords
          v-if="DuePaymentrecords"
          :PaidPaymentrecords="PaidPaymentrecords"
          :DuePaymentrecords="DuePaymentrecords"
          :email="user.guardian.email"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import { STUDENT_PAYMENT_RECORD_QUERIES } from '~/graphql/payments/queries'
import { USER_GUARDIAN_QUERY } from '~/graphql/guardians/queries'
import PaymentGuardianPaymentRecords from '~/components/Payment/GuardianPaymentRecords.vue'
import Preload from '~/components/Preload.vue'

export default {
  components: { PaymentGuardianPaymentRecords, Preload },
  middleware: 'auth',
  data() {
    return {
      PaidPaymentrecords: [],
      DuePaymentrecords: null,
      studentPaymentRecords: [],
      timetableDropdownClass: true,
      isBusy: false,
      form: {
        student_id: null,
      },

      dynamicClass: '',
      activeTab: '',
      registerMenu: false,
      registrationMenuClass: '',
    }
  },

  apollo: {
    user: {
      query: USER_GUARDIAN_QUERY,
      variables() {
        return {
          id: parseInt(this.$auth.user.id),
        }
      },
    },
  },
  computed: {
    nowLoading() {
      return this.$apollo.queries.user.loading
    },
    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
  },

  methods: {
    dynamicStudentClass(item) {
      this.dynamicClass = item
    },
    onSubmit() {
      if (this.form.student_id === null) {
        return false
      } else {
        this.isBusy = true
        this.timetableDropdownClass = false
        this.$apollo.addSmartQuery('studentPaymentRecords', {
          query: STUDENT_PAYMENT_RECORD_QUERIES,
          variables: {
            student_id: parseInt(this.form.student_id),
            workspaceId: parseInt(this.mainWorkspace.id),
            status: 'Due',
          },
          result({ loading, data }, key) {
            if (!loading) {
              this.DuePaymentrecords = data.studentPaymentRecords
            }
          },
        })

        this.$apollo.addSmartQuery('studentPaymentRecords', {
          query: STUDENT_PAYMENT_RECORD_QUERIES,
          variables: {
            student_id: parseInt(this.form.student_id),
            workspaceId: parseInt(this.mainWorkspace.id),
            status: 'Paid',
          },
          result({ loading, data }, key) {
            if (!loading) {
              this.PaidPaymentrecords = data.studentPaymentRecords
              this.isBusy = false
              this.timetableDropdownClass = true
            }
          },
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.student-width {
  width: 350px;

  @include media-breakpoint-down(sm) {
    width: 100%;
  }
}
</style>
