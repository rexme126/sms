<template>
  <div class="p-3">
    <div v-if="nowLoading">
      <Preload />
    </div>
    <div v-else>
      <b-card>
        <div class="p-4">
          <h4 class="text-center mb-4">All Classes</h4>

          <b-table :items="klases" :fields="fields">
            <template #cell(#)="data">
              {{ data.index + 1 }}
            </template>

            <template #cell(name)="data">
              <div v-if="klaseEditingId == data.item.id">
                <b-row no-gutters>
                  <b-col md="4">
                    <input
                      v-model="form.names"
                      type="text"
                      required
                      size="lg"
                      @blur="updatingKlase(data.value)"
                      @keydown.enter="editFiled(data.item.id)"
                    />
                  </b-col>
                </b-row>
              </div>

              <div v-else @click="setToEditing(data.item.id)">
                {{ data.value }}
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
                @click="handleDeleteCLass(data.item)"
              >
                <b-icon icon="trash" class="mr-1"> </b-icon>
                Delete
              </b-button>
            </template>
          </b-table>
        </div>

        <!-- Info modal -->
        <!-- delete modal -->
        <b-modal id="DeleteModal" centered hide-header hide-footer>
          <div class="p-5 text-center">
            <Spinner v-if="isDeleting" size="4" />
            <template v-else>
              <h5>Confirm delete class?</h5>

              <p>This action cannot be undone.</p>

              <div>
                <b-button
                  variant="light"
                  class="px-4 mr-2 border"
                  @click="handleCancelDelete"
                >
                  Cancel
                </b-button>

                <b-button variant="danger" class="px-4" @click="setToDelete">
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
            method="POST"
            @submit.prevent="onSubmitCreate"
            @keydown="form.onKeydown($event)"
          >
            <!-- description -->

            <b-row no-gutters class="px-4 mb-5">
              <b-col md="2">
                <label
                  for="input-small"
                  class="label-padding"
                  style="font-size: 18px"
                  >Name:</label
                >
              </b-col>

              <b-col md="3">
                <b-form-group>
                  <b-form-input
                    id="name"
                    v-model="form.name"
                    name="name"
                    placeholder="Enter class"
                    trim
                    type="text"
                    required
                    size="lg"
                  >
                  </b-form-input>
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
                  />Add Class</b-button
                >
              </b-col>
            </b-row>
          </b-form>
        </div>
        <!-- end -->
      </b-card>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import Swal from 'sweetalert2'
import { KLASE_QUERIES, KLASE_QUERY } from '~/graphql/klases/queries'
import {
  CREATE_KLASE_MUTATION,
  DELETE_KLASE_MUTATION,
  UPDATE_KLASE_MUTATION,
} from '@/graphql/klases/mutations'
import Preload from '~/components/Preload.vue'

export default {
  components: { Preload },
  middleware: 'auth',
  data() {
    return {
      id: 0,
      isBusy: false,
      isDeleting: false,
      invokedForDelete: null,
      loading: false,
      klaseEditingId: '',
      klase: {},
      klases: [],
      teacherx: [],
      busy: false,
      form: new this.$form({
        id: 0,
        name: null,
        names: null,
        klase: null,
        teacher: [],
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
    nowLoading() {
      return this.$apollo.queries.klases.loading
    },
    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
  },
  methods: {
    // inline editing
    setToEditing(item) {
      this.klaseEditingId = item
      this.id = item
      if (this.id > 0) {
        this.$apollo.addSmartQuery('klase', {
          query: KLASE_QUERY,
          variables() {
            return {
              id: parseInt(this.id),
              workspaceId: parseInt(this.mainWorkspace.id),
            }
          },
          result({ data, loading }) {
            if (!loading) {
              this.form.id = parseInt(data.klase.id)
              this.form.names = data.klase.name
            }
          },
        })
      }
    },
    updatingKlase() {
      this.klaseEditingId = ''
    },
    // ------- edit -------- //
    editFiled() {
      this.$apollo
        .mutate({
          mutation: UPDATE_KLASE_MUTATION,
          variables: {
            id: parseInt(this.id),
            name: this.form.names,
            workspaceId: parseInt(this.mainWorkspace.id),
          },
        })
        .then(() => {
          this.klaseEditingId = ''
          Swal.fire({
            text: `class updated successfully!`,
            position: 'top-right',
            color: '#fff',
            background: '#5cb85c',
            toast: false,
            backdrop: false,
            timer: 1500,
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
    },
    // -------create -------- //
    async onSubmitCreate() {
      this.form.busy = true
      // submit exam
      try {
        await this.$apollo
          .mutate({
            mutation: CREATE_KLASE_MUTATION,
            variables: {
              name: this.form.name,
              workspaceId: parseInt(this.mainWorkspace.id),
            },
            update: (store, { data: { createKlase } }) => {
              // Read the data from our cache for this query.
              const data = store.readQuery({
                query: KLASE_QUERIES,
                variables: {
                  workspaceId: parseInt(this.mainWorkspace.id),
                },
              })

              data.klases.push(createKlase)

              store.writeQuery({
                query: KLASE_QUERIES,
                variables: {
                  workspaceId: parseInt(this.mainWorkspace.id),
                },
                data,
              })
            },
          })
          .then(() => {
            this.form.busy = false
            this.form.name = ''
            Swal.fire({
              text: `class added successfully!`,
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

    handleDeleteCLass(item) {
      this.invokedForDelete = item

      this.$bvModal.show('DeleteModal')
    },

    // ------delete ----------/
    setToDelete() {
      this.isDeleting = true
      const deleteId = this.invokedForDelete.id
      this.$apollo
        .mutate({
          mutation: DELETE_KLASE_MUTATION,
          variables: {
            id: parseInt(deleteId),
          },
          update: (store, { data: { deleteKlase } }) => {
            const data = store.readQuery({
              query: KLASE_QUERIES,
              variables: {
                workspaceId: parseInt(this.mainWorkspace.id),
              },
            })

            const index = data.klases.findIndex((m) => m.id === deleteId)
            if (index !== -1) {
              // Mutate cache result
              data.klases.splice(index, 1)

              store.writeQuery({
                query: KLASE_QUERIES,
                variables: {
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
            text: 'class deleted successfully',
            position: 'top-right',
            color: '#fff',
            background: '#4bb543',
            toast: false,
            backdrop: false,
            showConfirmButton: false,
          })
          this.isDeleting = false
        })
        .catch(() => {
          // this.klase_id =
        })
        .finally(() => {
          this.$bvModal.hide('DeleteModal')

          this.isDeleting = false
        })
    },
  },
}
</script>
