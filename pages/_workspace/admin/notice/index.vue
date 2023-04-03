<template>
  <div class="p-3">
    <template v-if="$apollo.queries.notices.loading"><Preload /></template>
    <template v-else>
      <div>
        <b-card no-body>
          <b-tabs card>
            <b-tab active>
              <template #title>
                <b-icon icon="plus" /><strong>Add Notice</strong>
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
                        size="smd"
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
                <strong>School Notice</strong>
              </template>

              <div class="d-flex justify-content-between">
                <b-form-checkbox
                  style="margin-left: 22px"
                  @change="selectAllNotices"
                >
                </b-form-checkbox>
                <b-button
                  class="mr-4 mb-2"
                  variant="danger"
                  pill
                  @click="handleBulkDeleteNotice"
                  >Delete All</b-button
                >
              </div>

              <b-col md="12">
                <b-table
                  striped
                  responsive
                  hover
                  fixed
                  :items="notices"
                  :fields="fields"
                >
                  <template #cell(delete)="data">
                    <b-form-checkbox
                      v-model="deleteNotices"
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
                        v-if="row.item.status == false"
                        size="smd"
                        variant="success"
                        class="mr-3 d-flex"
                        @click="
                          handlePublishNotice(row.item.id, row.item.status)
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
                        v-if="row.item.status == true"
                        size="smd"
                        variant="danger"
                        class="mr-3 d-flex"
                        @click="
                          handlePublishNotice(row.item.id, row.item.status)
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
                        @click="handleEditNotice(row.item)"
                      >
                        <b-icon icon="pencil-square" />
                      </b-button>

                      <b-button
                        size="smd"
                        variant="danger"
                        @click="handleDeleteNotice(row.item)"
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
          <h5>Confirm delete Notice?</h5>

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
              @click="deleteInvokedNotice"
            >
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
            <strong>{{ deleteNotices.length }}</strong> Notice(s)?
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
              @click="bulkDeleteInvokedNotice"
            >
              Delete
            </b-button>
          </div>
        </template>
      </div>
    </b-modal>
    <!-- end -->

    <!-- edit modal -->
    <AdminEditNoticeModal
      v-model="isEditNoticeModal"
      :notice="invokedForEdit"
      v-if="isEditNoticeModal"
    />
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import {
  BULK_DELETE_NOTICE_MUTATION,
  CREATE_NOTICE_MUTATION,
  DELETE_NOTICE_MUTATION,
  PUBLISH_NOTICE_MUTATION,
} from '~/graphql/notices/mutations'
import { NOTICE_QUERIES } from '~/graphql/notices/queries'
import AdminEditNoticeModal from '~/components/AdminEdit/NoticeModal.vue'
import Preload from '~/components/Preload.vue'
import Spinner from '~/components/Global/Spinner.vue'
import Swal from 'sweetalert2'

export default {
  components: { AdminEditNoticeModal, Preload, Spinner },
  middleware: 'auth',
  data() {
    return {
      deleteNotices: [],
      isDeletingBulk: false,
      isPublished: null,
      notices: [],
      isEditNoticeModal: false,
      isEditNoticeModal: false,
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
    notices: {
      query: NOTICE_QUERIES,
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
            mutation: CREATE_NOTICE_MUTATION,
            variables: {
              workspaceId: parseInt(this.mainWorkspace.id),
              description: this.form.description,
              date: this.form.date,
            },
            update: (store, { data: { createNotice } }) => {
              // Read the data from our cache for this query.
              const data = store.readQuery({
                query: NOTICE_QUERIES,
                variables: {
                  workspaceId: parseInt(this.mainWorkspace.id),
                },
              })

              data.notices.push(createNotice)
              
              store.writeQuery({
                query: NOTICE_QUERIES,
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
              text: `notice added successfully!`,
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

    handleEditNotice(notice) {
      this.invokedForEdit = notice
      this.isEditNoticeModal = true
    },

    // delete
    handleCancelDelete() {
      this.invokedForDelete = null

      this.$bvModal.hide('DeleteModal')
    },

    handleDeleteNotice(notice) {
      this.invokedForDelete = notice

      this.$bvModal.show('DeleteModal')
    },

    deleteInvokedNotice() {
      this.isDeleting = true

      this.$apollo
        .mutate({
          mutation: DELETE_NOTICE_MUTATION,
          variables: {
            workspaceId: parseInt(this.mainWorkspace.id),
            id: parseInt(this.invokedForDelete.id),
          },
          update: (store, { data: { deleteNotice } }) => {
            try {
              const data = store.readQuery({
                query: NOTICE_QUERIES,
                variables: {
                  workspaceId: parseInt(this.mainWorkspace.id),
                },
              })

              const NoticeIndex = data.notices.findIndex(
                (m) => m.id === this.invokedForDelete.id
              )

              if (NoticeIndex !== -1) {
                data.notices.splice(NoticeIndex, 1)
              }

              // Write our data back to the cache.
              store.writeQuery({
                query: NOTICE_QUERIES,
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
            text: `notice added successfully!`,
            position: 'top-right',
            color: '#fff',
            background: '#5cb85c',
            toast: false,
            backdrop: false,
            timer: 1500,
            showConfirmButton: false,
          })
        })
        .catch(() => {})
        .finally(() => {
          this.$bvModal.hide('DeleteModal')

          this.isDeleting = false
        })
    },

    // Bulk delete method

    selectAllNotices(event) {
      if (event === true) {
        this.deleteNotices = this.notices.map((notice) => notice.id)
      } else {
        this.deleteNotices = []
      }
    },

    handleCancelBulkDelete() {
      this.invokedForDelete = null
      this.$bvModal.hide('BulkDeleteModal')
    },

    handleBulkDeleteNotice() {
      if (this.deleteNotices.length > 0) {
        this.$bvModal.show('BulkDeleteModal')
      } else {
        Swal.fire({
          text: `select notice(s) to delete!`,
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

    bulkDeleteInvokedNotice() {
      this.isDeletingBulk = true

      this.$apollo
        .mutate({
          mutation: BULK_DELETE_NOTICE_MUTATION,
          variables: {
            workspaceId: parseInt(this.mainWorkspace.id),
            ids: this.deleteNotices,
          },
          update: (store, { data: { bulkDeleteNoice } }) => {
            try {
              const data = store.readQuery({
                query: NOTICE_QUERIES,
                variables: {
                  workspaceId: parseInt(this.mainWorkspace.id),
                },
              })

              data.notices = data.notices.filter(
                (notice) => !this.deleteNotices.includes(notice.id)
              )

              store.writeQuery({
                query: NOTICE_QUERIES,
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
            text: `notice(s) deleted successfully!`,
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

    async handlePublishNotice(noticeId, published) {
      try {
        this.isPublished = noticeId
        await this.$apollo
          .mutate({
            mutation: PUBLISH_NOTICE_MUTATION,
            variables: {
              workspaceId: parseInt(this.mainWorkspace.id),
              id: parseInt(noticeId),
            },
            update: (store, { data: { publishNotice } }) => {
              // Read the data from our cache for this query.
              const data = store.readQuery({
                query: NOTICE_QUERIES,
                variables: {
                  workspaceId: parseInt(this.mainWorkspace.id),
                },
              })

              var publishedNotice = data.notices.filter(
                (m) => m.status !== noticeId
              )

              publishedNotice = publishNotice

              // Write our data back to the cache.
              // Write back to the cache
              store.writeQuery({
                query: NOTICE_QUERIES,
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
