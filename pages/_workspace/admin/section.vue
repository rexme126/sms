<template>
  <div class="p-3">
    <template v-if="$apollo.queries.klases.loading"><Preload /></template>
    <template v-else>
      <b-card class="mb-4 d-flex">
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
      <div
        v-show="timetableDropdownClass"
        class="p-4"
        style="background-color: #fff"
      >
        <b-card no-body>
          <div class="p-3">
            <h3 class="mb-3">All Sections</h3>
            <b-table :items="sections" :fields="fields">
              <template #cell(#)="data">
                {{ data.index + 1 }}
              </template>
              <template #cell(name)="data">
                <div v-if="sectionEditingId == data.item.id">
                  <b-row no-gutters>
                    <b-col md="4">
                      <input
                        v-model="form.names"
                        style="width: 10rem"
                        type="text"
                        required
                        size="lg"
                        @blur="updatingSection(data.value)"
                        @keydown.enter="editFiled(data.item.id)"
                      />
                    </b-col>
                  </b-row>
                </div>

                <div v-else @click="setToEditing(data.item.id)">
                  {{ data.item.name }}
                </div>
              </template>

              <template #cell(actions)="data">
                <b-button
                  variant="primary"
                  size="sm"
                  class="px-3"
                  @click="setToEditing(data.item.id)"
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

                  <b-button
                    variant="danger"
                    class="px-4"
                    @click="handleDeleteSection"
                  >
                    Delete
                  </b-button>
                </div>
              </template>
            </div>
          </b-modal>
          <!-- end -->

          <!-- Add Classes -->
          <div class="margin-down">
            <!-- description -->
            <b-form
              v-if="show"
              method="POST"
              @submit.prevent="onSubmitCreate"
              @keydown="form.onKeydown($event)"
              @reset.prevent="onReset"
            >
              <!-- description -->
              <b-row no-gutters class="px-4 mb-5">
                <b-col md="2">
                  <label
                    for="input-small"
                    class="label-padding ml-4"
                    style="font-size: 18px"
                    >Name:</label
                  >
                </b-col>

                <b-col md="4">
                  <b-form-group>
                    <b-form-input
                      v-model="form.name"
                      placeholder="Enter section"
                      type="text"
                      required
                      size="lg"
                    ></b-form-input>
                    <b-form-invalid-feedback :state="!form.errors.has('name')">
                      {{ form.errors.get('name') }}
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
                    />Add Section</b-button
                  >
                </b-col>
              </b-row>
            </b-form>
          </div>
        </b-card>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import Swal from 'sweetalert2'
import { SECTION_QUERIES, SECTION_QUERY } from '~/graphql/sections/queries'
import {
  CREATE_SECTION_MUTATION,
  DELETE_SECTION_MUTATION,
  UPDATE_SECTION_MUTATION,
} from '~/graphql/sections/mutations'
import { KLASE_QUERIES } from '~/graphql/klases/queries'
import Preload from '~/components/Preload.vue'

export default {
  components: { Preload },
  middleware: 'auth',
  data() {
    return {
      invokedForDelete: null,
      isDeleting: false,
      id: 0,
      sectionEditingId: '',
      section: {},
      isBusy: null,
      sections: [],
      form: new this.$form({
        id: 0,
        name: null,
        names: null,
        class: null,
        busy: false,
      }),
      fields: [
        {
          key: '#',
          sortable: false,
        },
        {
          key: 'name',
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
  },
  computed: {
    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
  },

  methods: {
    timetableDropdown() {
      this.isBusy = true
      this.timetableDropdownClass = false

      if (this.form.class === null) {
        return false
      } else {
        this.$apollo.addSmartQuery('sections', {
          query: SECTION_QUERIES,
          variables() {
            return {
              workspaceId: parseInt(this.mainWorkspace.id),
              klase_id: parseInt(this.form.class),
            }
          },
          result({ data, loading }) {
            if (!loading) {
              this.sections = data.sections
              this.isBusy = false
              this.timetableDropdownClass = true
            }
          },
        })
      }
    },

    // inline editing
    setToEditing(item) {
      this.sectionEditingId = item
      this.id = item

      if (this.id > 0) {
        this.$apollo.addSmartQuery('section', {
          query: SECTION_QUERY,
          variables() {
            return {
              id: parseInt(this.id),
              workspaceId: parseInt(this.mainWorkspace.id),
            }
          },
          result({ data, loading }) {
            if (!loading) {
              this.form.id = parseInt(data.section.id)
              this.form.names = data.section.name
            }
          },
        })
      }
    },
    updatingSection() {
      this.sectionEditingId = ''
    },
    // ------- edit ----//
    editFiled(item) {
      this.$apollo
        .mutate({
          mutation: UPDATE_SECTION_MUTATION,
          variables: {
            id: parseInt(item),
            name: this.form.names,
            workspaceId: parseInt(this.mainWorkspace.id),
          },
        })
        .then(() => {
          Swal.fire({
            timer: 1000,
            text: 'section updated successfully',
            position: 'top-right',
            color: '#fff',
            background: '#4bb543',
            toast: false,
            backdrop: false,
            showConfirmButton: false,
          })
          this.sectionEditingId = ''
        })
        .catch(({ graphQLErrors }) => {
          this.form.busy = false

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
    },

    // ------create --------//
    async onSubmitCreate() {
      this.form.busy = true
      // const subjectVariable = this.form.subject
      // submit exam
      try {
        await this.$apollo
          .mutate({
            mutation: CREATE_SECTION_MUTATION,
            variables: {
              name: this.form.name,
              klase_id: parseInt(this.form.class),
              workspaceId: parseInt(this.mainWorkspace.id),
            },
            update: (store, { data: { createSection } }) => {
              // Read the data from our cache for this query.
              const data = store.readQuery({
                query: SECTION_QUERIES,
                variables: {
                  workspaceId: parseInt(this.mainWorkspace.id),
                  klase_id: parseInt(this.form.class),
                },
              })

              data.sections.push(createSection)

              store.writeQuery({
                query: SECTION_QUERIES,
                variables: {
                  workspaceId: parseInt(this.mainWorkspace.id),
                  klase_id: parseInt(this.form.class),
                },
                data,
              })
            },
          })
          .then(() => {
            this.form.name = ''
            this.form.section = ''
            Swal.fire({
              text: `section added successfully!`,
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
    handleDeleteSection() {
      this.isDeleting = true
      const deleteId = this.invokedForDelete.id
      this.$apollo
        .mutate({
          mutation: DELETE_SECTION_MUTATION,
          variables: {
            id: parseInt(deleteId),
          },
          update: (store, { data: { deleteSection } }) => {
            const data = store.readQuery({
              query: SECTION_QUERIES,
              variables: {
                klase_id: parseInt(this.form.class),
                workspaceId: parseInt(this.mainWorkspace.id),
              },
            })

            const index = data.sections.findIndex((m) => m.id === deleteId)
            if (index !== -1) {
              // Mutate cache result
              data.sections.splice(index, 1)

              store.writeQuery({
                query: SECTION_QUERIES,
                variables: {
                  klase_id: parseInt(this.form.class),
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
            text: 'section deleted successfully',
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
