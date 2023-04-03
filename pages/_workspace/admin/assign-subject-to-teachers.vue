<template>
  <div class="p-3">
    <template v-if="$apollo.queries.klases.loading"><Preload /></template>
    <template v-else>
      <b-card class="mb-2 d-flex">
        <b-form @submit.prevent="timetableDropdown">
          <b-row no-gutters>
            <b-col md="3">
              <b-form-group label="Current Class:">
                <b-form-select
                  id="klase"
                  v-model="form.class"
                  value-field="id"
                  text-field="name"
                  :options="klases"
                  size="lg"
                  required
                >
                  <!-- This slot appears above the options from 'options' prop -->
                  <template #first>
                    <b-form-select-option :value="null" disabled
                      >-- select class --</b-form-select-option
                    >
                  </template>

                  <!-- These options will appear after the ones from 'options' prop -->
                </b-form-select>
              </b-form-group>
            </b-col>

            <b-col md="3" class="ml-2">
              <b-form-group label="Current Section:">
                <b-form-select
                  id="klase"
                  v-model="form.section"
                  value-field="id"
                  text-field="name"
                  :options="sections"
                  size="lg"
                  required
                >
                  <!-- This slot appears above the options from 'options' prop -->
                  <template #first>
                    <b-form-select-option :value="null" disabled
                      >-- select section --</b-form-select-option
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
              style="height: 47px; margin-top: 32px"
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
        <b-card no-body>
          <b-tabs card>
            <b-tab active v-if="assignSubjectToTeachers.length > 0">
              <template #title>
                <strong>Assign Teachers</strong>
                <b-icon scale="0.8" icon="plus" />
              </template>

              <h4 class="text-center py-3">Assign Subjects To Teachers</h4>

              <div class="search-input-wrap mr-3 mb-2">
                <b-form-input v-model="search" placeholder="Search..." /><b-icon
                  style="color: #111"
                  class="h5 mt-3 search-icon"
                  icon="search"
                />
              </div>

              <b-table
                hover
                bordered
                head-variant="light"
                caption-top
                no-border-collapse
                :responsive="true"
                :items="searchFilter"
                :fields="fields"
              >
                <template #cell(index)="data">
                  {{ data.index + 1 }}
                </template>
                <template #cell(klase)="data">
                  {{ data.item.klase.name }}
                </template>
                <template #cell(section)="data">
                  {{ data.item.section.name }}
                </template>
                <template #cell(subject)="data">
                  <span style="color: red; font-weight: bold">{{
                    data.item.subject.subject
                  }}</span>
                </template>
                <template #cell(teacher)="data">
                  <span style="color: blue; font-weight: bold"
                    >{{ data.item.teacher.last_name }}
                    {{ data.item.teacher.first_name }}</span
                  >
                </template>
                <template #cell(action)="data">
                  <div class="d-flex justify-content">
                    <b-button
                      variant="primary"
                      size="md"
                      @click="assignSubjectEdit(data.item)"
                      >Edit</b-button
                    >

                    <b-button
                      variant="danger"
                      size="md"
                      class="ml-2"
                      @click="handleDeleteAssignSubject(data.item)"
                    >
                      Delete</b-button
                    >
                  </div>
                </template>
              </b-table>

              <!-- Info modal -->
              <AdminEditAssignSubjectToTeacherModal
                v-if="invokedForEdit"
                v-model="isEditAssignSubjectToTeacherdModal"
                :assignToTeacher="invokedForEdit"
              />

              <!-- end modal -->
            </b-tab>
            <b-card v-else>
              <h3 class="text-center p-4">No record found</h3>
            </b-card>

            <b-tab>
              <template #title>
                <strong>Create Assign Teacher</strong>
                <b-icon scale="0.8" icon="caret-down-fill" />
              </template>
              <div class="mt-4 ml-5">
                <b-form
                  method="POST"
                  @submit.prevent="assignSubjectToTeacher"
                  @keydown="form.onKeydown($event)"
                >
                  <b-row class="mb-4">
                    <b-col md="4">
                      <b-form-group label="Subjects">
                        <b-form-select
                          id="subjects"
                          v-model="form.subjectId"
                          style="height: 18rem"
                          value-field="id"
                          text-field="subject"
                          :options="subjects"
                          multiple
                          required
                          class="mb-3"
                          size="lg"
                        >
                        </b-form-select>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Assign Teacher">
                        <b-form-select v-model="form.teacherId" class="mb-3">
                          <b-form-select-option
                            v-for="teacher in teachers"
                            :key="teacher.id"
                            :value="teacher.id"
                            >{{ teacher.last_name }} {{ teacher.first_name }}
                          </b-form-select-option>

                          <template #first>
                            <b-form-select-option :value="null" disabled
                              >-- select teacher--</b-form-select-option
                            >
                          </template>
                        </b-form-select>
                      </b-form-group>
                    </b-col>
                  </b-row>

                  <b-row>
                    <b-col
                      md="10"
                      class="d-flex justify-content-center p-4 mt-2 mb-4"
                      ><b-button
                        type="submit"
                        variant="primary"
                        class="mr-4"
                        :disabled="form.busy"
                        size="md"
                      >
                        <b-spinner
                          v-if="form.busy"
                          variant="light"
                          class="mr-1 mb-1"
                          small
                        />Submit</b-button
                      >
                    </b-col>
                  </b-row>
                </b-form>
              </div>
            </b-tab>
          </b-tabs>
        </b-card>

        <!-- delete modal -->
        <b-modal id="DeleteModal" centered hide-header hide-footer>
          <div class="p-5 text-center">
            <Spinner v-if="isDeleting" size="4" />
            <template v-else>
              <h5>Confirm delete?</h5>

              <p>This action cannot be undone.</p>

              <div>
                <b-button
                  variant="light"
                  class="px-4 mr-2 border"
                  @click="handleCancelDelete"
                >
                  Cancel
                </b-button>

                <b-button
                  variant="danger"
                  class="px-4"
                  @click="deleteInvokedAssignToTeacher"
                >
                  Delete
                </b-button>
              </div>
            </template>
          </div>
        </b-modal>
        <!-- end -->
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import { KLASE_QUERIES } from '~/graphql/klases/queries'

