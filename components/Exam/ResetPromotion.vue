<template>
  <div>
    <b-card>
      <template v-if="resetPromotion.length == 0"
        ><h3 class="p-5 text-center">No record found</h3></template
      >

      <template v-else class="p-3">
        <h3 class="p-4 text-center">Reset Student Promotion</h3>
        <div class="search-input-wrap mr-3 mb-3">
          <b-form-input v-model="search" placeholder="Search..." />
          <b-icon
            style="color: #111"
            class="h5 mt-3 search-icon"
            icon="search"
          />
        </div>

        <div>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Full Name</th>
                  <th scope="col">Photo</th>
                  <th scope="col">Previous Class</th>
                  <th scope="col">current Class</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(reset, index) in filterResult" :key="reset.id">
                  <th scope="row">{{ index + 1 }}</th>
                  <td>
                    {{ reset.student.first_name }}
                    {{ reset.student.last_name }}
                  </td>

                  <td>
                    <b-avatar
                      variant="primary"
                      :src="`${$config.APIRoot}/storage/${mainWorkspace.id}/students/${reset.student.photo}`"
                      alt="photo"
                      width="30"
                    ></b-avatar>
                  </td>

                  <td>
                    {{ resetKlase.name }}
                  </td>

                  <td>
                    {{ reset.student.klase.name }}
                  </td>

                  <td style="color: green">
                    {{ reset.status == true ? 'Promoted' : '' }}
                  </td>
                  <td>
                    <b-button
                      variant="warning"
                      size="md"
                      :disabled="resetId == reset.id"
                      @click="resetStudentPromotion(reset.id)"
                    >
                      <b-spinner
                        v-if="resetId == reset.id"
                        variant="light"
                        small
                        class="mr-1 mb-1"
                      />Reset</b-button
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="text-center">
          <b-button
            class="mb-4"
            variant="success"
            :disabled="busy"
            size="md"
            @click="resetStudentsPromotion"
          >
            <b-spinner
              v-if="busy"
              variant="light"
              small
              class="mr-1 mb-1"
            />Reset Promotion By Class</b-button
          >
        </div>
      </template>
    </b-card>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import Swal from 'sweetalert2'
import {
  CREATE_RESET_PROMOTION_MUTATION,
  RESET_STUDENT_PROMOTION_MUTATION,
} from '~/graphql/promotions/mutations'
import { RESET_PROMOTE_QUERIES } from '~/graphql/promotions/queries'
import { UPDATE_PUBLISH_RESULT_MUTATION } from '~/graphql/examRecord/mutations'
export default {
  props: {
    resetPromotion: {
      type: Array,
      required: false,
    },
    student: {
      type: Array,
      required: false,
    },
    resetKlase: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      search: '',
      busy: false,
      resetId: null,
    }
  },
  computed: {
    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
    filterResult() {
      return this.resetPromotion.filter((t) => {
        return (
          t.student.first_name.toLowerCase().match(this.search.toLowerCase()) ||
          t.student.last_name.toLowerCase().match(this.search.toLowerCase())
        )
      })
    },
  },

  methods: {
    resetStudentsPromotion() {
      if (this.resetPromotion.length !== 0) {
        const klase = parseInt(this.student[0])
        const session = parseInt(this.student[1])
        this.busy = true
        this.$apollo
          .mutate({
            mutation: CREATE_RESET_PROMOTION_MUTATION,
            variables: {
              from_class: parseInt(this.student[0]),
              status: true,
              from_session: parseInt(this.student[1]),
              workspaceId: parseInt(this.mainWorkspace.id),
              from_term: 3,
            },
            update: (store, { data: { createResetPromote } }) => {
              // Read the data from our cache for this query.
              const data = store.readQuery({
                query: RESET_PROMOTE_QUERIES,
                variables: {
                  from_class: parseInt(klase),
                  status: true,
                  from_session: parseInt(session),
                  workspaceId: parseInt(this.mainWorkspace.id),
                  from_term: 3,
                },
              })

              data.resetPromotion = data.resetPromotion.filter((t) => {
                return t.from_class !== parseInt(klase)
              })

              store.writeQuery({
                query: RESET_PROMOTE_QUERIES,
                variables: {
                  from_class: parseInt(klase),
                  status: true,
                  from_session: parseInt(session),
                  workspaceId: parseInt(this.mainWorkspace.id),
                  from_term: 3,
                },

                data,
              })
            },
          })
          .then(() => {
            this.busy = false
            Swal.fire({
              title: 'Good',
              icon: 'success',
              text: 'Students promoted to next class!',
              position: 'center',
              color: '#fff',
              background: '#4bb543',
              toast: false,
              backdrop: false,
              timer: 1500,
              showConfirmButton: false,
            })
          })
          .catch(() => {})
        this.$apollo
          .mutate({
            mutation: UPDATE_PUBLISH_RESULT_MUTATION,
            variables: {
              klase_id: parseInt(this.student[0]),
              term_id: 3,
              session_id: parseInt(this.student[1]),
              workspaceId: parseInt(this.mainWorkspace.id),
              status: 'unpublished',
            },
          })
          .then(() => {})
          .catch(() => {})
      } else {
        Swal.fire({
          title: 'Ooops...',
          icon: 'warning',
          text: 'No record found!',
          position: 'center',
          color: '#fff',
          background: '#cc3300',
          toast: false,
          backdrop: false,
          timer: 1500,
          showConfirmButton: false,
        })
      }
    },

    resetStudentPromotion(promotionId) {
      if (this.resetPromotion.length !== 0) {
        const klase = parseInt(this.student[0])
        const session = parseInt(this.student[1])
        this.resetId = promotionId
        this.$apollo
          .mutate({
            mutation: RESET_STUDENT_PROMOTION_MUTATION,
            variables: {
              from_class: parseInt(this.student[0]),
              promotion_id: parseInt(promotionId),
              from_session: parseInt(this.student[1]),
              workspaceId: parseInt(this.mainWorkspace.id),
              from_term: 3,
            },
            update: (store, { data: { resetStudentPromotion } }) => {
              // Read the data from our cache for this query.
              const data = store.readQuery({
                query: RESET_PROMOTE_QUERIES,
                variables: {
                  from_class: parseInt(klase),
                  status: true,
                  from_session: parseInt(session),
                  workspaceId: parseInt(this.mainWorkspace.id),
                  from_term: 3,
                },
              })

              data.resetPromotion = data.resetPromotion.filter((t) => {
                return t.id != parseInt(promotionId)
              })

              store.writeQuery({
                query: RESET_PROMOTE_QUERIES,
                variables: {
                  from_class: parseInt(klase),
                  status: true,
                  from_session: parseInt(session),
                  workspaceId: parseInt(this.mainWorkspace.id),
                  from_term: 3,
                },

                data,
              })
            },
          })
          .then(() => {
            Swal.fire({
              text: 'Students promoted to next class!',
              position: 'top-right',
              color: '#fff',
              background: '#4bb543',
              toast: false,
              backdrop: false,
              timer: 1500,
              showConfirmButton: false,
            })
            this.resetId = null
          })
          .catch(() => {})
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
