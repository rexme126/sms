<template>
  <div class="p-3">
    <template v-if="nowLoading"><Preload /></template>
    <template v-else>
      <b-card class="mb-2 d-flex">
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
              variant="primary"
              size="md"
              style="height: 45px; margin-top: 33px"
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

      <div class="card" v-show="timetableDropdownClass">
        <div class="card-body">
          <h3 v-if="klaseResults.length == 0" class="text-center">
            No record found
          </h3>

          <div class="roles-table" v-else>
            <div v-if="klaseResults[0].status == 'unpublished'">
              <div v-if="form.term == 1 || form.term == 2 || form.term == 3">
                <h5
                  class="d-flex justify-content-center align-items-center"
                  style="
                    height: 42px;
                    background-color: #d9530f;
                    color: #fff;
                    font-weight: bold;
                  "
                >
                  Result Not Yet Published
                </h5>
              </div>
            </div>
            <div v-else>
              <div v-if="student[1] == 1 || student[1] == 2 || student[1] == 3">
                <h4
                  class="d-flex justify-content-center align-items-center"
                  style="
                    height: 42px;
                    background-color: green;
                    color: #fff;
                    font-weight: bold;
                  "
                >
                  Result Published
                </h4>
              </div>
            </div>
            <h2
              class="p-4 d-flex justify-content-center"
              style="font-weight: bold"
            >
              Student Result Section
            </h2>
            <div class="search-input-wrap mr-3 mb-3">
              <b-form-input v-model="search" placeholder="Search..." />
              <b-icon
                style="color: #111"
                class="h5 mt-3 search-icon"
                icon="search"
              />
            </div>
            <b-table :items="klaseResultx" :fields="fields">
              <template #cell(#)="data">
                {{ data.index + 1 }}
              </template>

              <template #cell(student)="data">
                {{ data.value.first_name }} {{ data.value.last_name }}
              </template>

              <template #cell(photo)="data">
                <b-avatar
                  variant="primary"
                  :src="`${$config.APIRoot}/storage/${mainWorkspace.id}/students/${data.item.student.photo}`"
                >
                </b-avatar>
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
                <b-button
                  class="sm"
                  variant="warning"
                  style="font-weight: bold"
                  :to="{
                    name: 'workspace-admin-exam-slug',
                    params: {
                      workspace: mainWorkspace.slug,
                      slug: data.item.student.id,
                    },
                    query: {
                      student,
                      klaseResults,
                      numStudents,
                    },
                  }"
                >
                  <b-icon icon="eye" class="mr-1" />
                  View Result
                </b-button>
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import { EXAM_RECORD_QUERIES } from '~/graphql/examRecord/queries'
import { KLASE_QUERIES } from '~/graphql/klases/queries'
import { TERM_QUERIES } from '~/graphql/marks/queries'
import { SECTION_QUERIES } from '~/graphql/sections/queries'
import { SESSION_QUERIES } from '~/graphql/sessions/queries'
import Preload from '~/components/Preload.vue'

export default {
  components: { Preload },
  middleware: 'auth',
  data() {
    return {
      search: '',
      klaseResults: [],
      student: [],
      isBusy: false,
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
          key: 'photo',
          label: 'Photo.',
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
    klaseResultx() {
      return this.klaseResults.filter((t) => {
        return (
          t.student.first_name.toLowerCase().match(this.search.toLowerCase()) ||
          t.student.last_name.toLowerCase().match(this.search.toLowerCase()) ||
          t.student.adm_no.match(parseInt(this.search))
        )
      })
    },
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
        setTimeout(() => {
          this.isBusy = true
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
        }, 100)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.search-input-wrap {
  width: 270px;
  position: relative;
  display: flex;

  & .search-icon {
    position: absolute;
    right: 11px;
    top: -8px;
  }

  .form-control {
    border-radius: 30px;
    font-size: 0.85rem;
    padding: 20px 30px;
    height: 35px;
    background-color: rgba(#d9ecff, 0.5);
    // border-color: transparent;
  }
}
</style>
