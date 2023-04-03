<template>
  <div>
    <b-modal
      size="lg"
      centered
      :value="value"
      :visible="value"
      hide-footer
      title="Edit Subject"
      :hide-backdrop="false"
      @change="$emit('input', $event)"
    >
      <div class="mt-4 p-2">
        <b-form
          method="POST"
          @submit.prevent="onSubmit"
          @keydown="form.onKeydown($event)"
          @reset.prevent="onReset"
        >
          <!-- description -->
          <b-row no-gutters>
            <b-col md="2">
              <label
                for="input-small"
                class="label-padding"
                style="font-size: 18px"
                >Name:</label
              >
            </b-col>

            <b-col md="4">
              <b-form-group>
                <b-form-input
                  v-model="form.subject"
                  placeholder="Enter subject"
                  type="text"
                  required
                  size="lg"
                ></b-form-input>
                <b-form-invalid-feedback :state="!form.errors.has('subject')">
                  {{ form.errors.get('subject') }}
                </b-form-invalid-feedback>
              </b-form-group>

              <b-form-group>
                <b-form-input
                  v-model="form.subject_code"
                  placeholder="Enter subject code"
                  type="text"
                  required
                  size="lg"
                ></b-form-input>
                <b-form-invalid-feedback
                  :state="!form.errors.has('subject_code')"
                >
                  {{ form.errors.get('subject_code') }}
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
                />Edit Subject</b-button
              >
            </b-col>
          </b-row>
        </b-form>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import Swal from 'sweetalert2'
import { UPDATE_SUBJECT_MUTATION } from '~/graphql/subjects/mutations'
export default {
  props: {
    subject: {
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
      form: new this.$form({
        id: null,
        subject: null,
        subject_code: null,
        busy: false,
      }),
    }
  },
  created() {
    this.setSubject(this.subject)
  },

  watch: {
    subject(newSubject) {
      this.setSubject(newSubject)
    },
  },

  computed: {
    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
  },

  methods: {
    setSubject(subject) {
      this.form.id = subject.id
      this.form.subject = subject.subject
      this.form.subject_code = subject.subject_code
    },

    // ------- edit ----//
    onSubmit() {
      this.form.busy = true
      this.$apollo
        .mutate({
          mutation: UPDATE_SUBJECT_MUTATION,
          variables: {
            id: parseInt(this.form.id),
            subject: this.form.subject,
            subject_code: this.form.subject_code,
            workspaceId: parseInt(this.mainWorkspace.id),
          },
        })
        .then(() => {
          Swal.fire({
            text: `subject updated successfully!`,
            position: 'top-right',
            color: '#fff',
            background: '#5cb85c',
            toast: false,
            backdrop: false,
            timer: 1500,
            showConfirmButton: false,
          })
          this.form.busy = false
          this.$emit('input', false)
        })
        .catch(() => {
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
  },
}
</script>
