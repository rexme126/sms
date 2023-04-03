<template>
  <div class="school p-3 shadow-sm">
    <b-card class="school__wrapper">
      <h3 class="text-center mb-4 mt-4">Create School</h3>
      <hr />
      <b-form
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

        <b-row class="p-3">
          <b-col md="4" class="p-3">
            <b-form-group label="School Name">
              <b-form-input
                id="name"
                v-model="form.name"
                debounce="500"
                name="name"
                size="lg"
                placeholder="Enter school name"
                required
              ></b-form-input>
              <b-form-invalid-feedback :state="!form.errors.has('name')">
                {{ form.errors.get('name') }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>

          <b-col md="4" class="p-3">
            <b-form-group label="slug">
              <b-form-input
                id="slug"
                v-model="form.slug"
                debounce="500"
                name="name"
                size="lg"
                placeholder="Enter slug"
                trim
                required
              ></b-form-input>
              <b-form-invalid-feedback :state="!form.errors.has('slug')">
                {{ form.errors.get('slug') }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>

          <b-col md="4" class="p-3">
            <b-form-group label="First Name">
              <b-form-input
                id="first_name"
                v-model="form.first_name"
                debounce="500"
                name="first_name"
                size="lg"
                placeholder="Enter first name"
                trim
                required
              ></b-form-input>
              <b-form-invalid-feedback :state="!form.errors.has('first_name')">
                {{ form.errors.get('first_name') }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>

          <b-col md="4" class="p-3">
            <b-form-group label="Last Name">
              <b-form-input
                id="last_name"
                v-model="form.last_name"
                debounce="500"
                name="last_name"
                size="lg"
                placeholder="Enter last name"
                trim
                required
              ></b-form-input>
              <b-form-invalid-feedback :state="!form.errors.has('last_name')">
                {{ form.errors.get('last_name') }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>

          <b-col md="4" class="p-3">
            <b-form-group label="email">
              <b-form-input
                id="email"
                v-model="form.email"
                debounce="500"
                name="email"
                type="email"
                size="lg"
                placeholder="Enter email"
                trim
                required
              ></b-form-input>
              <b-form-invalid-feedback :state="!form.errors.has('email')">
                {{ form.errors.get('email') }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>

          <b-col md="4" class="p-3">
            <b-form-group label="Phone No.">
              <b-form-input
                id="phone"
                v-model="form.phone"
                debounce="500"
                name="phone"
                type="number"
                min="1234567899"
                max="12345678919"
                size="lg"
                placeholder="Enter phone number"
                trim
                required
              ></b-form-input>
              <b-form-invalid-feedback :state="!form.errors.has('phone')">
                {{ form.errors.get('phone') }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>

          <b-col md="3" class="p-3">
            <b-form-group label="Gender">
              <b-form-select
                v-model="form.gender"
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

          <b-col md="3" class="p-3">
            <b-form-group label="Number of students">
              <b-form-select
                v-model="form.numStudentId"
                :options="numStudents"
                value-field="id"
                text-field="name"
                class="mb-3"
                size="lg"
                required
              >
                <!-- This slot appears above the options from 'options' prop -->
                <template #first>
                  <b-form-select-option :value="null" disabled
                    >-- Please student number --</b-form-select-option
                  >
                </template>

                <!-- These options will appear after the ones from 'options' prop -->
              </b-form-select>
            </b-form-group>
          </b-col>

          <b-col md="3" class="p-3">
            <b-form-group label="Country">
              <b-form-select
                id="country"
                v-model="form.country"
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

          <b-col md="3" class="p-3">
            <div v-if="!country">
              <b-form-group label="State">
                <b-form-select class="mb-3">
                  <b-form-select-option value="null"> </b-form-select-option>
                </b-form-select>
              </b-form-group>
            </div>

            <div v-else>
              <b-form-group label="State">
                <b-form-select v-model="form.state" class="mb-3">
                  <b-form-select-option
                    v-for="k in country.state"
                    :key="k.id"
                    :value="k.id"
                    required
                    >{{ k.name }}</b-form-select-option
                  >
                </b-form-select>
              </b-form-group>
            </div>
          </b-col>

          <b-col md="3" class="p-3">
            <b-form-group id="city" label="City">
              <b-form-input
                id="city"
                v-model="form.city"
                type="text"
                placeholder="Enter city"
                name="city"
                required
              ></b-form-input>
              <b-form-invalid-feedback :state="!form.errors.has('city')">
                {{ form.errors.get('city') }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>

          <b-col md="3" class="p-3">
            <b-form-group id="input-group-1" label="L.G.A">
              <b-form-input
                id="lga"
                v-model="form.lga"
                type="text"
                placeholder="Enter L.G.A"
                name="lga"
                required
              ></b-form-input>
              <b-form-invalid-feedback :state="!form.errors.has('lga')">
                {{ form.errors.get('lga') }}
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>

          <b-col md="12" class="d-flex justify-content-center p-3 mt-2 mb-4"
            ><b-button
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
            <b-button pill class="ml-4" size="md" type="reset" variant="danger"
              >Reset</b-button
            ></b-col
          >
        </b-row>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import Swal from 'sweetalert2'
import {
  COUNTRY_QUERIES,
  COUNTRY_QUERY,
  STATE_QUERY,
} from '~/graphql/users/queries'
import { CREATE_SCHOOL_MUTATION } from '~/graphql/workspace/mutations'
import { SCHOOL_STUDENT_NUMBER_QUERIES } from '~/graphql/workspace/queries'

export default {
  middleware: 'auth',
  data() {
    return {
      preview_url: null,
      form: new this.$form({
        name: '',
        slug: null,
        email: '',
        last_name: '',
        first_name: '',
        phone: null,
        numStudentId: null,
        country: null,
        state: null,
        city: null,
        gender: null,
        lga: null,
        photo: null,
        busy: false,
      }),
      genders: ['Male', 'Female'],
    }
  },

  apollo: {
    countries: {
      query: COUNTRY_QUERIES,
    },
    country: {
      query: COUNTRY_QUERY,
      variables() {
        return { id: this.form.country }
      },
    },
    state: {
      query: STATE_QUERY,
      variables() {
        return { id: this.form.state }
      },
    },
    numStudents: {
      query: SCHOOL_STUDENT_NUMBER_QUERIES,
    },
  },

  computed: {
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
            mutation: CREATE_SCHOOL_MUTATION,
            variables: {
              name: this.form.name,
              slug: this.form.slug,
              email: this.form.email,
              phone: this.form.phone,
              last_name: this.form.last_name,
              first_name: this.form.first_name,
              gender: this.form.gender,
              numStudentId: parseInt(this.form.numStudentId),
              country: parseInt(this.form.country),
              state: parseInt(this.form.state),
              city: this.form.city,
              lga: this.form.lga,
              photo: this.form.photo,
            },
          })
          .then(() => {
            Swal.fire({
              timer: 1500,
              text: 'school created successfully',
              position: 'top-right',
              color: '#fff',
              background: '#4bb543',
              toast: false,
              backdrop: false,
              showConfirmButton: false,
            })
            this.form.busy = false
            this.$router.push({
              name: 'workspace-school',
              params: { workspace: this.mainWorkspace.name },
            })
          })
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
.school {
  .profile-avatar {
    position: relative;
    text-align: center;
    width: 10rem;
    height: 10rem;

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

  .school__wrapper {
    background-color: var(--color-white);
    border-radius: 0.5rem;
    border: none;
  }
}
</style>
