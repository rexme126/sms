<template>
  <div class="p-3">
    <template v-if="nowLoading"><Preload /></template>
    <template v-else>
      <b-card class="mb-2 d-flex">
        <b-form @submit.prevent="markSubmit">
          <b-row>
            <b-col md="2">
              <b-form-group label="Clases">
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
                      >-- select class--</b-form-select-option
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
                      >-- select term--</b-form-select-option
                    >
                  </template>

                  <!-- These options will appear after the ones from 'options' prop -->
                </b-form-select>
              </b-form-group>
            </b-col>

            <b-col md="2">
              <b-form-group label="Section">
                <b-form-select
                  id="sections"
                  v-model="form.section"
                  value-field="id"
                  text-field="name"
                  :options="sections"
                  class="mb-3"
                  size="lg"
                >
                  <!-- This slot appears above the options from 'options' prop -->
                  <template #first>
                    <b-form-select-option :value="null" disabled
                      >-- select section--</b-form-select-option
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
                      >-- select session--</b-form-select-option
                    >
                  </template>

                  <!-- These options will appear after the ones from 'options' prop -->
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-button
              type="submit"
              variant="primary"
              size="md"
              style="height: 45px; margin-top: 34px"
              :disabled="isBusy"
              ><b-spinner
                class="mr-1 mb-1"
                small
                variant="light"
                v-if="isBusy"
              />Submit</b-button
            >
          </b-row>
        </b-form>
      </b-card>

      <div v-show="timetableDropdownClass">
        <ExamPublishResult
          v-if="records"
          :firstTermRecords="firstTermRecords"
          :secondTermRecords="secondTermRecords"
          :records="records"
          :marks="marks"
          :subjects="markSubjects"
          :studentx="studentx"
          :student="[form.class, form.term, form.session, form.section]"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import {
  EXAM_RECORD_QUERIES,
} from '~/graphql/examRecord/queries'
import { KLASE_QUERIES } from '~/graphql/klases/queries'
import {
  MARK_QUERIES,
  MARK_STUDENT_QUERIES,
  MARK_SUBJECT_QUERIES,
  TERM_QUERIES,
} from '~/graphql/marks/queries'
import { SECTION_QUERIES } from '~/graphql/sections/queries'
import { SESSION_QUERIES } from '~/graphql/sessions/queries'
import ExamPublishResult from '~/components/Exam/PublishResult.vue'
import Preload from '~/components/Preload.vue'

export default {
  components: { ExamPublishResult, Preload },
  middleware: 'auth',
  data() {
    return {
      records: null,
      firstTermRecords: [],
      secondTermRecords: [],
      klaseResults: [],
      marks: [],
      markSubjects: [],
      markStudents: [],
      studentx: [],
      publishResult: null,
      timetableDropdownClass: false,
      form: {
        class: null,
        session: null,
        term: null,
        section: null,
      },

      dynamicClass: '',
      activeTab: '',
      registerMenu: false,
      registrationMenuClass: '',
      isBusy: false,
    }
  },
  apollo: {
    klases: {
      query: KLASE_QUERIES,
      variables() {
        return {
          workspaceId: parseInt(this.mainWorkspace.id),
        }
      },
    },

    terms: {
      query: TERM_QUERIES,
    },
    sections: {
      query: SECTION_QUERIES,
      variables() {
        return {
          klase_id: parseInt(this.form.class),
          workspaceId: parseInt(this.mainWorkspace.id),
        }
      },
    },
    sessions: {
      query: SESSION_QUERIES,
      variables() {
        return {
          workspaceId: parseInt(this.mainWorkspace.id),
        }
      },
    },
  },
  computed: {
    nowLoading() {
      return (
        this.$apollo.queries.klases.loading &&
        this.$apollo.queries.terms.loading &&
        this.$apollo.queries.sessions.loading &&
        this.$apollo.queries.sections.loading
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
    markSubmit() {
      this.timetableDropdownClass = false

      if (
        this.form.class === null ||
        this.form.term === null ||
        this.form.session === null ||
        this.form.section === null
      ) {
        return false
      } else {
        this.isBusy = true
        this.$apollo.addSmartQuery('klaseResults', {
          query: EXAM_RECORD_QUERIES,
          variables() {
            return {
              klase_id: parseInt(this.form.class),
              term_id: parseInt(this.form.term),
              session_id: parseInt(this.form.session),
              section_id: parseInt(this.form.section),
              workspaceId: parseInt(this.mainWorkspace.id),
            }
          },
          result({ loading, data }, key) {
            if (!loading) {
              this.records = data.klaseResults
            }
          },
        })

         this.$apollo.addSmartQuery('klaseResults', {
          query: EXAM_RECORD_QUERIES,
          variables() {
            return {
              klase_id: parseInt(this.form.class),
              term_id: 1,
              session_id: parseInt(this.form.session),
              section_id: parseInt(this.form.section),
              workspaceId: parseInt(this.mainWorkspace.id),
            }
          },
          result({ loading, data }, key) {
            if (!loading) {
              this.firstTermRecords = data.klaseResults
            }
          },
        })
          this.$apollo.addSmartQuery('klaseResults', {
          query: EXAM_RECORD_QUERIES,
          variables() {
            return {
              klase_id: parseInt(this.form.class),
              term_id: 2,
              session_id: parseInt(this.form.session),
              section_id: parseInt(this.form.section),
              workspaceId: parseInt(this.mainWorkspace.id),
            }
          },
          result({ loading, data }, key) {
            if (!loading) {
              this.secondTermRecords = data.klaseResults
            }
          },
        })

        this.$apollo.addSmartQuery('markSubjects', {
          query: MARK_SUBJECT_QUERIES,
          variables: {
            klase_id: parseInt(this.form.class),
            session_id: parseInt(this.form.session),
            section_id: parseInt(this.form.section),
            term_id: parseInt(this.form.term),
            workspaceId: parseInt(this.mainWorkspace.id),
          },
          result({ loading, data }, key) {
            if (!loading) {
              this.markSubjects = data.markSubjects
            }
          },
        })

        this.$apollo.addSmartQuery('markStudents', {
          query: MARK_STUDENT_QUERIES,
          variables: {
            klase_id: parseInt(this.form.class),
            session_id: parseInt(this.form.session),
            section_id: parseInt(this.form.section),
            term_id: parseInt(this.form.term),
            workspaceId: parseInt(this.mainWorkspace.id),
          },
          result({ loading, data }, key) {
            if (!loading) {
              this.studentx = data.markStudents
            }
          },
        })

        this.$apollo.addSmartQuery('marks', {
          query: MARK_QUERIES,
          variables: {
            klase_id: parseInt(this.form.class),
            session_id: parseInt(this.form.session),
            section_id: parseInt(this.form.section),
            term_id: parseInt(this.form.term),
            workspaceId: parseInt(this.mainWorkspace.id),
          },
          result({ loading, data }, key) {
            if (!loading) {
              this.marks = data.marks
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
