<template>
  <div class="p-4 view-payment">
    <template v-if="nowLoading"><Preload /></template>
    <template v-else>
      <b-card class="p-3 mb-4 d-flex">
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
              variant="danger"
              size="lg"
              style="height: 3.8rem; margin-top: 2.8rem"
              >Submit</b-button
            >
          </b-row>
        </b-form>
      </b-card>

      <div v-show="timetableDropdownClass" class="libarian__wrapper">
        <ExamTabulation
          :records="records"
          :exam-records="examRecords"
          :first-term="firstTerm"
          :secound-term="secoundTerm"
          :third-term="thirdTerm"
          :student="[form.class, form.term, form.session, form.section]"
        />
      </div>
    </template>
  </div>
</template>

<script>
import {
  EXAM_RECORDS_QUERIES,
  EXAM_RECORD_QUERIES,
  FIRST_TERM_QUERIES,
  PUBLISH_RESULT_QUERY,
  SECOUND_TERM_QUERIES,
  THIRD_TERM_QUERIES,
} from '~/graphql/examRecord/queries'
import { KLASES_QUERIES } from '~/graphql/klases/queries'
import { SESSION_QUERIES, TERM_QUERIES } from '~/graphql/marks/queries'
import { SECTION_QUERIES } from '~/graphql/sections/queries'
export default {
  middleware: 'auth',
  data() {
    return {
      records: [],
      klaseResults: [],
      examRecords: [],
      firstTerm: [],
      secoundTerm: [],
      thirdTerm: [],
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
    }
  },
  apollo: {
    klases: {
      query: KLASES_QUERIES,
    },

    terms: {
      query: TERM_QUERIES,
    },
    sections: {
      query: SECTION_QUERIES,
    },
    sessions: {
      query: SESSION_QUERIES,
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
  },
  methods: {
    dynamicStudentClass(item) {
      this.dynamicClass = item
    },
    markSubmit() {
      if (
        this.form.class === null ||
        this.form.term === null ||
        this.form.session === null ||
        this.form.section === null
      ) {
        return false
      } else {
        this.timetableDropdownClass = true
      }

      setTimeout(() => {
        this.$apollo.addSmartQuery('klaseResults', {
          query: EXAM_RECORD_QUERIES,
          variables() {
            return {
              klase_id: parseInt(this.form.class),
              term_id: parseInt(this.form.term),
              session_id: parseInt(this.form.session),
              section_id: parseInt(this.form.section),
            }
          },
          result({ loading, data }, key) {
            if (!loading) {
              this.records = data.klaseResults
            }
          },
        })
      }, 100)
      setTimeout(() => {
        this.$apollo.addSmartQuery('examRecords', {
          query: EXAM_RECORDS_QUERIES,
          variables() {
            return {
              klase_id: parseInt(this.form.class),
              session_id: parseInt(this.form.term),
              section_id: parseInt(this.form.section),
            }
          },
          result({ loading, data }, key) {
            if (!loading) {
              this.examRecords = data.examRecords
            }
          },
        })
      }, 100)

      setTimeout(() => {
        this.$apollo.addSmartQuery('firstTerm', {
          query: FIRST_TERM_QUERIES,
          variables() {
            return {
              klase_id: parseInt(this.form.class),
              term_id: 1,
              session_id: parseInt(this.form.session),
              section_id: parseInt(this.form.section),
            }
          },
          result({ loading, data }, key) {
            if (!loading) {
              this.firstTerm = data.firstTerm
            }
          },
        })
      }, 101)
      setTimeout(() => {
        this.$apollo.addSmartQuery('secoundTerm', {
          query: SECOUND_TERM_QUERIES,
          variables() {
            return {
              klase_id: parseInt(this.form.class),
              term_id: 2,
              session_id: parseInt(this.form.session),
              section_id: parseInt(this.form.section),
            }
          },
          result({ loading, data }, key) {
            if (!loading) {
              this.secoundTerm = data.secoundTerm
            }
          },
        })
      }, 101)

      setTimeout(() => {
        this.$apollo.addSmartQuery('thirdTerm', {
          query: THIRD_TERM_QUERIES,
          variables() {
            return {
              klase_id: parseInt(this.form.class),
              term_id: 3,
              session_id: parseInt(this.form.session),
              section_id: parseInt(this.form.section),
            }
          },
          result({ loading, data }, key) {
            if (!loading) {
              this.thirdTerm = data.thirdTerm
            }
          },
        })
      }, 101)
    },
  },
}
</script>

<style lang="scss">
.view-payment {
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

  .libarian__wrapper {
    padding: 2rem;
    font-size: 1.4rem;
    background-color: var(--color-white);
    border-radius: 0.5rem;
    border: none;

    .nav-link.active {
      border-top: 5px solid limegreen;
    }

    .menu {
      ul {
        z-index: 999;
        position: absolute;
        border: none;
        top: -3.5rem;
        left: 14.2rem;
        background-color: #fff;
      }

      li:not(:last-child) {
        background-color: #fff;
        padding: 1rem 4.8rem;
        border-bottom: 1px solid gray;
        cursor: pointer;

        &:hover {
          background-color: var(--color-input);
        }
      }
    }
  }
}
</style>
