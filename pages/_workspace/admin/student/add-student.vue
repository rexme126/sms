<template>
  <div class="student p-3">
    <template v-if="nowLoading">
      <Preload />
    </template>
    <template v-else>
      <b-button
        :to="{
          name: 'workspace-admin-student',
          params: { workspace: mainWorkspace.slug },
        }"
        variant="primary"
        size="md"
        class="add-student mb-4"
      >
        <b-icon icon="arrow-left" /> Back
      </b-button>
      <div class="p-4 student__wrapper">
        <b-form
          v-if="show"
          method="POST"
          @submit.prevent="onSubmit"
          @keydown="form.onKeydown($event)"
          @reset.prevent="onReset"
        >
          <div class="d-flex flex-column align-items-center mb-4">
            <div class="profile-avatar mb-2">
              <div v-if="preview_url == null" class="photo-preview">
                <img
                  src="@/assets/svg/graduate-student.svg"
                  alt=""
                  style="border-radius: 50%"
                />
              </div>
              <div
                v-else
                class="photo-preview"
                :style="{
                  backgroundImage: `url(${preview_url})`,
                }"
              ></div>

              <b-form-group>
                <div class="file-upload">
                  <b-button
                    variant="white"
                    class="shadow-sm"
                    size="sm"
                    pill
                    @click="selectImage"
                  >
                    <b-icon icon="camera-fill" />
                  </b-button>
                  <input
                    id="avatar"
                    ref="Avatar"
                    type="file"
                    accept="image"
                    class="file-upload__input"
                    hidden
                    @change="handleFileUpload()"
                  />
                </div>
                <b-form-invalid-feedback :state="!form.errors.has('photo')">
                  {{ form.errors.get('photo') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </div>

            <div class="text-center">
              <p class="small mb-2">
                Recommended size: Less than 2MB (150 x 150)
              </p>
              <b-button
                variant="outline-primary"
                size="md"
                class="px-3"
                pill
                @click="selectImage"
              >
                Upload photo
              </b-button>
            </div>
          </div>

          <!--  -->
          <b-row class="p-4">
            <b-col md="4" class="p-4">
              <b-form-group label="First Name">
                <b-form-input
                  id="firstName"
                  v-model="form.student.first_name"
                  debounce="500"
                  name="first_name"
                  size="lg"
                  placeholder="Enter First name"
                  trim
                  required
                ></b-form-input>
                <b-form-invalid-feedback
                  :state="!form.errors.has('student.first_name')"
                >
                  {{ form.errors.get('student.first_name') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col md="4" class="p-4">
              <b-form-group label="Last Name">
                <b-form-input
                  id="last_name"
                  v-model="form.student.last_name"
                  debounce="500"
                  name="lastName"
                  size="lg"
                  placeholder="Enter Last name"
                  trim
                  required
                ></b-form-input>
                <b-form-invalid-feedback
                  :state="!form.errors.has('student.last_name')"
                >
                  {{ form.errors.get('student.last_name') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>

            <b-col md="4" class="p-4">
              <b-form-group label="Middle Name (optional)">
                <b-form-input
                  id="middle_name"
                  v-model="form.student.middle_name"
                  debounce="500"
                  name="middle_name"
                  size="lg"
                  placeholder="Enter Middle name"
                  trim
                ></b-form-input>
              </b-form-group>
            </b-col>

            <b-col md="3" class="p-4">
              <b-form-group label="Email">
                <b-form-input
                  id="email"
                  v-model="form.userStudent.email"
                  debounce="500"
                  name="email"
                  size="lg"
                  type="email"
                  placeholder="Enter email"
                  trim
                  required
                ></b-form-input>
                <b-form-invalid-feedback
                  :state="!form.errors.has('studentUser.email')"
                >
                  {{ form.errors.get('studentUser.email') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>

            <b-col md="3" class="p-4">
              <b-form-group label="Phone No.">
                <b-form-input
                  id="phone"
                  v-model="form.student.phone"
                  name="phone"
                  placeholder="Enter phone no."
                  min="1234567899"
                  max="12345678919"
                  trim
                  type="number"
                  size="lg"
                  required
                ></b-form-input>
                <b-form-invalid-feedback
                  :state="!form.errors.has('student.phone')"
                >
                  {{ form.errors.get('student.phone') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>

            <b-col md="3" class="p-4">
              <b-form-group label="Guardian Name">
                <b-form-input
                  id="guardian_name"
                  v-model="form.student.guardian_name"
                  name="guardian_name"
                  placeholder="Enter guardian_name"
                  trim
                  type="text"
                  size="lg"
                  required
                ></b-form-input>
                <b-form-invalid-feedback
                  :state="!form.errors.has('student.guardian_name')"
                >
                  {{ form.errors.get('student.guardian_name') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>

            <b-col md="3" class="p-4">
              <b-form-group label="Guardian Email">
                <b-form-input
                  id="guardian_email"
                  v-model="form.student.guardian_email"
                  name="guardian_email"
                  placeholder="Enter guardian email"
                  trim
                  type="email"
                  size="lg"
                  required
                ></b-form-input>
                <b-form-invalid-feedback
                  :state="!form.errors.has('student.guardian_email')"
                >
                  {{ form.errors.get('student.guardian_email') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>

            <b-col md="6" class="p-4">
              <b-form-group label="Address">
                <b-form-input
                  id="address"
                  v-model="form.student.address"
                  debounce="500"
                  name="address"
                  size="lg"
                  placeholder="Enter address"
                  required
                ></b-form-input>
                <b-form-invalid-feedback
                  :state="!form.errors.has('student.address')"
                >
                  {{ form.errors.get('student.address') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>

            <b-col md="3" class="p-4">
              <b-form-group label="Guardian no.">
                <b-form-input
                  id="guardian_no"
                  v-model="form.student.guardian_no"
                  name="guardian_no"
                  placeholder="Enter guardian number"
                  min="1234567899"
                  max="12345678919"
                  trim
                  type="number"
                  size="lg"
                  required
                ></b-form-input>
                <b-form-invalid-feedback
                  :state="!form.errors.has('student.guardian_no')"
                >
                  {{ form.errors.get('student.guardian_no') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>

            <b-col md="3" class="p-4">
              <b-form-group label="Admission no.">
                <b-form-input
                  id="adm_no"
                  v-model="form.student.adm_no"
                  name="adm_no"
                  placeholder="Enter Admission number"
                  trim
                  type="text"
                  size="lg"
                  required
                ></b-form-input>
                <b-form-invalid-feedback
                  :state="!form.errors.has('student.adm_no')"
                >
                  {{ form.errors.get('student.adm_no') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>

            <b-col md="3" class="p-4">
              <b-form-group label="Admitted Year">
                <b-form-input
                  id="admitted_year"
                  v-model="form.student.admitted_year"
                  name="adm_no"
                  placeholder="Enter admitted year"
                  trim
                  type="number"
                  size="lg"
                  required
                ></b-form-input>
                <b-form-invalid-feedback
                  :state="!form.errors.has('student.admitted_year')"
                >
                  {{ form.errors.get('student.admitted_year') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>

            <b-col md="3" class="p-4">
              <b-form-group label="Religion">
                <b-form-input
                  id="religion"
                  v-model="form.userStudent.religion"
                  name="religion"
                  placeholder="Enter religion"
                  trim
                  type="text"
                  size="lg"
                  required
                ></b-form-input>
                <b-form-invalid-feedback
                  :state="!form.errors.has('studentUser.religion')"
                >
                  {{ form.errors.get('studentUser.religion') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>

            <b-col md="3" class="p-4">
              <b-form-group label="Gender">
                <b-form-select
                  v-model="form.student.gender"
                  :options="genders"
                  class="mb-3"
                  size="lg"
                  required
                >
                  <!-- This slot appears above the options from 'options' prop -->
                  <template #first>
                    <b-form-select-option :value="null" disabled
                      >-- Please select gender --</b-form-select-option
                    >
                  </template>

                  <!-- These options will appear after the ones from 'options' prop -->
                </b-form-select>
              </b-form-group>
            </b-col>

            <b-col md="3" class="p-4">
              <b-form-group label="Blood Group">
                <b-form-select
                  id="bloodGroups"
                  v-model="form.userStudent.bloodGroup"
                  value-field="id"
                  text-field="name"
                  :options="bloodGroups"
                  class="mb-3"
                  size="lg"
                >
                  <!-- This slot appears above the options from 'options' prop -->
                  <template #first>
                    <b-form-select-option :value="null" disabled
                      >-- Please select blood Group--</b-form-select-option
                    >
                  </template>

                  <!-- These options will appear after the ones from 'options' prop -->
                </b-form-select>
              </b-form-group>
            </b-col>

            <b-col md="5" class="p-4">
              <b-form-group label="Date of Birth">
                <b-form-datepicker
                  id="datepicker-buttons"
                  v-model="form.student.birthday"
                  today-button
                  reset-button
                  close-button
                  locale="en"
                  size="lg"
                  name="birthday"
                ></b-form-datepicker>
                <b-form-invalid-feedback
                  :state="!form.errors.has('student.birthday')"
                >
                  {{ form.errors.get('student.birthday') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>

            <b-col md="4" class="p-4">
              <b-form-group label="Current Class">
                <b-form-select
                  id="klases"
                  v-model="form.student.klase"
                  value-field="id"
                  text-field="name"
                  :options="klases"
                  class="mb-3"
                  size="lg"
                  required
                >
                  <!-- This slot appears above the options from 'options' prop -->
                  <template #first>
                    <b-form-select-option :value="null" disabled
                      >-- Please select class--</b-form-select-option
                    >
                  </template>

                  <!-- These options will appear after the ones from 'options' prop -->
                </b-form-select>
              </b-form-group>
            </b-col>

            <b-col md="3" class="p-4">
              <b-form-group label="Current Term">
                <b-form-select
                  v-model="form.student.term"
                  :options="terms"
                  class="mb-3"
                  size="lg"
                  value-field="id"
                  text-field="name"
                  required
                >
                  <!-- This slot appears above the options from 'options' prop -->
                  <template #first>
                    <b-form-select-option :value="null" disabled
                      >-- Please select term--</b-form-select-option
                    >
                  </template>

                  <!-- These options will appear after the ones from 'options' prop -->
                </b-form-select>
              </b-form-group>
            </b-col>

            <b-col md="4">
              <b-form-group label="Section">
                <b-form-select
                  id="sections"
                  v-model="form.student.section"
                  value-field="id"
                  text-field="name"
                  :options="sections"
                  required
                  class="mb-3"
                  size="lg"
                >
                  <!-- This slot appears above the options from 'options' prop -->
                  <template #first>
                    <b-form-select-option :value="null" disabled
                      >-- select section--</b-form-select-option
                    >
                  </template>

                  <!-- These options will appear after the ones from 'options' prop -->
                </b-form-select>
              </b-form-group>
            </b-col>

            <b-col md="4">
              <b-form-group label="Session">
                <b-form-select
                  id="sessions"
                  v-model="form.student.session"
                  value-field="id"
                  text-field="name"
                  :options="sessions"
                  required
                  class="mb-3"
                  size="lg"
                >
                  <!-- This slot appears above the options from 'options' prop -->
                  <template #first>
                    <b-form-select-option :value="null" disabled
                      >-- select session--</b-form-select-option
                    >
                  </template>

                  <!-- These options will appear after the ones from 'options' prop -->
                </b-form-select>
              </b-form-group>
            </b-col>

            <b-col md="4">
              <b-form-group label="Country">
                <b-form-select
                  id="country"
                  v-model="form.userStudent.country"
                  value-field="id"
                  text-field="name"
                  :options="countries"
                  class="mb-3"
                  size="lg"
                  required
                >
                  <!-- This slot appears above the options from 'options' prop -->
                  <template #first>
                    <b-form-select-option :value="null" disabled
                      >-- Please select country --</b-form-select-option
                    >
                  </template>

                  <!-- These options will appear after the ones from 'options' prop -->
                </b-form-select>
              </b-form-group>
            </b-col>

            <b-col md="4" class="p-4">
              <div v-if="!country">
                <b-form-group label="State">
                  <b-form-select class="mb-3">
                    <b-form-select-option value="null"> </b-form-select-option>
                  </b-form-select>
                </b-form-group>
              </div>

              <div v-else>
                <b-form-group label="State">
                  <b-form-select
                    v-model="form.userStudent.state"
                    class="mb-3"
                    required
                  >
                    <b-form-select-option
                      v-for="k in country.state"
                      :key="k.id"
                      :value="k.id"
                      >{{ k.name }}</b-form-select-option
                    >
                  </b-form-select>
                </b-form-group>
              </div>
            </b-col>

            <b-col md="4" class="p-4">
              <b-form-group id="input-group-1" label="City">
                <b-form-input
                  id="city"
                  v-model="form.userStudent.city"
                  type="text"
                  placeholder="Enter city"
                  name="city"
                  required
                ></b-form-input>
                <b-form-invalid-feedback
                  :state="!form.errors.has('userStudent.city')"
                >
                  {{ form.errors.get('userStudent.city') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>

            <b-col md="4" class="p-4">
              <b-form-group label="L.G.A">
                <b-form-input
                  id="lga"
                  v-model="form.userStudent.lga"
                  name="lga"
                  placeholder="Enter lga"
                  type="text"
                  size="lg"
                  required
                ></b-form-input>
                <b-form-invalid-feedback
                  :state="!form.errors.has('studentUser.lga')"
                >
                  {{ form.errors.get('studentUser.lga') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>

            <b-col md="8" class="p-3">
              <b-form-group label="Guardian Address">
                <b-form-textarea
                  id="guardian_address"
                  v-model="form.student.guardian_address"
                  rows="10"
                  max-rows="8"
                  size="lg"
                  required
                ></b-form-textarea>

                <b-form-invalid-feedback
                  :state="!form.errors.has('student.guardian_address')"
                >
                  {{ form.errors.get('student.guardian_address') }}
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>

            <b-col md="12" class="d-flex justify-content-center p-4 mt-2 mb-4"
              ><b-button
                type="submit"
                pill
                variant="primary"
                class="mr-4"
                :disabled="form.busy"
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
              ></b-col
            >
          </b-row>
        </b-form>
      </div></template
    >
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import Swal from 'sweetalert2'
import {
  BLOOD_GROUP_QUERIES,
  COUNTRY_QUERIES,
  COUNTRY_QUERY,
  STATE_QUERY,
} from '~/graphql/users/queries'
import { CREATE_STUDENT_MUTATION } from '~/graphql/students/mutations'
import { KLASE_QUERIES } from '~/graphql/klases/queries'
import { TERM_QUERIES } from '~/graphql/marks/queries'
import { SECTION_QUERIES } from '~/graphql/sections/queries'
import { SESSION_QUERIES } from '~/graphql/sessions/queries'
import Preload from '~/components/Preload.vue'

export default {
  components: { Preload },
  middleware: 'auth',
  data() {
    return {
      countries: [],
      bloodGroups: [],
      form: new this.$form({
        userStudent: {
          country: null,
          state: null,
          city: null,
          lga: null,
          email: null,
          bloodGroup: null,
          religion: null,
        },
        student: {
          first_name: '',
          last_name: '',
          middle_name: null,
          gender: null,
          birthday: null,
          phone: null,
          klase: null,
          photo: null,
          guardian_name: null,
          guardian_no: null,
          guardian_email: null,
          guardian_address: null,
          adm_no: null,
          term: null,
          section: null,
          session: null,
          address: null,
          admitted_year: null,
        },
        busy: false,
      }),
      preview_url: null,
      genders: ['Male', 'Female'],
      show: true,
    }
  },

  apollo: {
    // Simple query that will update the 'hello' vue property
    $loadingKey: 'loading',
    countries: {
      query: COUNTRY_QUERIES,
    },
    bloodGroups: {
      query: BLOOD_GROUP_QUERIES,
    },
    country: {
      query: COUNTRY_QUERY,
      variables() {
        return { id: this.form.userStudent.country }
      },
    },
    state: {
      query: STATE_QUERY,
      variables() {
        return { id: this.form.userStudent.state }
      },
    },
    klases: {
      query: KLASE_QUERIES,
      variables() {
        return {
          workspaceId: parseInt(this.mainWorkspace.id),
        }
      },
    },
    terms: {
      query: TERM_QUERIES,
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
          klase_id: parseInt(this.form.student.klase),
        }
      },
    },
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
    nowLoading() {
      return (
        this.$apollo.queries.countries.loading &&
        this.$apollo.queries.bloodGroups.loading &&
        this.$apollo.queries.terms.loading &&
        this.$apollo.queries.klases.loading
      )
    },
    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
  },
  methods: {
    selectImage() {
      this.$refs.Avatar.click()
    },
    handleFileUpload() {
      const input = this.$refs.Avatar
      const file = input.files[0]
      if (!file) return
      const reader = new FileReader()

      reader.onload = (e) => {
        this.preview_url = e.target.result
      }
      reader.readAsDataURL(file)
      this.form.photo = file

      this.isValidFile(file)
    },

    isValidFile(file) {
      const imageFormats = ['image/png', 'image/jpeg', 'image/jpg']

      const inValidType = !imageFormats.includes(file.type)

      if (inValidType) {
        Swal.fire({
          icon: 'error',
          title: 'Oops..',
          text: 'Please upload a valid image',
          timer: 1500,
          color: '#716add',
          backdrop: '#7a7d7f',
        })
        return false
      }

      const size = file.size / 1000
      if (imageFormats.includes(file.type) && size > 2240) {
        Swal.fire({
          icon: 'error',
          title: 'Oops..',
          text: 'Image size must not exceed 5MB',
          color: '#716add',
          backdrop: '#7a7d7f',
        })

        return false
      }

      return true
    },
    async onSubmit() {
      this.form.busy = true
      // submit exam
      try {
        await this.$apollo
          .mutate({
            mutation: CREATE_STUDENT_MUTATION,
            variables: {
              workspaceId: parseInt(this.mainWorkspace.id),
              studentUser: this.form.userStudent,
              student: this.form.student,
            },
          })
          .then(() => {
            Swal.fire({
              timer: 1500,
              text: 'student added has been saved',
              position: 'top-right',
              color: '#fff',
              background: '#4bb543',
              toast: false,
              backdrop: false,
              showConfirmButton: false,
            })
            this.$router.push({
              name: 'workspace-admin-student',
              params: { workspace: this.mainWorkspace.slug },
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

<style lang="scss" scoped>
.student {
  .grow {
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
  }
  .profile-avatar {
    position: relative;
    text-align: center;
    width: 100px;
    height: 100px;

    .photo-preview {
      width: 100px;
      height: 100px;
      background-size: cover;
      background-repeat: no-repeat;
      border-radius: 50%;
    }

    .file-upload {
      position: absolute;
      display: block;
      cursor: pointer;
      bottom: 0;
      right: -5px;
      padding: 4px;
      background: white;
      border-radius: 50%;

      .btn {
        background-color: white;
        border: 1px solid $gray-200;
      }
    }

    .file-upload__input {
      display: none;
    }
    .img-round {
      border-radius: 50%;
    }
  }

  .student__wrapper {
    background-color: var(--color-white);
    border-radius: 5px;
    border: none;
  }
}
</style>
