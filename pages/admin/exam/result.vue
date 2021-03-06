<template>
  <div class="p-4 view-payment">
    <template v-if="nowLoading"><Preload /></template>
    <template v-else>
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
              <b-form-group label="Sections">
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
            <b-button
              type="submit"
              variant="danger"
              size="lg"
              style="height: 3.85rem; margin-top: 2.85rem"
              >Submit</b-button
            >
          </b-row>
        </b-form>
      </b-card>

      <div class="card" v-show="timetableDropdownClass">
        <div class="card-body">
          <div class="p-3 roles-table">
            <h2
              class="p-4 d-flex justify-content-center"
              style="font-weight: bold"
            >
              Student Result Section
            </h2>
            <b-table :items="klaseResults" :fields="fields">
              <template #cell(#)="data">
                {{ data.index + 1 }}
              </template>

              <template #cell(student)="data">
                {{ data.value.first_name }} {{ data.value.last_name }}
              </template>

              <template #cell(adm_no)="data">
                {{ data.item.student.adm_no }}
              </template>

              <template #cell(term)="data">
                {{ data.item.term.name }}
              </template>

              <template #cell(session)="data">
                {{ data.item.session.name }}
              </template>

              <template #cell(klase)="data">
                {{ data.item.klase.name }}
              </template>

              <template #cell(actions)="data">
                <router-link
                  variant="primary"
                  :to="{
                    name: 'admin-exam-slug',
                    params: { slug: data.item.student.id },
                    query: {
                      student,
                      klaseResults,
                      numStudents,
                    },
                  }"
                >
                  <b-icon icon="eye" class="mr-1"></b-icon>
                  View Result
                </router-link>
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { EXAM_RECORD_QUERIES } from '~/graphql/examRecord/queries'
import { KLASES_QUERIES } from '~/graphql/klases/queries'
import { SESSION_QUERIES, TERM_QUERIES } from '~/graphql/marks/queries'
import { SECTION_QUERIES } from '~/graphql/sections/queries'
export default {
  middleware: 'auth',
  data() {
    return {
      klaseResults: [],
      student: [],
      numStudents: null,
      timetableDropdownClass: false,
      form: {
        class: null,
        section: null,
        session: null,
        term: null,
      },

      dynamicClass: '',
      activeTab: '',
      registerMenu: false,
      registrationMenuClass: '',
      fields: [
        {
          key: '#',
          sortable: false,
        },
        {
          key: 'student',
          label: 'Full Name',
          sortable: false,
        },
        {
          key: 'adm_no',
          label: 'Adm_no.',
        },
        {
          key: 'klase',
          label: 'Class',
        },
        {
          key: 'term',
          label: 'Term.',
        },
        {
          key: 'session',
          label: 'Session.',
        },

        {
          key: '',
          sortable: false,
        },
        {
          key: 'actions',
          label: 'Actions',
          sortable: false,
        },
      ],
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
        this.student = [
          this.form.class,
          this.form.term,
          this.form.session,
          this.form.section,
        ]
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
              this.klaseResults = data.klaseResults

              const numStudents = Object.keys(this.klaseResults).length
              this.numStudents = numStudents
            }
          },
        })
      }, 100)
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
