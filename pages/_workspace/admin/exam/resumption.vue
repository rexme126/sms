<template>
  <div class="p-3">
    <template v-if="nowLoading">
      <Preload />
    </template>
    <template v-else>
      <b-card class="p-3 mb-4">
        <h4 class="text-center mb-4 p-4">Enter Student Resumption Date</h4>
        <!-- end of setPromotion -->

        <b-form @submit.prevent="onSubmit">
          <b-row>
            <b-col md="2">
              <label for="input-small" class="label-padding">Term:</label>
            </b-col>

            <b-col md="4">
              <b-form-select
                id="sessions"
                v-model="form.term"
                value-field="id"
                text-field="name"
                :options="terms"
                class="mb-3"
                size="lg"
                required
              >
                <!-- This slot appears above the options from 'options' prop -->
                <template #first>
                  <b-form-select-option :value="null" disabled
                    >-- select term--</b-form-select-option
                  >
                </template>

                <!-- These options will appear after the ones from 'options' prop -->
              </b-form-select>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="2">
              <label for="input-small" class="label-padding">Session:</label>
            </b-col>

            <b-col md="4">
              <b-form-select
                id="sessions"
                v-model="form.session"
                value-field="id"
                text-field="name"
                :options="sessions"
                class="mb-3"
                size="lg"
                required
              >
                <!-- This slot appears above the options from 'options' prop -->
                <template #first>
                  <b-form-select-option :value="null" disabled
                    >-- select session--</b-form-select-option
                  >
                </template>

                <!-- These options will appear after the ones from 'options' prop -->
              </b-form-select>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="2">
              <label for="input-small" class="label-padding">Session:</label>
            </b-col>

            <b-col md="4">
              <b-form-datepicker
                id="datepicker-buttons"
                v-model="form.start"
                today-button
                reset-button
                close-button
                locale="en"
                size="lg"
                name="start"
              ></b-form-datepicker>
            </b-col>
          </b-row>

          <b-row class="mt-3">
            <b-col md="2">
              <label for="input-small" class="label-padding">Session:</label>
            </b-col>

            <b-col md="4">
              <b-form-datepicker
                id="datepick-buttons"
                v-model="form.end"
                today-button
                reset-button
                close-button
                locale="en"
                size="lg"
                name="end"
              ></b-form-datepicker>
            </b-col>
          </b-row>

          <b-button
            type="submit"
            variant="primary"
            size="md"
            style="margin-top: 2.85rem"
            :disabled="form.busy"
            ><b-spinner
              class="mr-1 mb-1"
              small
              variant="light"
              v-if="form.busy"
            />Submit</b-button
          >
        </b-form>
      </b-card>
    </template>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import Swal from 'sweetalert2'
import { SESSION_QUERIES } from '~/graphql/sessions/queries'
import { TERM_QUERIES } from '~/graphql/marks/queries'
import { UPDATE_RESUMPTION_MUTATION } from '~/graphql/examRecord/mutations'
import Preload from '~/components/Preload.vue'

export default {
  components: { Preload },
  middleware: 'auth',
  data() {
    return {
      form: {
        term: null,
        session: null,
        start: null,
        end: null,
        busy: false,
      },
    }
  },
  apollo: {
    sessions: {
      query: SESSION_QUERIES,
      variables() {
        return {
          workspaceId: parseInt(this.mainWorkspace.id),
        }
      },
    },

    terms: {
      query: TERM_QUERIES,
    },
  },
  computed: {
    nowLoading() {
      return (
        this.$apollo.queries.terms.loading &&
        this.$apollo.queries.sessions.loading
      )
    },
    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
  },
  methods: {
    dynamicStudentClass(item) {
      this.dynamicClass = item
    },
    async onSubmit() {
      if (
        this.form.term === null ||
        this.form.session === null ||
        this.form.start === null ||
        this.form.end === null
      ) {
        Swal.fire({
          title: 'Ooop...',
          icon: 'warning',
          text: `select all available fields`,
          position: 'center',
          color: '#fff',
          background: '#cc3300',
          toast: false,
          backdrop: false,
        })
        return false
      } else {
        this.busy = true

        this.form.busy = true
        // submit exam
        try {
          await this.$apollo
            .mutate({
              mutation: UPDATE_RESUMPTION_MUTATION,
              variables: {
                term_id: parseInt(this.form.term),
                term_start: this.form.start,
                term_end: this.form.end,
                session_id: parseInt(this.form.session),
                workspaceId: parseInt(this.mainWorkspace.id),
              },
            })
            .then(({data}) => {
              if(data.updateResumption.length > 0){
                Swal.fire({
                timer: 1500,
                text: 'work saved successfully',
                position: 'top-right',
                color: '#fff',
                background: '#4bb543',
                toast: false,
                backdrop: false,
                showConfirmButton: false,
              })

              this.form.busy = false
              }else{
                Swal.fire({
                timer: 1500,
                text: 'Please enter current session',
                position: 'top-right',
                color: '#fff',
                background: '#d9534f',
                toast: false,
                backdrop: false,
                showConfirmButton: false,
              })

              this.form.busy = false
              }
              
            })
        } catch ({ graphQLErrors: errors }) {
          this.form.busy = false
          if (errors && errors.length > 0) {
            const validationErrors = errors.filter(
              (err) => err.extensions.category === 'validation'
            )
            validationErrors.forEach((err) => {
              this.form.errors.set(err.extensions.validation)
            })
          }
        }
      }
    },
  },
}
</script>
