<template>
  <div class="p-3">
    <div class="settings">
      <template v-if="$apollo.queries.adminWorkspace.loading"
        ><Preload
      /></template>
      <template v-else>
        <div class="p-1 shadow-sm">
          <h4 class="ml-4 mt-4">Admin Settings</h4>

          <b-form
            v-if="show"
            method="POST"
            @submit.prevent="onSubmit"
            @keydown="form.onKeydown($event)"
            @reset.prevent="onReset"
          >
            <section class="p-4">
              <h4 class="text-center">Setup Media</h4>
              <hr />

              <div class="d-flex justify-content-around mb-4">
                <div>
                  <div class="profile-avatar mb-2">
                    <div v-if="preview_url_logo == null" class="photo-preview">
                      <img
                        v-if="logo == null"
                        src="@/assets/svg/logo.svg"
                        alt=""
                        style="border-radius: 50%"
                        width="100"
                      />
                      <img
                        v-else
                        :src="`${$config.APIRoot}/storage/${mainWorkspace.id}/logo/${logo}`"
                        alt=""
                        style="border-radius: 50%"
                        width="100"
                      />
                    </div>
                    <div
                      v-else
                      class="photo-preview"
                      :style="{
                        backgroundImage: `url(${preview_url_logo})`,
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
                      <b-form-invalid-feedback
                        :state="!form.errors.has('logo')"
                      >
                        {{ form.errors.get('logo') }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </div>

                  <div class="text-center">
                    <p class="small mb-2">
                      Recommended size: Less than 2MB (150 x 150)
                    </p>
                    <b-button
                      variant="outline-primary"
                      size="sm"
                      class="px-2"
                      pill
                      @click="selectImage"
                    >
                      Upload logo
                    </b-button>
                  </div>
                </div>
                <div>
                  <div class="profile-avatar mb-2">
                    <div v-if="preview_url_stamp == null" class="photo-preview">
                      <img
                        v-if="stamp == null"
                        src="@/assets/svg/stamp.svg"
                        alt=""
                        style="border-radius: 50%"
                      />

                      <img
                        v-else
                        :src="`${$config.APIRoot}/storage/${mainWorkspace.id}/stamp/${stamp}`"
                        alt=""
                        style="border-radius: 50%"
                        width="100"
                      />
                    </div>
                    <div
                      v-else
                      class="photo-preview"
                      :style="{
                        backgroundImage: `url(${preview_url_stamp})`,
                      }"
                    ></div>

                    <b-form-group>
                      <div class="file-upload">
                        <b-button
                          variant="white"
                          class="shadow-sm"
                          size="sm"
                          pill
                          @click="selectStamp"
                        >
                          <b-icon icon="camera-fill" />
                        </b-button>
                        <input
                          id="Stamp"
                          ref="Stamp"
                          type="file"
                          accept="image"
                          class="file-upload__input"
                          hidden
                          @change="handleStampUpload()"
                        />
                      </div>
                      <b-form-invalid-feedback
                        :state="!form.errors.has('stam')"
                      >
                        {{ form.errors.get('stamp') }}
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </div>

                  <div class="text-center">
                    <p class="small mb-2">
                      Recommended size: Less than 2MB (150 x 150)
                    </p>
                    <b-button
                      variant="outline-primary"
                      size="sm"
                      class="px-2"
                      pill
                      @click="selectStamp"
                    >
                      Upload stamp
                    </b-button>
                  </div>
                </div>
              </div>
            </section>

            <hr />

            <section class="online-payment px-4">
              <b-row>
                <b-col md="6">
                  <h5 class="p-3">Pay Through Bank</h5>

                  <div class="d-flex">
                    <label class="p-2">Account Name:</label>
                    <b-form-input
                      id="account_name"
                      v-model="form.account_name"
                      type="text"
                      placeholder="Account nane..."
                      style="height: 37px"
                      class="w-50 mb-4"
                      size="lg"
                    ></b-form-input>
                  </div>

                  <div class="d-flex">
                    <label class="p-2 mr-4">Account No:</label>
                    <b-form-input
                      id="account_no"
                      v-model="form.account_no"
                      type="number"
                      placeholder="Account no..."
                      style="height: 37px"
                      class="w-50 mb-4"
                      size="lg"
                    ></b-form-input>
                  </div>

                  <div class="d-flex">
                    <label class="p-2 mr-4">Bank Name</label>
                    <b-form-input
                      id="bank"
                      v-model="form.bank"
                      type="text"
                      placeholder="Bank name..."
                      name="bank"
                      style="height: 37px"
                      class="w-50"
                      size="lg"
                    ></b-form-input>
                  </div>
                </b-col>
                <b-col md="6">
                  <h5 class="mt-2">Pay With Card</h5>

                  <div class="d-flex image">
                    <b-img
                      src="@/assets/svg/visa.svg"
                      class="svg-image"
                    ></b-img>
                    <b-img
                      src="@/assets/svg/mastercard.svg"
                      class="svg-image"
                    ></b-img>
                  </div>

                  <!-- online payment -->
                  <div class="d-flex">
                    <label class="p-2 mr-1" style="white-space: nowrap"
                      >Secret key</label
                    >
                    <b-form-input
                      id="paystack_secret_key"
                      v-model="form.paystack_secret_key"
                      type="text"
                      placeholder="Paystack secret key"
                      name="paystack_secret_key"
                      style="height: 37px"
                      trim
                      size="lg"
                    ></b-form-input>

                    <b-form-invalid-feedback
                      :state="!form.errors.has('paystack_secret_key')"
                    >
                      {{ form.errors.get('paystack_secret_key') }}
                    </b-form-invalid-feedback>
                  </div>

                  <!--  -->
                  <div>
                    <b-form
                      method="POST"
                      @submit.prevent="initializePaystack()"
                      @keydown="form.onKeydown($event)"
                      @reset.prevent="onReset"
                    >
                      <div class="d-flex">
                        <label class="p-2 mr-4">Amount</label>
                        <b-form-input
                          id="amount"
                          v-model="form.amount"
                          value-field="id"
                          type="number"
                          placeholder="Enter amount..."
                          min="0"
                          style="height: 37px"
                          class="mb-3"
                          size="lg"
                        >
                        </b-form-input>
                      </div>

                      <b-button
                        type="submit"
                        variant="primary"
                        size="lg"
                        style="
                          height: 40px;
                          margin-top: 20px;
                          width: 100%;
                          font-weight: bold;
                        "
                        >Test Payment</b-button
                      >
                    </b-form>
                  </div>
                </b-col>
              </b-row>
            </section>
            <div class="px-3">
              <b-button
                type="submit"
                variant="warning"
                class="mr-4 mt-4 mb-3"
                size="lg"
                style="width: 100%; height: 40px"
              >
                <b-spinner
                  v-if="form.busy"
                  variant="light"
                  class="mr-1 mb-1"
                  small
                />Submit Sttings Information</b-button
              >
            </div>
          </b-form>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import Swal from 'sweetalert2'