import Swal from 'sweetalert2'
import { SECTION_QUERIES } from '~/graphql/sections/queries'
import Preload from '~/components/Preload.vue'
import AdminEditAssignSubjectToTeacherModal from '~/components/AdminEdit/AssignSubjectToTeacherModal'
import {
  ASSIGN_SUBJECT_TO_TEACHER_QUERIES,
  TEACHERS_QUERIES,
} from '~/graphql/teachers/queries'
import { SUBJECT_QUERIES } from '~/graphql/subjects/queries'
import {
  CREATE_ASSIGN_SUBJECT_TO_TEACHER_MUTATION,
  DELETE_ASSIGN_SUBJECT_TO_TEACHER_MUTATION,
} from '~/graphql/teachers/mutations'

export default {
  components: { Preload, AdminEditAssignSubjectToTeacherModal },
  middleware: 'auth',
  data() {
    return {
      value: null,
      isBusy: false,
      search: '',
      isEditAssignSubjectToTeacherdModal: false,
      invokedForEdit: null,
      assignSubjectToTeachers: [],
      subjects: [],
      klases: [],
      infoModal: 'modelInfo',
      slug: '',
      timetableDropdownClass: false,
      id: 0,
      klaseName: '',
      show: true,
      form: new this.$form({
        class: null,
        section: null,
        teacherId: null,
        subjectId: [],
        busy: false,
      }),
      fields: [
        { key: 'index', label: 'S/N' },
        { key: 'klase', label: 'Class' },
        { key: 'section', label: 'Section' },
        { key: 'subject', label: 'Subject' },
        { key: 'teacher', label: "Teacher's Name" },
        { key: 'action', label: 'Action' },
      ],
      invokedForDelete: null,
      isDeleting: false,
      dynamicClass: '',

      activeTab: '',
      registerMenu: false,
      registrationMenuClass: '',
      timetableDropdownClass: false,
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
    sections: {
      query: SECTION_QUERIES,
      variables() {
        return {
          workspaceId: parseInt(this.mainWorkspace.id),
          klase_id: parseInt(this.form.class),
        }
      },
    },

    teachers: {
      query: TEACHERS_QUERIES,
      variables() {
        return {
          workspaceId: parseInt(this.mainWorkspace.id),
        }
      },
    },
  },
  computed: {
    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
    searchFilter() {
      return this.assignSubjectToTeachers.filter((t) => {
        return (
          t.teacher.first_name.toLowerCase().match(this.search.toLowerCase()) ||
          t.teacher.last_name.toLowerCase().match(this.search.toLowerCase()) ||
          t.subject.subject.toLowerCase().match(this.search.toLowerCase())
        )
      })
    },
  },

  methods: {
    // modal
    assignSubjectEdit(item) {
      this.invokedForEdit = item
      this.isEditAssignSubjectToTeacherdModal = true
    },
    // end modal
    timetableDropdown() {
      this.isBusy = true
      this.timetableDropdownClass = false
      this.$apollo.addSmartQuery('assignSubjectToTeachers', {
        query: ASSIGN_SUBJECT_TO_TEACHER_QUERIES,
        variables() {
          return {
            klaseId: parseInt(this.form.class),
            sectionId: parseInt(this.form.section),
            workspaceId: parseInt(this.mainWorkspace.id),
          }
        },
        result({ data, loading }) {
          if (!loading) {
            this.assignSubjectToTeachers = data.assignSubjectToTeachers
          }
        },
      })

      this.$apollo.addSmartQuery('subjects', {
        query: SUBJECT_QUERIES,
        variables() {
          return {
            workspaceId: parseInt(this.mainWorkspace.id),
            klase_id: parseInt(this.form.class),
            section_id: parseInt(this.form.section),
          }
        },
        result({ data, loading }) {
          if (!loading) {
            this.subjects = data.subjects
            this.isBusy = false
            this.timetableDropdownClass = true
          }
        },
      })
    },

    // -------- create mutation -------------- //
    assignSubjectToTeacher() {
      if (this.form.class === null || this.form.section === null) {
      } else {
        this.form.busy = true
        this.$apollo
          .mutate({
            mutation: CREATE_ASSIGN_SUBJECT_TO_TEACHER_MUTATION,
            variables: {
              teacherId: parseInt(this.form.teacherId),
              subjectId: this.form.subjectId,
              klaseId: parseInt(this.form.class),
              sectionId: parseInt(this.form.section),
              workspaceId: parseInt(this.mainWorkspace.id),
            },
            update: (store, { data: { createSubjectToTeacher } }) => {
              // Read the data from our cache for this query.
              const data = store.readQuery({
                query: ASSIGN_SUBJECT_TO_TEACHER_QUERIES,
                variables: {
                  klaseId: parseInt(this.form.class),
                  sectionId: parseInt(this.form.section),
                  workspaceId: parseInt(this.mainWorkspace.id),
                },
              })

              data.assignSubjectToTeachers.push(createSubjectToTeacher)
              store.writeQuery({
                query: ASSIGN_SUBJECT_TO_TEACHER_QUERIES,
                variables: {
                  klaseId: parseInt(this.form.class),
                  sectionId: parseInt(this.form.section),
                  workspaceId: parseInt(this.mainWorkspace.id),
                },
                data,
              })
            },
          })
          .then(() => {
            this.form.busy = false

            this.form.teacherId = null
            this.form.subjectId = []

            Swal.fire({
              timer: 1500,
              text: 'field added successfully',
              position: 'top-right',
              color: '#fff',
              background: '#4bb543',
              toast: false,
              backdrop: false,
              showConfirmButton: false,
            })
          })
          .catch(() => {
            Swal.fire({
              icon: 'warning',
              text: `There's error proccessing this page!`,
              position: 'top-right',
              color: '#fff',
              background: '#cc3300',
              toast: false,
              backdrop: false,
              timer: 1500,
              showConfirmButton: false,
            })
          })
      }
    },
    // -------- end mutation -------------- //

    // -------- delete mutation -------------- //
    handleCancelDelete() {
      this.invokedForDelete = null

      this.$bvModal.hide('DeleteModal')
    },

    handleDeleteAssignSubject(item) {
      this.invokedForDelete = item

      this.$bvModal.show('DeleteModal')
    },

    // -------- delete mutation -------------- //

    deleteInvokedAssignToTeacher() {
      this.isDeleting = true
      const klaseId = this.form.class
      const deleteId = this.invokedForDelete.id
      this.$apollo
        .mutate({
          mutation: DELETE_ASSIGN_SUBJECT_TO_TEACHER_MUTATION,
          variables: {
            id: parseInt(deleteId),
          },
          update: (store, { data: { deleteSubjectToTeacher } }) => {
            const data = store.readQuery({
              query: ASSIGN_SUBJECT_TO_TEACHER_QUERIES,
              variables: {
                klaseId: parseInt(klaseId),
                sectionId: parseInt(this.form.section),
                workspaceId: parseInt(this.mainWorkspace.id),
              },
            })

            const index = data.assignSubjectToTeachers.findIndex(
              (m) => m.id === deleteId
            )
            if (index !== -1) {
              // Mutate cache result
              data.assignSubjectToTeachers.splice(index, 1)

              store.writeQuery({
                query: ASSIGN_SUBJECT_TO_TEACHER_QUERIES,
                variables: {
                  klaseId: parseInt(klaseId),
                  sectionId: parseInt(this.form.section),
                  workspaceId: parseInt(this.mainWorkspace.id),
                },
                data,
              })
            }
          },
        })
        .then(() => {
          Swal.fire({
            timer: 1000,
            text: 'timetable deleted successfully',
            position: 'top-right',
            color: '#fff',
            background: '#4bb543',
            toast: false,
            backdrop: false,
            showConfirmButton: false,
          })
        })
        .catch(() => {
          Swal.fire({
            icon: 'warning',
            text: `There's error proccessing this page!`,
            position: 'top-right',
            color: '#fff',
            background: '#cc3300',
            toast: false,
            backdrop: false,
            timer: 1500,
            showConfirmButton: false,
          })
        })
        .finally(() => {
          this.$bvModal.hide('DeleteModal')

          this.isDeleting = false
        })
    },
    // -------- end mutation -------------- //
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
    height: 25px;
    background-color: rgba(#d9ecff, 0.5);
    // border-color: transparent;
  }
}
</style>
