<template>
  <div class="p-3">
    <template v-if="$apollo.queries.events.loading"><Preload /></template>
    <template v-else>
      <div>
        <b-card no-body>
          <b-tabs card>
            <b-tab active>
              <template #title>
                <b-icon icon="plus" /><strong>Add Event</strong>
              </template>

              <b-form
                method="POST"
                @submit.prevent="onSubmit"
                @keydown="form.onKeydown($event)"
                @reset.prevent="onReset"
              >
                <b-row class="p-4">
                  <b-col md="10" class="p-4">
                    <client-only>
                      <VueEditor v-model="form.description" />
                    </client-only>
                    <b-form-invalid-feedback
                      :state="!form.errors.has('description')"
                    >
                      {{ form.errors.get('description') }}
                    </b-form-invalid-feedback>
                  </b-col>

                  <b-col md="3" class="p-4">
                    <b-form-group label="Date">
                      <b-form-datepicker
                        id="datepicker-buttons"
                        v-model="form.date"
                        today-button
                        reset-button
                        close-button
                        locale="en"
                        size="md"
                      ></b-form-datepicker>
                      <b-form-invalid-feedback
                        :state="!form.errors.has('date')"
                      >
                        {{ form.errors.get('date') }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>

                  <b-col md="12" class="p-4">
                    <b-button
                      type="submit"
                      pill
                      variant="primary"
                      class="mr-4"
                      size="md"
                    >
                      <b-spinner
                        v-if="form.busy"
                        variant="light"
                        small
                        class="mr-1 mb-1"
                      />Register</b-button
                    >
                    <b-button
                      pill
                      class="ml-4"
                      size="md"
                      type="reset"
                      variant="danger"
                      >Reset</b-button
                    >
                  </b-col>
                </b-row>
              </b-form>
            </b-tab>

            <b-tab lazy>
              <template #title>
                <strong>School Event</strong>
              </template>

              <div class="d-flex justify-content-between">
                <b-form-checkbox
                  style="margin-left: 22px"
                  @change="selectAllEvents"
                >
                </b-form-checkbox>
                <b-button
                  class="mr-4 mb-2"
                  variant="danger"
                  pill
                  @click="handleBulkDeleteEvent"
                  >Delete All</b-button
                >
              </div>
              <b-col md="12">
                <b-table
                  striped
                  responsive
                  hover
                  fixed
                  :items="events"
                  :fields="fields"
                >
                  <template #cell(delete)="data">
                    <b-form-checkbox
                      v-model="deleteEvents"
                      :value="data.item.id"
                    ></b-form-checkbox>
                  </template>

                  <template #cell(description)="data">
                    <span v-html="data.value"></span>
                  </template>
                  <template #cell(date)="date">
                    <b-badge
                      class="d-inline-block"
                      variant="warning"
                      >{{ date.value }}</b-badge
                    >
                  </template>
                  <template #cell(actions)="row" class="d-flex">
                    <div class="d-flex">
                      <b-button
                        v-if="row.item.status == 0"
                        size="smd"
                        variant="success"
                        class="mr-3 d-flex"
                        @click="
                          handlePublishEvent(row.item.id, row.item.status)
                        "
                      >
                        <b-spinner
                          v-if="isPublished === row.item.id"
                          variant="light"
                          small
                          class="mr-1 mb-1"
                        />

                        Publish
                      </b-button>

                      <b-button
                        v-if="row.item.status == 1"
                        size="smd"
                        variant="danger"
                        class="mr-3 d-flex"
                        @click="
                          handlePublishEvent(row.item.id, row.item.status)
                        "
                      >
                        <b-spinner
                          v-if="isPublished === row.item.id"
                          variant="light"
                          small
                          class="mr-1 mb-1"
                        />

                        Unpublish
                      </b-button>

                      <b-button
                        size="smd"
                        variant="info"
                        class="mr-2 d-flex"
                        @click="handleEditEvent(row.item)"
                      >
                        <b-icon icon="pencil-square" />
                      </b-button>

                      <b-button
                        size="smd"
                        variant="danger"
                        @click="handleDeleteEvent(row.item)"
                      >
                        <b-icon icon="trash" />
                      </b-button>
                    </div>
                  </template>
                </b-table>
              </b-col>
            </b-tab>
          </b-tabs>
        </b-card>
      </div>
    </template>
    <!-- delete modal -->
    <b-modal id="DeleteModal" centered hide-header hide-footer>
      <div class="p-5 text-center">
        <Spinner v-if="isDeleting" size="4" />
        <template v-else>
          <h5>Confirm delete Event?</h5>

          <p>This action cannot be undone.</p>

          <div>
            <b-button
              variant="light"
              class="px-4 mr-2 border"
              @click="handleCancelDelete"
            >
              Cancel
            </b-button>

            <b-button variant="danger" class="px-4" @click="deleteInvokedEvent">
              Delete
            </b-button>
          </div>
        </template>
      </div>
    </b-modal>
    <!-- end -->

    <!-- bulk delete modal -->
    <b-modal id="BulkDeleteModal" centered hide-header hide-footer>
      <div class="p-5 text-center">
        <Spinner v-if="isDeletingBulk" size="4" />
        <template v-else>
          <h5>
            Are you sure you want to delete
            <strong>{{ deleteEvents.length }}</strong> Event(s)?
          </h5>

          <div>
            <b-button
              variant="light"
              class="px-4 mr-2 border"
              @click="handleCancelBulkDelete"
            >
              Cancel
            </b-button>

            <b-button
              variant="danger"
              class="px-4"
              @click="bulkDeleteInvokedEvent"
            >
              Delete
            </b-button>
          </div>
        </template>
      </div>
    </b-modal>
    <!-- end -->

    <!-- edit modal -->
    <AdminEditEventModal
      v-if="isEditEventModal"
      v-model="isEditEventModal"
      :event="invokedForEdit"
    />
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import {
  BULK_DELETE_EVENT_MUTATION,
  CREATE_EVENT_MUTATION,
  DELETE_EVENT_MUTATION,
  PUBLISH_EVENT_MUTATION,
} from '~/graphql/events/mutations'
import { EVENT_QUERIES } from '~/graphql/events/queries'
import AdminEditEventModal from '~/components/AdminEdit/EventModal.vue'
import Preload from '~/components/Preload.vue'
import Spinner from '~/components/Global/Spinner.vue'
import Swal from 'sweetalert2'

export default {
  components: {AdminEditEventModal, Preload, Spinner},
  middleware: 'auth',
  // to remove html tags
  // filters: {
  //   strippedContent: function (string) {
  //     return string.replace(/<\/?[^>]+>/gi, ' ')
  //   },
  // },
  data() {
    return {
      isPublished: null,
      events: [],
      deleteEvents: [],
      isDeletingBulk: false,
      isEditEventModal: false,
      // isEditEventModal: false,
      invokedForEdit: null,
      form: new this.$form({
        description: null,
        date: null,
        busy: false,
      }),

      fields: [
        {
          key: 'delete',
          label: 'Delete All',
        },
        {
          key: 'date',
          label: 'Date',
        },
        {
          key: 'description',
          label: 'Description',
        },
        { key: 'actions', label: 'Actions' },
      ],
      invokedForDelete: null,
      isDeleting: false,
    }
  },
  apollo: {
    events: {
      query: EVENT_QUERIES,
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
    // update
    async onSubmit() {
      this.form.busy = true
      // submit exam
      try {
        await this.$apollo
          .mutate({
            mutation: CREATE_EVENT_MUTATION,
            variables: {
              workspaceId: parseInt(this.mainWorkspace.id),
              description: this.form.description,
              date: this.form.date,
            },
            update: (store, { data: { createEvent } }) => {
              // Read the data from our cache for this query.
              const data = store.readQuery({
                query: EVENT_QUERIES,
                variables: {
                  workspaceId: parseInt(this.mainWorkspace.id),
                },
              })

              data.events.push(createEvent)
            
              store.writeQuery({
                query: EVENT_QUERIES,
                variables: {
                  workspaceId: parseInt(this.mainWorkspace.id),
                },
                data,
              })
            },
          })

          .then(() => {
            this.form.description = null
            this.form.date = null
            Swal.fire({
              text: `event added successfully!`,
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
    // edit

    handleEditEvent(event) {
      this.invokedForEdit = event
      this.isEditEventModal = true
    },

    // delete
    handleCancelDelete() {
      this.invokedForDelete = null

      this.$bvModal.hide('DeleteModal')
    },

    handleDeleteEvent(event) {
      this.invokedForDelete = event

      this.$bvModal.show('DeleteModal')
    },

    deleteInvokedEvent() {
      this.isDeleting = true

      this.$apollo
        .mutate({
          mutation: DELETE_EVENT_MUTATION,
          variables: {
            workspaceId: parseInt(this.mainWorkspace.id),
            id: parseInt(this.invokedForDelete.id),
          },
          update: (store, { data: { deleteEvent } }) => {
            try {
              const data = store.readQuery({
                query: EVENT_QUERIES,
                variables: {
                  workspaceId: parseInt(this.mainWorkspace.id),
                },
              })

              const EventIndex = data.events.findIndex(
                (m) => m.id === this.invokedForDelete.id
              )

              if (EventIndex !== -1) {
                data.events.splice(EventIndex, 1)
              }

              // Write our data back to the cache.
              store.writeQuery({
                query: EVENT_QUERIES,
                variables: {
                  workspaceId: parseInt(this.mainWorkspace.id),
                },
                data,
              })
            } catch (e) {
              // Do something with this error
            }
          },
        })
        .then(() => {
          Swal.fire({
            text: `event added successfully!`,
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
          
        })
        .finally(() => {
          this.$bvModal.hide('DeleteModal')

          this.isDeleting = false
        })
    },

    selectAllEvents(event) {
      if (event === true) {
        this.deleteEvents = this.events.map((event) => event.id)
      } else {
        this.deleteEvents = []
      }
    },

    handleCancelBulkDelete() {
      this.invokedForDelete = null
      this.$bvModal.hide('BulkDeleteModal')
    },

    handleBulkDeleteEvent() {
      if (this.deleteEvents.length > 0) {
        this.$bvModal.show('BulkDeleteModal')
      } else {
        Swal.fire({
          text: `select event(s) to delete!`,
          position: 'top-right',
          color: '#fff',
          background: '#d9534f',
          toast: false,
          backdrop: false,
          timer: 1500,
          showConfirmButton: false,
        })
      }
    },

    bulkDeleteInvokedEvent() {
      this.isDeletingBulk = true

      this.$apollo
        .mutate({
          mutation: BULK_DELETE_EVENT_MUTATION,
          variables: {
            workspaceId: parseInt(this.mainWorkspace.id),
            ids: this.deleteEvents,
          },
          update: (store, { data: { bulkDeleteEvent } }) => {
            try {
              const data = store.readQuery({
                query: EVENT_QUERIES,
                variables: {
                  workspaceId: parseInt(this.mainWorkspace.id),
                },
              })

              data.events = data.events.filter(
                (event) => !this.deleteEvents.includes(event.id)
              )

              store.writeQuery({
                query: EVENT_QUERIES,
                variables: {
                  workspaceId: parseInt(this.mainWorkspace.id),
                },
                data,
              })
            } catch (e) {
              // Do something with this error
            }
          },
        })
        .then(() => {
          Swal.fire({
            text: `event(s) deleted successfully!`,
            position: 'top-right',
            color: '#fff',
            background: '#5cb85c',
            toast: false,
            backdrop: false,
            timer: 1500,
            showConfirmButton: false,
          })
          this.deleteLeads = []
        })
        .catch(({ graphQLErrors: errors, ...rest }) => {
          Swal.fire({
            text: `an error accur while proccessing your request!`,
            position: 'top-right',
            color: '#fff',
            background: '#d9534f',
            toast: false,
            backdrop: false,
            timer: 1500,
            showConfirmButton: false,
          })
        })
        .finally(() => {
          this.$bvModal.hide('BulkDeleteModal')

          this.isDeletingBulk = false
        })
    },

    async handlePublishEvent(eventId, published) {
      try {
        this.isPublished = eventId
        await this.$apollo
          .mutate({
            mutation: PUBLISH_EVENT_MUTATION,
            variables: {
              workspaceId: parseInt(this.mainWorkspace.id),
              id: parseInt(eventId),
            },
            update: (store, { data: { publishEvent } }) => {
              // Read the data from our cache for this query.
              const data = store.readQuery({
                query: EVENT_QUERIES,
                variables: {
                  workspaceId: parseInt(this.mainWorkspace.id),
                },
              })

              var publishedEvent = data.events.filter((m) => {
                 (m) => m.status === eventId
              })


              publishedEvent = publishEvent

              // Write our data back to the cache.
              // Write back to the cache
              store.writeQuery({
                query: EVENT_QUERIES,
                variables: {
                  workspaceId: parseInt(this.mainWorkspace.id),
                },
                data,
              })
            },
          })

          .then(() => {
            this.isPublished = null
            this.form.description = null
            this.form.date = null
            Swal.fire({
              text: `${
                published === false ? 'Published' : 'Unpublished'
              } successfully!`,
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

    onReset(event) {
      event.preventDefault()
      // Reset our form values
      this.form = ''
      // this.form.photo = null
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
  },
}
</script>