import { ADMIN_WORKSPACE_QUERIES } from '~/graphql/workspace/queries'
import { UPDATE_SETTING_ADMIN_MUTATION } from '~/graphql/workspace/mutations'
import Preload from '~/components/Preload.vue'

export default {
  components: { Preload },
  middleware: 'auth',
  data() {
    return {
      preview_url_logo: null,
      preview_url_stamp: null,
      logo: null,
      stamp: null,
      amount: null,

      form: new this.$form({
        logo: null,
        stamp: null,
        bank: null,
        account_name: null,
        account_no: null,
        paystack_secret_key: null,
      }),
      show: true,
    }
  },
  apollo: {
    adminWorkspace: {
      query: ADMIN_WORKSPACE_QUERIES,
      variables() {
        return {
          workspaceId: parseInt(this.mainWorkspace.id),
          status: 1,
        }
      },
      result({ data, loading }) {
        if (!loading) {
          const adminWorkspace = data.adminWorkspace
          this.form.paystack_secret_key = adminWorkspace.paystack_secret_key
          this.logo = adminWorkspace.logo
          this.stamp = adminWorkspace.stamp
          this.form.bank = adminWorkspace.bank
          this.form.account_name = adminWorkspace.account_name
          this.form.account_no = adminWorkspace.account_no
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
    // logo
    selectImage() {
      this.$refs.Avatar.click()
    },
    handleFileUpload() {
      const input = this.$refs.Avatar
      const file = input.files[0]
      if (!file) return
      const reader = new FileReader()

      reader.onload = (e) => {
        this.preview_url_logo = e.target.result
      }
      reader.readAsDataURL(file)

      if (this.isValidFile(file) === false) {
        return
      } else {
        this.form.logo = file
      }
    },
    // end of logo
    // stamp
    selectStamp() {
      this.$refs.Stamp.click()
    },
    handleStampUpload() {
      const input = this.$refs.Stamp
      const file = input.files[0]
      if (!file) return
      const reader = new FileReader()

      reader.onload = (e) => {
        this.preview_url_stamp = e.target.result
      }
      reader.readAsDataURL(file)
      this.form.stamp = file

      this.isValidFile(file)
    },
    // end of stamp

    isValidFile(file) {
      const imageFormats = ['image/png', 'image/jpeg', 'image/jpg']

      const inValidType = !imageFormats.includes(file.type)

      if (inValidType) {
        Swal.fire({
          icon: 'error',
          title: 'Oops..',
          text: 'Please upload a valid image',
          timer: 1500,
          showConfirmButton: false,
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
          showConfirmButton: false,
          backdrop: '#7a7d7f',
        })

        return false
      }

      return true
    },

    // ------create --------//
    async onSubmit() {
      this.form.busy = true

      try {
        await this.$apollo
          .mutate({
            mutation: UPDATE_SETTING_ADMIN_MUTATION,
            variables: {
              workspaceId: parseInt(this.mainWorkspace.id),
              logo: this.form.logo,
              stamp: this.form.stamp,
              bank: this.form.bank,
              account_name: this.form.account_name,
              account_no: this.form.account_no,
              paystack_secret_key: this.form.paystack_secret_key,
            },
            update: (store, { data: { updateAdminSettings } }) => {
              // Read the data from our cache for this query.
              const data = store.readQuery({
                query: ADMIN_WORKSPACE_QUERIES,
                variables: {
                  workspaceId: parseInt(this.mainWorkspace.id),
                  status: 1,
                },
              })

              data.adminWorkspace = updateAdminSettings

              store.writeQuery({
                query: ADMIN_WORKSPACE_QUERIES,
                variables: {
                  workspaceId: parseInt(this.mainWorkspace.id),
                  status: 1,
                },
                data,
              })
            },
          })
          .then(() => {
            this.form.name = null
            Swal.fire({
              timer: 1000,
              text: 'settings saved successfully',
              position: 'top-right',
              color: '#fff',
              background: '#4bb543',
              toast: false,
              showConfirmButton: false,
              backdrop: false,
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

    // test payyment
    initializePaystack() {
      this.$paystack({
        key:
          this.form.paystack_secret_key === null
            ? this.mainWorkspace.paystack_secret_key
            : this.form.paystack_secret_key,
        // email: this.guardianEmail,
        amount: this.form.amount * 100,
        ref: '' + Math.floor(Math.random() * 1000000000 + 1),
        currency: 'NGN',
        callback: () => {},
        onClose: () => {
          this.$router.push('')
        },
      })
    },
  },
}
</script>

<style lang="scss">
.settings {
  background-color: #fff;

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
  .online-payment {
    & .image {
      width: 100%;
      margin-bottom: 20px;
      .svg-image {
        width: 100px;
      }
    }
  }
}
</style>
