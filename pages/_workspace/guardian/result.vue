<template>
  <div class="p-3">
    <template v-if="nowloading"><Preload /></template>
    <template v-else>
      <b-card class="mb-2 d-flex">
        <b-form @submit.prevent="studentResultQuery">
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
              <b-form-group label="Sessions">
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

            <b-col md="2">
              <div v-if="!user.guardian">
                <b-form-group label="Select Student">
                  <b-form-select class="mb-3">
                    <b-form-select-option value="null"> </b-form-select-option>
                  </b-form-select>
                </b-form-group>
              </div>

              <div v-else>
                <b-form-group label="Select Student">
                  <b-form-select v-model="form.student_id" class="mb-3">
                    <b-form-select-option
                      v-for="student in user.guardian.students"
                      :key="student.id"
                      :value="[student.id, student.section.id]"
                      >{{ student.last_name }} {{ student.first_name }}
                    </b-form-select-option>

                    <!-- This slot appears above the options from 'options' prop -->
                    <template #first>
                      <b-form-select-option :value="null" disabled
                        >-- select student--</b-form-select-option
                      >
                    </template>
                  </b-form-select>
                </b-form-group>
              </div>
            </b-col>

            <b-button
              type="submit"
              variant="primary"
              size="md"
              style="height: 46px; margin-top: 33px"
              :disabled="isBusy"
              ><b-spinner
                v-if="isBusy"
                variant="light"
                class="mr-1 mb-1"
                small
              />
              Submit</b-button
            >
          </b-row>
        </b-form>
      </b-card>

      <div v-show="timetableDropdownClass">
        <ExamSingleStudentResult
          v-if="studentExamResult"
          :student-exam-result="studentExamResult"
          :student-mark-result="studentMarkResult"
          :student="[
            form.class,
            form.term,
            form.session,
            form.student_id,
            numStudents,
          ]"
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
  STUDENT_EXAM_RESULT_QUERIES,
} from '~/graphql/examRecord/queries'
import { USER_GUARDIAN_QUERY } from '~/graphql/guardians/queries'
import { KLASE_QUERIES } from '~/graphql/klases/queries'
import {
  STUDENT_MARK_RESULT_QUERIES,
  TERM_QUERIES,
} from '~/graphql/marks/queries'
import { SESSION_QUERIES } from '~/graphql/sessions/queries'
import ExamSingleStudentResult from '~/components/Exam/SingleStudentResult.vue'
import Preload from '~/components/Preload.vue'

export default {
  components: { ExamSingleStudentResult, Preload },
  middleware: 'auth',
  data() {
    return {
      k: null,
      klaseResults: [],
      numStudents: null,
      studentExamResult: null,
      studentMarkResult: [],
      user: [],
      isBusy: false,
      timetableDropdownClass: false,
      form: {
        class: null,
        session: null,
        section: null,
        term: null,
        student_id: [],
      },

      dynamicClass: '',
      activeTab: '',
      registerMenu: false,
      registrationMenuClass: '',
    }
  },
  computed: {
    nowloading() {
      return (
        this.$apollo.queries.user.loading &&
        this.$apollo.queries.klases.loading &&
        this.$apollo.queries.terms.loading &&
        this.$apollo.queries.sessions.loading
      )
    },

    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
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
    sessions: {
      query: SESSION_QUERIES,
      variables() {
        return {
          workspaceId: parseInt(this.mainWorkspace.id),
        }
      },
    },
    user: {
      query: USER_GUARDIAN_QUERY,
      variables() {
        return {
          id: parseInt(this.$auth.user.id),
        }
      },
    },
  },
  methods: {
    dynamicStudentClass(item) {
      this.dynamicClass = item
    },
    studentResultQuery() {
      if (
        this.form.class === null ||
        this.form.term === null ||
        this.form.session === null
      ) {
        return
      } else {
        this.isBusy = true
        this.timetableDropdownClass = false

        this.$apollo.addSmartQuery('studentExamResult', {
          query: STUDENT_EXAM_RESULT_QUERIES,
          variables() {
            return {
              klase_id: parseInt(this.form.class),
              student_id: parseInt(this.form.student_id[0]),
              term_id: parseInt(this.form.term),
              session_id: parseInt(this.form.session),
              section_id: parseInt(this.form.student_id[1]),
              status: 'published',
              workspaceId: parseInt(this.mainWorkspace.id),
            }
          },
          result({ loading, data }, key) {
            if (!loading) {
              this.studentExamResult = data.studentExamResult
              this.klaseResults = data.studentExamResult
            }
          },
        })

        this.$apollo.addSmartQuery('studentMarkResult', {
          query: STUDENT_MARK_RESULT_QUERIES,
          variables() {
            return {
              klase_id: parseInt(this.form.class),
              student_id: parseInt(this.form.student_id[0]),
              term_id: parseInt(this.form.term),
              section_id: parseInt(this.form.student_id[1]),
              session_id: parseInt(this.form.session),
              status: 'published',
              workspaceId: parseInt(this.mainWorkspace.id),
            }
          },

          result({ loading, data }, key) {
            if (!loading) {
              this.studentMarkResult = data.studentMarkResult
            }
          },
        })

        this.$apollo.addSmartQuery('klaseResults', {
          query: EXAM_RECORD_QUERIES,
          variables() {
            return {
              klase_id: parseInt(this.form.class),
              term_id: parseInt(this.form.term),
              session_id: parseInt(this.form.session),
              workspaceId: parseInt(this.mainWorkspace.id),
            }
          },
          result({ loading, data }, key) {
            if (!loading) {
              this.klaseResults = data.klaseResults

              const numStudents = Object.keys(this.klaseResults).length
              this.numStudents = numStudents
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
