<template>
  <div class="verify-otp">
    <div class="form-wrapper-otp">
      <div class="cover-box-otp">
        <div class="form-width-otp">
          <b-form
            method="POST"
            @submit.prevent="onSubmit"
            @keydown="form.onKeydown($event)"
          >
            <div class="d-flex">
              <v-otp-input
                ref="otpInput"
                input-classes="otp-input"
                separator="-"
                :num-inputs="5"
                :should-auto-focus="true"
                :is-input-num="true"
                @on-change="handleOnChange"
                @on-complete="handleOnComplete"
              />

              <!-- <button @click="handleClearInput()">Clear</button> -->

              <b-button
                v-if="!form.busy"
                type="submit"
                class="shadow-sm verification-code"
                size="lg"
                :disabled="timer == 0"
              >
                Verify
              </b-button>

              <b-button
                v-if="form.busy"
                type="submit"
                class="shadow-sm verification-code"
                size="lg"
                style="width: 53px"
                :disabled="timer == 0 || form.busy"
              >
                <b-spinner
                  v-if="form.busy"
                  variant="light"
                  small
                  class="mr-1 mb-1"
                />
              </b-button>
            </div>

            <div class="timer mt-3">0:{{ timer }}</div>
            <b-button
              class="verification-code"
              size="md"
              :disabled="timer > 0"
              @click="resendOtp"
            >
              <b-spinner
                v-if="busy"
                variant="light"
                small
                class="mr-1 mb-1"
              />Resend Code</b-button
            >
          </b-form>
        </div>
      </div>

      <div class="left-side"></div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'
import {
  OTP_PASSWORD_RESET_MUTATION,
  VERIFY_OTP_MUTATION,
} from '~/graphql/users/mutations'
export default {
  layout: 'auth',

  middleware: 'auth',

  auth: 'guest',

  data() {
    return {
      busy: null,
      showPassword: false,
      onComplete: null,
      onChange: '',
      emailAlert: '',
      timer: 30,
      form: new this.$form({
        otp: null,
        busy: false,
      }),
    }
  },
  created() {
    this.setTimer()
  },

  methods: {
    handleOnComplete(value) {
      this.form.otp = value
    },
    handleOnChange(value) {
      this.onChange = value
    },
    // handleClearInput() {
    //   this.$refs.otpInput.clearInput()
    // },
    setTimer() {
      setTimeout(() => {
        if (this.timer > 0) {
          this.timer--
        }
        this.setTimer()
      }, 1000)
    },
    async onSubmit() {
      this.form.busy = true

      try {
        await this.$apollo
          .mutate({
            mutation: VERIFY_OTP_MUTATION,
            variables: {
              otp: parseInt(this.form.otp),
            },
          })
          .then(({ data }) => {
            if (data.verifyOtp == null) {
              Swal.fire({
                timer: 1000,
                text: 'incorrect Otp code',
                position: 'top-right',
                color: '#fff',
                background: '#d9534f',
                toast: false,
                showConfirmButton: false,
                backdrop: false,
              })
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

              this.$router.push({
                name: 'updatePassword',
                query: { email: this.$route.query.email },
              })
            }
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

    resendOtp() {
      this.busy = true
      this.timer = 30
      this.$apollo
        .mutate({
          mutation: OTP_PASSWORD_RESET_MUTATION,
          variables: {
            email: this.$route.query.email,
          },
        })
        .then(() => {
          Swal.fire({
            timer: 1000,
            text: 'otp code sent successfully',
            position: 'top-right',
            color: '#fff',
            background: '#4bb543',
            toast: false,
            showConfirmButton: false,
            backdrop: false,
          })
          this.busy = false
        })
    },
  },
}
</script>

<style lang="scss">
.verify-otp {
  .form-wrapper-otp {
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

    .cover-box-otp {
      // box-shadow: 0 0 0.2rem 0;
      background-color: #fff;
      width: 50%;
      height: 100vh;

      @include media-breakpoint-down(md) {
        width: 100%;
      }

      .form-width-otp {
        // color: #000;
        max-width: 50%;
        margin: 35vh auto;

        .verification-code {
          background: linear-gradient(
            to bottom,
            #ff2200,
            #0019f9e9 99%
          ) !important;
        }

        .otp-input {
          width: 40px;
          height: 40px;
          padding: 5px;
          margin: 0 10px;
          font-size: 20px;
          border-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.3);
          text-align: center;

          @include media-breakpoint-down(md) {
            text-align: left;
            width: 40px;
            height: 40px;
            padding: 5px;
            margin: 0 8px;
            font-size: 16px;
          }
          &.error {
            border: 1px solid red !important;
          }
        }
        .otp-input::-webkit-inner-spin-button,
        .otp-input::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        & .timer {
          color: #000;
          margin-left: 88%;
        }

        @include media-breakpoint-down(md) {
          position: absolute;
          margin: 0;
          left: 12%;
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
}
</style>
