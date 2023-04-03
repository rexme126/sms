<template>
  <div class="attendance">
    <template v-if="classAttendances[0] == null">
      <h4 class="text-center">No record found</h4>
    </template>

    <template v-else>
      <h4 class="text-center p-3">
        <span style="color: green; font-weight: bold"
          >{{ classAttendances[0].klase.name }} Class Attendance</span
        >
      </h4>

      <b-form
        method="POST"
        @submit.prevent="onLogin"
        @keydown="form.onKeydown($event)"
      >
        <h4 class="text-center">
          Total number of days
          <span style="color: red">{{ classAttendances[0].num_total }} </span>
        </h4>
        <div class="d-flex">
          <div>
            <b-form-group label="Total Days">
              <input
                v-model="form.num_total"
                type="number"
                class="mb-2"
                style="width: 70px; padding-left: 5px; height: 35px"
                required
              />
            </b-form-group>
          </div>

          <div class="search-input-wrap mr-3 ml-auto">
            <b-form-input v-model="search" placeholder="Search..." />
            <b-icon
              style="color: #111"
              class="h5 mt-3 search-icon"
              icon="search"
            />
          </div>
        </div>

        <div style="width: 80%; margin: auto">
          <table class="table table-striped table-sm align-table">
            <thead class="">
              <tr>
                <th scope="col">S/N</th>
                <th scope="col">Name</th>
                <th scope="col">Photo</th>
                <th scope="col">Days Present</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(classAttendance, value) in classAttendancex"
                :key="classAttendance.id"
              >
                <td>{{ value + 1 }}</td>

                <td>
                  {{ classAttendance.student.last_name }}
                  {{ classAttendance.student.first_name }}
                </td>

                <td>
                  <b-avatar
                    variant="primary"
                    :src="`${$config.APIRoot}/storage/${mainWorkspace.id}/students/${classAttendance.student.photo}`"
                  >
                  </b-avatar>
                </td>

                <td>{{ classAttendance.student.adm_no }}</td>

                <td scope="row">
                  <input
                    v-model="classAttendance.num_present"
                    type="number"
                    min="0"
                    @input="
                      sendAttendance(
                        classAttendance,
                        $event.target.value,
                        'num_present'
                      )
                    "
                    style="width: 70px; padding-left: 5px; height: 35px"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div class="text-center mt-4">
            <b-button size="md" type="submit" variant="primary" :disabled="busy"
              ><b-spinner
                v-if="busy"
                variant="light"
                small
                class="mr-1 mb-1"
              />Submit</b-button
            >
          </div>
        </div>
      </b-form>
    </template>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import Swal from 'sweetalert2'
import { UPDATE_ATTENDANCE_MUTATION } from '~/graphql/examRecord/mutations'

export default {
  props: {
    classAttendances: Array,
    student: Array,
  },
  data() {
    return {
      mainAttendances: [],
      busy: false,
      search: '',
      form: new this.$form({
        num_total: null,
      }),
    }
  },
  computed: {
    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
    classAttendancex() {
      return this.classAttendances.filter((t) => {
        return (
          t.student.first_name.toLowerCase().match(this.search.toLowerCase()) ||
          t.student.last_name.toLowerCase().match(this.search.toLowerCase())
        )
      })
    },
  },
  methods: {
    sendAttendance(classAttendance, value, keyName) {
      const index = this.mainAttendances.findIndex(
        (mainAttendance) =>
          mainAttendance.classAttendanceId === classAttendance.id
      )
      console.log(index)
      if (index === -1) {
        this.mainAttendances = [
          ...this.mainAttendances,
          {
            classAttendanceId: classAttendance.id,
            [keyName]: value,
          },
        ]
      } else {
        this.mainAttendances = [
          ...this.mainAttendances.slice(0, index),
          {
            ...this.mainAttendances[index],
            [keyName]: value,
          },
          // to account for the remainder
          ...this.mainAttendances.slice(index + 1),
        ]
      }
    },
    onLogin() {
      this.busy = true
      this.$apollo
        .mutate({
          mutation: UPDATE_ATTENDANCE_MUTATION,
          variables: {
            attendances: this.mainAttendances,
            num_total: parseInt(this.form.num_total),
            klase_id: parseInt(this.student[0]),
            term_id: parseInt(this.student[1]),
            session_id: parseInt(this.student[2]),
            section_id: parseInt(this.student[3]),
            workspaceId: parseInt(this.mainWorkspace.id),
          },
        })
        .then(() => {
          Swal.fire({
            title: 'Good',
            icon: 'success',
            text: 'Class attendances added successfully',
            position: 'center',
            color: '#fff',
            background: '#4bb543',
            toast: false,
            backdrop: false,
            timer: 1500,
            showConfirmButton: false,
          })
          this.busy = false
        })
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
    padding: 18px 30px;
    height: 35px;
    background-color: rgba(#d9ecff, 0.5);
    // border-color: transparent;
  }
}
</style>
