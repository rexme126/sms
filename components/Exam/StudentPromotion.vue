<template>
  <div>
    <b-card class="p-4">
      <template v-if="promoteStudents.length == 0"
        ><h3 class="text-center p-4">No record found</h3></template
      >
      <template v-else>
        <h3 class="p-4 text-center" style="font-weight: bold">
          <span style="color: green"
            >({{ promoteStudents[0].klase.name }})</span
          >
          Student Result Section
        </h3>
        <div class="search-input-wrap mr-3 mb-3">
          <b-form-input v-model="search" placeholder="Search..." /><b-icon
            style="color: #111"
            class="h5 mt-3 search-icon"
            icon="search"
          />
        </div>

        <b-table :items="filterResult" :responsive="true" :fields="fields">
          <template #cell(#)="data">
            {{ data.index + 1 }}
          </template>

          <template #cell(first_name)="data">
            {{ data.item.last_name }} {{ data.item.first_name }}
          </template>

          <template #cell(photo)="data">
            <b-avatar
              variant="primary"
              :src="`${$config.APIRoot}/storage/${mainWorkspace.id}/students/${data.item.photo}`"
            >
            </b-avatar>
          </template>

          <template #cell(session)="data">
            {{ data.item.session.name }}
          </template>

          <template #cell(klase)="data">
            {{ data.item.klase.name }}
          </template>
        </b-table>

        <div class="text-center mb-4" @click="createPromoteStudents">
          <b-button :disabled="busy" variant="success" size="md">
            <b-spinner
              v-if="busy"
              variant="light"
              small
              class="mr-1 mb-1"
            />Promote Students</b-button
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
import { CREATE_PROMOTION_MUTATION } from '~/graphql/promotions/mutations'
import { PROMOTESTUDENTS_QUERIES } from '~/graphql/promotions/queries'
import { UPDATE_PUBLISH_RESULT_MUTATION } from '~/graphql/examRecord/mutations'
export default {
  props: {
    promoteStudents: Array,
    examRecords: Array,
    student: Array,
    setPromotion: Object,
  },
  data() {
    return {
      busy: false,
      set: null,
      avg: '',
      search: '',
      fields: [
        {
          key: '#',
          sortable: false,
        },
        {
          key: 'first_name',
          label: 'Full Name',
          sortable: false,
        },

        {
          key: 'photo',
          label: 'Photo',
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
          key: 'cum_avg',
          label: 'Cum Average.',
        },
        {
          key: 'session',
          label: 'Session.',
        },

        {
          key: '',
          sortable: false,
        },
      ],
    }
  },
  computed: {
    // promotionMark() {
    //   return this.setPromotion.name
    // },
    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
    filterResult() {
      return this.promoteStudents.filter((t) => {
        return (
          t.first_name.toLowerCase().match(this.search.toLowerCase()) ||
          t.last_name.toLowerCase().match(this.search.toLowerCase()) ||
          t.adm_no.match(parseInt(this.search))
        )
      })
    },
  },

  methods: {
    createPromoteStudents() {
      if (this.examRecords[0].term_start == null) {
        Swal.fire({
          text: 'You are being redirected to the Resumption page to create school resumption date',
          position: 'center',
          color: '#fff',
          background: '#d9534f',
          toast: false,
          backdrop: false,
        })
        this.$router.push({
          name: 'workspace-admin-exam-resumption',
          params: { workspace: this.mainWorkspace.slug },
        })
        return
      }

      if (this.promoteStudents.length !== 0) {
        const klase = parseInt(this.student[0])
        const session = parseInt(this.student[2])
        this.busy = true
        this.$apollo
          .mutate({
            mutation: CREATE_PROMOTION_MUTATION,
            variables: {
              klase_id: parseInt(this.student[0]),
              klaseTo: parseInt(this.student[1]),
              session_id: parseInt(this.student[2]),
              sessionTo: parseInt(this.student[3]),
              workspaceId: parseInt(this.mainWorkspace.id),
              from_term: 3,
            },
            update: (store, { data: { createPromoteStudents } }) => {
              // Read the data from our cache for this query.
              const data = store.readQuery({
                query: PROMOTESTUDENTS_QUERIES,
                variables: {
                  klase_id: parseInt(this.student[0]),
                  status: true,
                  session_id: parseInt(this.student[2]),
                  workspaceId: parseInt(this.mainWorkspace.id),
                },
              })

              data.promoteStudents.filter((t) => {
                t.status !== true
              })

              data.promoteStudents = createPromoteStudents

              store.writeQuery({
                query: PROMOTESTUDENTS_QUERIES,
                variables: {
                  klase_id: parseInt(this.student[0]),
                  status: true,
                  session_id: parseInt(this.student[2]),
                  workspaceId: parseInt(this.mainWorkspace.id),
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
          .catch(() => {}),
          this.$apollo
            .mutate({
              mutation: UPDATE_PUBLISH_RESULT_MUTATION,
              variables: {
                klase_id: parseInt(this.student[0]),
                term_id: 3,
                session_id: parseInt(this.student[2]),
                workspaceId: parseInt(this.mainWorkspace.id),
                status: 'published',
              },
            })
            .then(() => {})
            .catch((e) => {})
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
