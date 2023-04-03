<template>
  <div class="p-3">
    <template v-if="nowLoading"><Preload /></template>
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
              style="height: 45px; margin-top: 32px"
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

      <!--  -->
      <b-card v-show="timetableDropdownClass" class="p-4">
        <div class="p-3">
          <h4 class="mb-3">All Classes</h4>
          <b-table :items="subjects" :fields="fields">
            <template #cell(#)="data">
              {{ data.index + 1 }}
            </template>

            <template #cell(actions)="data">
              <b-button
                variant="primary"
                size="sm"
                class="px-3"
                @click="handleEditing(data.item)"
              >
                <b-icon icon="pencil" class="mr-1"> </b-icon>
                Edit
              </b-button>

              <b-button
                variant="danger"
                size="sm"
                class="px-3"
                @click="handleDeleteSubject(data.item)"
              >
                <b-icon icon="trash" class="mr-1"> </b-icon>
                Delete
              </b-button>
            </template>
          </b-table>
        </div>

        <!-- Info modal -->
        <AdminEditSubjectModal
          v-if="invokedForEdit"
          v-model="isEditSubjectModal"
          :subject="invokedForEdit"
        />

        <!-- end modal -->

        <!-- delete modal -->
        <b-modal id="DeleteModal" centered hide-header hide-footer>
          <div class="p-5 text-center">
            <Spinner v-if="isDeleting" size="4" />
            <template v-else>
              <h5>Confirm delete subject?</h5>

              <p>This action cannot be undone.</p>

              <div>
                <b-button
                  variant="light"
                  class="px-4 mr-2 border"
                  @click="handleCancelDelete"
                >
                  Cancel
                </b-button>

                <b-button variant="danger" class="px-4" @click="deleteSubject">
                  Delete
                </b-button>
              </div>
            </template>
          </div>
        </b-modal>
        <!-- end -->

        <!-- Add Classes -->
        <div class="p-4">
          <!-- description -->
          <b-form
            method="POST"
            @submit.prevent="onSubmitCreate"
            @keydown="form.onKeydown($event)"
            @reset.prevent="onReset"
          >
            <!-- description -->
            <b-row>
              <b-col md="1">
                <label
                  for="input-small"
                  class="label-padding"
                  style="font-size: 18px"
                  >Subject:</label
                >
              </b-col>

              <b-col md="4">
                <b-form-group>
                  <b-form-input
                    v-model="form.subject"
                    placeholder="Enter subject"
                    type="text"
                    required
                    size="md"
                  ></b-form-input>
                  <b-form-invalid-feedback :state="!form.errors.has('subject')">
                    {{ form.errors.get('subject') }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-row>

            <b-row>
              <b-col md="1">
                <label
                  for="input-small"
                  class="label-padding"
                  style="font-size: 18px"
                  >Subject Code:</label
                >
              </b-col>
              <b-col md="4">
                <b-form-group>
                  <b-form-input
                    v-model="form.subject_code"
                    placeholder="Enter subject code"
                    type="text"
                    required
                    size="md"
                  ></b-form-input>
                  <b-form-invalid-feedback
                    :state="!form.errors.has('subject_code')"
                  >
                    {{ form.errors.get('subject_code') }}
                  </b-form-invalid-feedback>
                </b-form-group>

                <b-button
                  type="submit"
                  variant="primary"
                  class="mr-4"
                  size="md"
                  :disabled="form.busy"
                >
                  <b-spinner
                    v-if="form.busy"
                    variant="light"
                    class="mr-1 mb-1"
                    small
                  />Add Subject</b-button
                >
              </b-col>
            </b-row>
          </b-form>
        </div>
      </b-card>
    </template>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import Swal from 'sweetalert2'
import { SUBJECT_QUERIES } from '@/graphql/subjects/queries'
import {
  CREATE_SUBJECT_MUTATION,
  DELETE_SUBJECT_MUTATION,
} from '@/graphql/subjects/mutations'
import { KLASE_QUERIES } from '~/graphql/klases/queries'
import { SECTION_QUERIES } from '~/graphql/sections/queries'
import Preload from '~/components/Preload.vue'
import AdminEditSubjectModal from '~/components/AdminEdit/SubjectModal.vue'

export default {
  components: { Preload, AdminEditSubjectModal },
  middleware: 'auth',
  data() {
    return {
      invokedForEdit: null,
      isEditSubjectModal: false,
      isBusy: false,
      loading: false,
      invokedForDelete: null,
      isDeleting: false,
      subjects: [],
      busy: false,
      form: new this.$form({
        class: null,
        section: null,
        klase: null,
        subject: null,
        subject_code: null,
        busy: false,
      }),
      fields: [
        {
          key: '#',
          sortable: false,
        },
        {
          key: 'subject',
          sortable: false,
        },
        {
          key: 'subject_code',
          label: 'Subject Code',
          sortable: false,
        },
        {
          key: 'actions',
          sortable: false,
        },
      ],
      show: true,
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
  },
  computed: {
    nowLoading() {
      return this.$apollo.queries.klases.loading
    },
    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
  },

  methods: {
    timetableDropdown() {
      this.isBusy = true
      this.timetableDropdownClass = false

      if (this.form.class === null && this.form.section === null) {
        return false
      } else {
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
      }
    },

    // inline editing
    handleEditing(item) {
      this.invokedForEdit = item
      this.isEditSubjectModal = true
    },

    // ------create --------//
    async onSubmitCreate() {
      this.form.busy = true
      // const subjectVariable = this.form.subject
      // submit exam
      try {
        await this.$apollo
          .mutate({
            mutation: CREATE_SUBJECT_MUTATION,
            variables: {
              subject: this.form.subject,
              subject_code: this.form.subject_code.toUpperCase(),
              workspaceId: parseInt(this.mainWorkspace.id),
              klase_id: parseInt(this.form.class),
              section_id: parseInt(this.form.section),
            },
            update: (store, { data: { createSubject } }) => {
              // Read the data from our cache for this query.
              const data = store.readQuery({
                query: SUBJECT_QUERIES,
                variables: {
                  workspaceId: parseInt(this.mainWorkspace.id),
                  klase_id: parseInt(this.form.class),
                  section_id: parseInt(this.form.section),
                },
              })

              data.subjects.push(createSubject)

              store.writeQuery({
                query: SUBJECT_QUERIES,
                variables: {
                  workspaceId: parseInt(this.mainWorkspace.id),
                  klase_id: parseInt(this.form.class),
                  section_id: parseInt(this.form.section),
                },
                data,
              })
            },
          })
          .then(() => {
            this.form.subject = ''
            this.form.subject_code = ''
            Swal.fire({
              text: `subject added successfully!`,
              position: 'top-right',
              color: '#fff',
              background: '#5cb85c',
              toast: false,
              backdrop: false,
              timer: 1500,
              showConfirmButton: false,
            })
          })

        this.form.busy = false
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
    },
    // -------- delete mutation -------------- //
    handleCancelDelete() {
      this.invokedForDelete = null

      this.$bvModal.hide('DeleteModal')
    },

    handleDeleteSubject(item) {
      this.invokedForDelete = item

      this.$bvModal.show('DeleteModal')
    },
    // ------delete ----------/
    deleteSubject() {
      this.isDeleting = true
      const deleteId = this.invokedForDelete.id
      this.$apollo
        .mutate({
          mutation: DELETE_SUBJECT_MUTATION,
          variables: {
            id: parseInt(deleteId),
          },
          update: (store, { data: { deleteSubject } }) => {
            const data = store.readQuery({
              query: SUBJECT_QUERIES,
              variables: {
                workspaceId: parseInt(this.mainWorkspace.id),
                klase_id: parseInt(this.form.class),
                section_id: parseInt(this.form.section),
              },
            })

            const index = data.subjects.findIndex((m) => m.id === deleteId)
            if (index !== -1) {
              // Mutate cache result
              data.subjects.splice(index, 1)

              store.writeQuery({
                query: SUBJECT_QUERIES,
                variables: {
                  workspaceId: parseInt(this.mainWorkspace.id),
                  klase_id: parseInt(this.form.class),
                  section_id: parseInt(this.form.section),
                },
                data,
              })
            }
          },
        })
        .then(() => {
          Swal.fire({
            timer: 1000,
            text: 'subject deleted successfully',
            position: 'top-right',
            color: '#fff',
            background: '#4bb543',
            toast: false,
            backdrop: false,
            showConfirmButton: false,
          })
          this.isDeleting = false
        })
        .catch(() => {})
        .finally(() => {
          this.$bvModal.hide('DeleteModal')

          this.isDeleting = false
        })
    },
  },
}
</script>
