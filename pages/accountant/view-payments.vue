<template>
  <div class="p-4 view-payment">
    <b-card class="p-3 mb-4 d-flex">
      <b-row no-gutters>
        <b-col md="6" class="p-4">
          <b-form-group label="Select Year">
            <b-form-select
              v-model="form.year"
              :options="years"
              class="mb-3"
              size="lg"
              required
              @change="paymentDropdown"
            >
              <!-- This slot appears above the options from 'options' prop -->
              <template #first>
                <b-form-select-option :value="null" disabled
                  >-- select year --</b-form-select-option
                >
              </template>

              <!-- These options will appear after the ones from 'options' prop -->
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
    </b-card>

    <div
      v-show="paymentDropdownClass"
      class="libarian__wrapper"
      @click.prevent="hideMenu"
    >
      <b-card no-body @click="hideMenu">
        <b-tabs card style="font-size: 1.4rem">
          <b-tab active @click="hideMenu">
            <template #title>
              <strong>All Classes</strong>
              <b-icon scale="0.8" icon="caret-down-fill" />
            </template>
            <PaymentIncompleteSchoolFee :current-year="form.year" />
          </b-tab>

          <b-tab lazy @click.prevent="registrationMenu">
            <template #title>
              <strong>Class Payment</strong>
              <b-icon scale="0.8" icon="caret-down-fill" />
            </template>

            <div class="menu" style="background-color: #fff">
              <ul
                v-show="registerMenu"
                class="shadow"
                :class="registrationMenuClass"
              >
                <li
                  @click.prevent="
                    dynamicStudentClass('JSS 1')
                    activeTab = 'PaymentCompleteSchoolFee'
                  "
                >
                  <span class="d-flex">JSS1</span>
                </li>
                <li
                  @click.prevent="
                    dynamicStudentClass('JSS 2')
                    activeTab = 'PaymentCompleteSchoolFee'
                  "
                >
                  <span class="d-flex">JSS2</span>
                </li>
                <li
                  @click.prevent="
                    dynamicStudentClass('JSS 3')
                    activeTab = 'PaymentCompleteSchoolFee'
                  "
                >
                  <span class="d-flex">JSS3</span>
                </li>
                <li
                  @click.prevent="
                    dynamicStudentClass('SSS 1')
                    activeTab = 'PaymentCompleteSchoolFee'
                  "
                >
                  <span class="d-flex">SSS1</span>
                </li>
                <li
                  @click.prevent="
                    dynamicStudentClass('SSS 2')
                    activeTab = 'PaymentCompleteSchoolFee'
                  "
                >
                  <span class="d-flex">SSS2</span>
                </li>
                <li
                  @click.prevent="
                    dynamicStudentClass('SSS 3')
                    activeTab = 'PaymentCompleteSchoolFee'
                  "
                >
                  <span class="d-flex"> SSS3</span>
                </li>
                <li></li>
              </ul>
            </div>

            <component
              :is="activeTab"
              :current-class-year="[form.year, dynamicClass]"
            />
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paymentDropdownClass: false,
      form: {
        year: null,
      },
      dynamicClass: '',
      years: ['2022'],

      activeTab: '',
      registerMenu: false,
      registrationMenuClass: '',
    }
  },
  methods: {
    dynamicStudentClass(item) {
      this.dynamicClass = item
    },
    registrationMenu(e) {
      if (this.registrationMenuClass === '') {
        this.registerMenu = true
        this.registrationMenuClass = 'off'
        e.stopPropagation()
      } else {
        this.registerMenu = false
        this.registrationMenuClass = ''
      }
    },
    hideMenu() {
      if (this.registerMenu === true) {
        this.registerMenu = false
        this.registrationMenuClass = ''
      }
    },
    paymentDropdown() {
      if (this.form.year === null) {
        return false
      } else {
        this.paymentDropdownClass = true
      }
    },
  },
}
</script>

<style lang="scss">
.view-payment {
  font-size: 1.6rem;

  .custom-select:focus {
    box-shadow: none;
  }

  .custom-select,
  .form-control,
  .mb-3 {
    height: 4rem;
    font-size: 1.4rem;
    color: #000;
  }
  .libarian__wrapper {
    padding: 2rem;
    font-size: 1.4rem;
    background-color: var(--color-white);
    border-radius: 0.5rem;
    border: none;

    .nav-link.active {
      border-top: 5px solid limegreen;
    }

    .menu {
      ul {
        z-index: 999;
        position: absolute;
        border: none;
        top: -3.5rem;
        left: 14.2rem;
        background-color: #fff;
      }

      li:not(:last-child) {
        background-color: #fff;
        padding: 1rem 4.8rem;
        border-bottom: 1px solid gray;
        cursor: pointer;

        &:hover {
          background-color: var(--color-input);
        }
      }
    }
  }
}
</style>