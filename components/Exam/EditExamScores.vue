<template>
  <div class="exam-scores p-3">
    <template v-if="marks.length == 0"
      ><h3 class="text-center p-4">No record found</h3></template
    >

    <template v-else>
      <h3 class="text-center p-3">
        <span style="color: green; font-weight: bold"
          >{{ marks[0].klase.name }} Scoresheet</span
        >
      </h3>

      <div class="search-input-wrap mr-3 mb-3">
        <b-form-input v-model="search" placeholder="Search..." /><b-icon
          style="color: #111"
          class="h5 mt-3 search-icon"
          icon="search"
        />
      </div>

      <div class="exam-timetable table-responsive">
        <b-form
          method="POST"
          @submit.prevent="onLogin"
          @keydown="form.onKeydown($event)"
        >
          <table class="table table-striped table-sm align-table">
            <thead class="">
              <tr>
                <th scope="col">S/N</th>
                <th scope="col">Name</th>
                <th scope="col">Subject</th>
                <th scope="col">ADM No.</th>
                <th scope="col">1ST (CA) 20%</th>
                <th scope="col">2ND (CA) 20%</th>
                <th scope="col">Exam 60%</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(mark, value) in markx" :key="mark.id">
                <td>{{ value + 1 }}</td>

                <td>
                  {{ mark.student.first_name }} {{ mark.student.last_name }}
                </td>
                <td>{{ mark.subject.subject }}</td>

                <td>{{ mark.student.adm_no }}</td>
                <td scope="row">
                  <input
                    v-model="mark.ca1"
                    type="number"
                    min="0"
                    max="20"
                    @input="sendScores(mark, $event.target.value, 'ca1')"
                  />
                </td>
                <td scope="row">
                  <input
                    v-model="mark.ca2"
                    type="number"
                    min="0"
                    max="20"
                    @input="sendScores(mark, $event.target.value, 'ca2')"
                  />
                </td>
                <td scope="row">
                  <input
                    v-model="mark.exam"
                    type="number"
                    min="0"
                    max="60"
                    @input="sendScores(mark, $event.target.value, 'exam')"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div class="d-flex justify-content-center mt-4">
            <b-button size="md" type="submit" variant="success" :disabled="busy"
              ><b-spinner
                v-if="busy"
                variant="light"
                small
                class="mr-1 mb-1"
              />Add Scores</b-button
            >
          </div>
        </b-form>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import Swal from 'sweetalert2'
import { CREATE_ROW_MUTATION } from '~/graphql/marks/mutations'
export default {
  props: {
    marks: null,
    student: Array,
  },
  data() {
    return {
      scores: [],
      search: '',
      busy: false,
      form: new this.$form({}),
    }
  },
  computed: {
    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
    markx() {
      return this.marks.filter((t) => {
        return (
          t.student.first_name.toLowerCase().match(this.search.toLowerCase()) ||
          t.student.last_name.toLowerCase().match(this.search.toLowerCase())
        )
      })
    },
  },
  methods: {
    sendScores(mark, value, keyName) {
      const index = this.scores.findIndex((score) => score.markId === mark.id)

      if (index === -1) {
        this.scores = [
          ...this.scores,
          {
            markId: mark.id,
            [keyName]: value,
          },
        ]
      } else {
        this.scores = [
          ...this.scores.slice(0, index),
          {
            ...this.scores[index],
            [keyName]: value,
          },
          // to account for the remainder
          ...this.scores.slice(index + 1),
        ]
      }
    },
    onLogin() {
      this.busy = true
      this.$apollo
        .mutate({
          mutation: CREATE_ROW_MUTATION,
          variables: {
            marks: this.scores,
            klase_id: parseInt(this.student[0]),
            subject_id: parseInt(this.student[1]),
            term_id: parseInt(this.student[2]),
            session_id: parseInt(this.student[3]),
            section_id: parseInt(this.student[4]),
            workspaceId: parseInt(this.mainWorkspace.id),
          },
        })
        .then(() => {
          Swal.fire({
            title: 'Good',
            icon: 'success',
            text: 'Students scores added successfully',
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

<style lang="scss">
.exam-scores {
  background-color: var(--color-white);
  .exam-timetable {
    input {
      width: 60px;
      text-align: center;
    }
  }

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
}
</style>
