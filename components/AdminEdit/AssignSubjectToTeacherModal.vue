<template>
  <div>
    <b-modal
      size="lg"
      centered
      :value="value"
      :visible="value"
      hide-footer
      title="Edit Data"
      :hide-backdrop="false"
      @change="$emit('input', $event)"
    >
      <div class="mt-4 p-2">
        <b-form
          method="POST"
          @submit.prevent="updateAssignSubjectToTeacher"
          @keydown="form.onKeydown($event)"
        >
          <b-row class="mb-4">
            <b-col md="6">
              <b-form-group label="Subjects">
                <b-form-select
                  id="subjects"
                  v-model="form.subjectId"
                  value-field="id"
                  text-field="subject"
                  :options="subjects"
                  required
                  class="mb-3"
                  size="lg"
                >
                </b-form-select>
              </b-form-group>
            </b-col>

            {{ form.teacherId }}

            <b-col md="6">
              <b-form-group label="Assign Teacher">
                <b-form-select v-model="form.teacherId" class="mb-3">
                  <b-form-select-option
                    v-for="teacher in teachers"
                    :key="teacher.id"
                    :value="teacher.id"
                    >{{ teacher.last_name }} {{ teacher.first_name }}
                  </b-form-select-option>

                  <template #first>
                    <b-form-select-option :value="null" disabled
                      >-- select teacher--</b-form-select-option
                    >
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-row>

          <div class="text-center mt-2 mb-4">
            <b-button
              type="submit"
              variant="primary"
              style="width: 100%"
              class="mr-4"
              :disabled="form.busy"
              size="md"
            >
              <b-spinner
                v-if="form.busy"
                variant="light"
                class="mr-1 mb-1"
                small
              />Submit</b-button
            >
          </div>
        </b-form>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import { KLASE_QUERIES } from '~/graphql/klases/queries'
import { SECTION_QUERIES } from '~/graphql/sections/queries'
import { TEACHERS_QUERIES } from '~/graphql/teachers/queries'
import { SUBJECT_QUERIES } from '~/graphql/subjects/queries'
import { UPDATE_ASSIGN_SUBJECT_TO_TEACHER_MUTATION } from '~/graphql/teachers/mutations'
import Swal from 'sweetalert2'
export default {
  props: {
    assignToTeacher: {
      type: Object,
      required: false,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isBusy: false,
      subjects: [],
      klases: [],
      form: new this.$form({
        id: null,
        class: null,
        section: null,
        teacherId: null,
        subjectId: null,
        busy: false,
      }),
    }
  },
  created() {
    this.setAssignToTeacher(this.assignToTeacher)
  },

  watch: {
    assignToTeacher(newAssignToTeacher) {
      this.setAssignToTeacher(newAssignToTeacher)
    },
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

    teachers: {
      query: TEACHERS_QUERIES,
      variables() {
        return {
          workspaceId: parseInt(this.mainWorkspace.id),
        }
      },
    },
    subjects: {
      query: SUBJECT_QUERIES,
      variables() {
        return {
          workspaceId: parseInt(this.mainWorkspace.id),
          klase_id: parseInt(this.form.class),
          section_id: parseInt(this.form.section),
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
    setAssignToTeacher(assignToTeacher) {
      this.form.id = assignToTeacher.id
      this.form.class = assignToTeacher.klase.id
      this.form.section = assignToTeacher.section.id
      this.form.teacherId = assignToTeacher.teacher.id
      this.form.subjectId = assignToTeacher.subject.id
    },
    updateAssignSubjectToTeacher() {
      this.form.busy = true
      this.$apollo
        .mutate({
          mutation: UPDATE_ASSIGN_SUBJECT_TO_TEACHER_MUTATION,
          variables: {
            id: parseInt(this.form.id),
            teacherId: parseInt(this.form.teacherId),
            subjectId: parseInt(this.form.subjectId),
          },
        })
        .then(() => {
          this.form.busy = false

          Swal.fire({
            timer: 1500,
            text: 'field added successfully',
            position: 'top-right',
            color: '#fff',
            background: '#4bb543',
            toast: false,
            backdrop: false,
            showConfirmButton: false,
          })
          this.$emit('input', false)
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
  },
}
</script>
