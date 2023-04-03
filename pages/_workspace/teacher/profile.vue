<template>
  <div class="p-3">
    <template v-if="$apollo.queries.user.loading"><Preload /></template>
    <template v-else>
      <b-button
        class="shadow-sm mb-3"
        variant="light"
        pill
        size="md"
        @click="changePassword"
        >Change Password</b-button
      >
      <b-card class="teacher shadow-sm">
        <div class="text-center mb-4">
          <div v-if="teacher.photo == 'null'">
            <b-img
              src="@/assets/svg/user-avatar.svg"
              fluid
              alt="teacher"
              width="200"
            ></b-img>
          </div>
          <div v-else>
            <b-img
              style="border-radius: 50%"
              :src="`${$config.APIRoot}/storage/${mainWorkspace.id}/teachers/${teacher.photo}`"
              thumbnail
              fluid
              alt="teacher"
              width="200"
            ></b-img>
          </div>
        </div>

        <div class="d-flex justify-content-between p-4">
          <div>
            <p>Full Name</p>
            <p>Phone no:</p>
            <p>Qualifications</p>
            <p>Registration Code</p>
            <p>Gender</p>

            <p>Date of Employment</p>
            <p>Blood Group</p>
            <p>Country</p>
            <p>State</p>
            <p>city</p>
            <p>L.G.A</p>
          </div>

          <div style="font-weight: bold">
            <p>
              {{ teacher.last_name }} {{ teacher.first_name }}
              {{ teacher.middle_name }}
            </p>
            <p>{{ teacher.phone }}</p>
            <p>{{ teacher.qualification }}</p>
            <p>{{ teacher.code }}</p>

            <p>{{ teacher.gender }}</p>
            <p>{{ teacher.employment }}</p>
            <p>
              {{ user.blood_group != null ? user.blood_group.name : '' }}
            </p>
            <p>
              {{ user.country.name }}
            </p>
            <p>
              {{ user.state.name }}
            </p>
            <p>
              {{ user.city }}
            </p>
            <p>
              {{ user.lga }}
            </p>
          </div>
        </div>
      </b-card>

      <!-- change password modal -->
      <b-modal id="passwordModal" size="md" centered hide-header hide-footer>
        <div class="p-5">
          <div class="form">
            <!-- description -->
            <b-form
              method="POST"
              @submit.prevent="onSubmit"
              @keydown="form.onKeydown($event)"
              @reset.prevent="onReset"
            >
              <!-- description -->
              <b-form-group label="Old Password">
                <b-form-input
                  v-model="form.oldPassword"
                  placeholder="Enter old Password"
                  type="password"
                  required
                  size="md"
                ></b-form-input>

                <span style="color: red">{{ oldPassword }}</span>
              </b-form-group>

              <b-form-group label="Password">
                <b-form-input
                  v-model="form.password"
                  placeholder="Enter Password"
                  type="password"
                  required
                  size="md"
                ></b-form-input>
              </b-form-group>

              <b-form-group label="Confirm Password">
                <b-form-input
                  class="validation"
                  v-model="confirmPassword"
                  placeholder="Comfirm password"
                  type="password"
                  required
                  size="md"
                  @input="changeColor"
                  :style="{ border: isGreen }"
                ></b-form-input>
                <span style="color: red">{{ passwordValidation }}</span>
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
                />Change Password</b-button
              >
            </b-form>
          </div>
        </div>
      </b-modal>
    </template>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import { USER_TEACHER_QUERY } from '@/graphql/teachers/queries'
import Preload from '~/components/Preload.vue'
import { CHANGE_USER_PASSWORD_MUTATION } from '~/graphql/users/mutations'
import Swal from 'sweetalert2'

export default {
  components: { Preload },
  middleware: 'auth',
  data() {
    return {
      isGreen: '',
      passwordValidation: null,
      oldPassword: null,
      confirmPassword: '',
      form: new this.$form({
        oldPassword: '',
        password: '',
        busy: false,
      }),
    }
  },
  apollo: {
    user: {
      query: USER_TEACHER_QUERY,
      variables() {
        return {
          id: parseInt(this.$auth.user.id),
        }
      },
    },
  },
  computed: {
    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
    teacher() {
      return this.user.teacher
    },
  },
  methods: {
    changePassword() {
      this.$bvModal.show('passwordModal')
    },
    changeColor() {
      if (this.form.password != null) {
        if (this.confirmPassword == this.form.password) {
          this.isGreen = 2 + 'px solid green'
        } else {
          this.isGreen = 2 + 'px solid red'
        }
      }
    },
    onSubmit() {
      this.form.busy = true
      if (this.confirmPassword == this.form.password) {
        this.$apollo
          .mutate({
            mutation: CHANGE_USER_PASSWORD_MUTATION,
            variables: {
              id: parseInt(this.user.id),
              oldPassword: this.form.oldPassword,
              password: this.form.password,
            },
          })
          .then(({ data }) => {
            if (data.updateUserPassword == true) {
              Swal.fire({
                text: `password changed successfully!`,
                position: 'top-right',
                color: '#fff',
                background: '#5cb85c',
                toast: false,
                backdrop: false,
                timer: 1500,
                showConfirmButton: false,
              })
              this.confirmPassword = ''
              this.form.oldPassword = ''
              this.form.password = ''
              this.form.busy = false
              this.oldPassword = null

              this.passwordValidation = null
              this.isGreen = ''
              this.$bvModal.hide('passwordModal')
              return
            }

            this.oldPassword = 'Wrong user password entered.'
            if (this.confirmPassword == this.form.password) {
              this.passwordValidation = null
            } else {
              this.passwordValidation = 'Unmatched passwords'
            }
            this.form.busy = false
          })
      } else {
        this.passwordValidation = 'Unmatched passwords'
        this.form.busy = false
      }
    },
  },
}
</script>
