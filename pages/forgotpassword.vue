<template>
  <div class="form-wrapper">
    <div class="cover-box">
      <div class="form-width">
        <b-form
          method="POST"
          @submit.prevent="onSubmit"
          @keydown="form.onKeydown($event)"
        >
          <b-form-group label="Email">
            <b-form-input
              v-model="form.email"
              type="email"
              placeholder="Enter email"
              required
              class="shadow"
              :state="getInputState('email')"
            ></b-form-input>
            <b-form-invalid-feedback
              :state="getInputState('email')"
              class="mt-2"
            >
              {{ form.errors.get('email') }}
            </b-form-invalid-feedback>
          </b-form-group>
          <p style="color: #d953df; font-size: 1.2rem">{{ emailAlert }}</p>

          <div class="button-container mt-4">
            <b-button
              type="submit"
              variant="primary"
              class="shadow"
              size="lg"
              pill
              :disabled="form.busy"
            >
              <b-spinner
                v-if="form.busy"
                variant="light"
                small
                class="mr-1 mb-1"
              />
              Submit
            </b-button>
          </div>
        </b-form>
      </div>
    </div>

    <div class="left-side"></div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import { OTP_PASSWORD_RESET_MUTATION } from '~/graphql/users/mutations'
export default {
  layout: 'auth',

  middleware: 'auth',

  auth: 'guest',

  data() {
    return {
      showPassword: false,
      emailAlert: '',
      form: new this.$form({
        email: '',
        busy: false,
      }),
    }
  },
  methods: {
    getInputState(input) {
      return this.form.errors.has(input) ? false : null
    },
    async onSubmit() {
      this.form.busy = true

      try {
        await this.$apollo
          .mutate({
            mutation: OTP_PASSWORD_RESET_MUTATION,
            variables: {
              email: this.form.email,
            },
          })
          .then(({ data }) => {

            if (data.otpPasswordReset == null) {
              this.emailAlert = `There's no email associated with this account`
            } else {
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

              this.emailAlert = ''
              this.$router.push({
                name: 'verify-otp',
                query: { email: this.form.email },
              })
            }
            this.form.email = ''
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
  },
}
</script>

<style lang="scss" scoped>
.form-wrapper {
  display: flex;

  @include media-breakpoint-down(md) {
    display: block;
  }

  .form-control,
  .mb-3 {
    height: 3.2rem;
    font-size: 1.4rem;
    border-radius: 0.5rem;
  }

  .cover-box {
    // box-shadow: 0 0 0.2rem 0;
    background-color: #fff;
    width: 50%;
    height: 100vh;

    @include media-breakpoint-down(md) {
      width: 100%;
    }

    .form-width {
      color: #fff;
      max-width: 50%;
      margin: 35vh auto;

      @include media-breakpoint-down(md) {
        position: absolute;
        margin: 0;
        left: 25%;
        top: 40%;
        translate: translate(-50%, -50%);
      }
    }
  }
  .bold-color {
    color: #fff;
    margin-left: 4rem;
  }
  .bold-color-link {
    color: #fff;
    display: inline-block;
    margin-top: 1rem;
  }

  .left-side {
    background: linear-gradient(to right, #5142f5, #047edf 99%);
    animation: fide-slide-down 2s 0.5s ease-out forwards;
    background-image: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0.528)
      ),
      url('~/assets/images/background.jpg');
    background-position: center;
    height: 100vh;
    background-size: cover;
    width: 50%;

    @include media-breakpoint-down(md) {
      display: none;
    }
  }
}
</style>
