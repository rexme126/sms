<template>
  <div class="p-3">
    <template v-if="$apollo.queries.sessions.loading"><Preload /></template>
    <template v-else>
      <div>
        <b-card no-body>
         
            <div class="p-4 mt-3">
              <h4 class="mb-3">All Sessions</h4>
              <b-table :items="sessions" :fields="fields">
                <template #cell(#)="data">
                  {{ data.index + 1 }}
                </template>
                <template #cell(name)="data">
                  <div v-if="sessionEditingId == data.item.id">
                    <b-row no-gutters>
                      <b-col md="4">
                        <input
                          debounce="1000"
                          v-model="form.names"
                          style="width: 10rem"
                          type="text"
                          required
                          size="lg"
                          @blur="updatingSession(data.value)"
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
                @click="handleDeleteSession(data.item)"
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
              <h5>Confirm delete session?</h5>

              <p>This action cannot be undone.</p>

              <div>
                <b-button
                  variant="light"
                  class="px-4 mr-2 border"
                  @click="handleCancelDelete"
                >
                  Cancel
                </b-button>

                <b-button variant="danger" class="px-4" @click="deleteSession">
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
              @reset.prevent="onReset"
            >
              <!-- description -->
              <b-row no-gutters>
                <b-col md="2">
                  <label
                    for="input-small"
                    class="label-padding ml-4"
                    style="font-size: 18px"
                    >Name:</label
                  >
                </b-col>

                <b-col md="4" class="px-4 mb-5">
               
                    <b-form-group>
                      <b-form-input
                        v-model="form.name"
                        placeholder="Enter session"
                        type="text"
                        trim
                        required
                        size="lg"
                      ></b-form-input>
                      <b-form-invalid-feedback
                        :state="!form.errors.has('name')"
                      >
                        {{ form.errors.get('name') }}
                      </b-form-invalid-feedback>
                    </b-form-group>

                    <b-button
                      type="submit"
                      variant="primary"
                      class="mr-4"
                      size="md"
                    >
                      <b-spinner
                        v-if="form.busy"
                        variant="light"
                        class="mr-1 mb-1"
                        small
                      />Add Session</b-button
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
import { SESSION_QUERIES, SESSION_QUERY } from '~/graphql/sessions/queries'
import {
  CREATE_SESSION_MUTATION,
  DELETE_SESSION_MUTATION,
  UPDATE_SESSION_MUTATION,
} from '~/graphql/sessions/mutations'
import Preload from '~/components/Preload.vue'

export default {
  components: {Preload},
  middleware: 'auth',
  data() {
    return {
      id: 0,
      invokedForDelete: null,
      isDeleting: false,
      sessionEditingId: '',
      session: {},
      busy: false,
      form: new this.$form({
        id: 0,
        name: null,
        names: null,
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
  },

  computed: {
    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
  },

  methods: {
    // inline editing
    setToEditing(item) {
      this.sessionEditingId = item
      this.id = item

      if (this.id > 0) {
        this.$apollo.addSmartQuery('session', {
          query: SESSION_QUERY,
          variables() {
            return {
              id: parseInt(this.id),
              workspaceId: parseInt(this.mainWorkspace.id),
            }
          },
          result({ data, loading }) {
            if (!loading) {
              this.form.id = parseInt(data.session.id)
              this.form.names = data.session.name
            }
          },
        })
      }
    },

    updatingSession() {
      this.sessionEditingId = ''
    },
    // ------- edit ----//
    editFiled(item) {
      this.$apollo
        .mutate({
          mutation: UPDATE_SESSION_MUTATION,
          variables: {
            id: parseInt(item),
            name: this.form.names,
            workspaceId: parseInt(this.mainWorkspace.id),
          },
        })
        .then(() => {
          Swal.fire({
            timer: 1000,
            text: 'sussion updated successfully',
            position: 'top-right',
            color: '#fff',
            background: '#4bb543',
            toast: false,
            backdrop: false,
            showConfirmButton: false,
          })
          this.sessionEditingId = ''
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
            mutation: CREATE_SESSION_MUTATION,
            variables: {
              name: this.form.name,
              workspaceId: parseInt(this.mainWorkspace.id),
            },
            update: (store, { data: { createSession } }) => {
              // Read the data from our cache for this query.
              const data = store.readQuery({
                query: SESSION_QUERIES,
                variables: {
                  workspaceId: parseInt(this.mainWorkspace.id),
                },
              })

              data.sessions.push(createSession)

              store.writeQuery({
                query: SESSION_QUERIES,
                variables: {
                  workspaceId: parseInt(this.mainWorkspace.id),
                },
                data,
              })
            },
          })
          .then(() => {
            this.form.name = null
            Swal.fire({
              timer: 1000,
              text: 'session saved successfully',
              position: 'top-right',
              color: '#fff',
              background: '#4bb543',
              toast: false,
              showConfirmButton: false,
              backdrop: false,
            })
            this.form.session = ''
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

    handleDeleteSession(item) {
      this.invokedForDelete = item

      this.$bvModal.show('DeleteModal')
    },

     deleteSession() {
      this.isDeleting = true
      const deleteId = this.invokedForDelete.id
      this.$apollo
        .mutate({
          mutation: DELETE_SESSION_MUTATION,
          variables: {
            id: parseInt(deleteId),
          },
          update: (store, { data: { deleteSession } }) => {
            const data = store.readQuery({
              query: SESSION_QUERIES,
              variables: {
                workspaceId: parseInt(this.mainWorkspace.id)
              },
            })

             const index = data.sessions.findIndex((m) => m.id === deleteId)
            if (index !== -1) {
              // Mutate cache result
              data.sessions.splice(index, 1)

              store.writeQuery({
                query: SESSION_QUERIES,
                variables: {
                 workspaceId: parseInt(this.mainWorkspace.id)
                },
                data,
              })
            }
          },
        })
        .then(() => {
          Swal.fire({
            timer: 1000,
            text: 'session deleted successfully',
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
