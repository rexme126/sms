<template>
  <div class="p-4 view-payment">
    <template v-if="$apollo.queries.klases.loading"><Preload /></template>
    <template v-else>
      <b-card class="p-3 mb-4 d-flex">
        <b-row no-gutters>
          <b-col md="6" class="p-4">
            <b-form-group label="Current Class:">
              <b-form-select
                id="klase"
                v-model="form.class"
                value-field="id"
                text-field="name"
                :options="klases"
                class="mb-3"
                size="lg"
                required
                @change="timetableDropdown"
              >
                <!-- This slot appears above the options from 'options' prop -->
                <template #first>
                  <b-form-select-option :value="null" disabled
                    >-- select class --</b-form-select-option
                  >
                </template>

                <!-- These options will appear after the ones from 'options' prop -->
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
      </b-card>

      <div
        v-show="timetableDropdownClass"
        class="libarian__wrapper"
        @click="hideMenu"
      >
        <b-card no-body @click="hideMenu">
          <b-tabs card style="font-size: 1.4rem">
            <b-tab active @click="hideMenu">
              <template #title>
                <strong>Create Timetable</strong>
                <b-icon scale="0.8" icon="caret-down-fill" />
              </template>

              <b-row no-gutters>
                <b-col md="12">
                  <h3 class="d-flex justify-content-center mb-4">
                    <!-- <div v-for="time in timetable[0]" :key="time.id">
                    {{ time['name'] }}
                  </div> -->
                    Timetable
                  </h3>

                  <div class="card-body">
                    <div class="card-student p-3">
                      <b-table
                        hover
                        bordered
                        head-variant="dark"
                        caption-top
                        no-border-collapse
                        fixed
                        stacked="md"
                        responsive="true"
                        :items="timetables"
                        :fields="fields"
                      >
                        <template #cell(Action)="data">
                          <div class="d-flex justify-content-center">
                            <b-button
                              variant="primary"
                              size="lg"
                              @click="timetableEdit(data.item.id)"
                              >Edit</b-button
                            >

                            <b-button
                              variant="danger"
                              size="lg"
                              class="ml-2"
                              @click="deleteItem(data.item.id)"
                              >Delete</b-button
                            >
                          </div>
                        </template>
                      </b-table>
                    </div>
                  </div>
                  <!-- Info modal -->
                  <b-modal
                    :id="infoModal"
                    class="modal"
                    :hide-backdrop="false"
                    title="Edit  Data"
                    size="lg"
                    :hide-footer="true"
                  >
                    <AdminEditTimetableModal
                      :slug="[slug, form.class, infoModal]"
                    />
                  </b-modal>
                  <!-- end modal -->
                </b-col>
              </b-row>

              <div class="exam-timetble">
                <b-form
                  v-show="show"
                  method="POST"
                  @submit.prevent="onSubmit"
                  @keydown="form.onKeydown($event)"
                >
                  <table class="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">Time</th>
                        <th scope="col">Monday</th>
                        <th scope="col">Tuesday</th>
                        <th scope="col">Wednesday</th>
                        <th scope="col">Thursday</th>
                        <th scope="col">Friday</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <th scope="row">
                          <b-input
                            v-model="form.time"
                            style="width: 11rem"
                            type="text"
                          ></b-input>
                        </th>

                        <th scope="row">
                          <b-form-input
                            v-model="form.monday"
                            type="text"
                          ></b-form-input>
                        </th>
                        <th scope="row">
                          <b-form-input
                            v-model="form.tuesday"
                            type="text"
                          ></b-form-input>
                        </th>
                        <th scope="row">
                          <b-form-input
                            v-model="form.wednesday"
                            type="text"
                          ></b-form-input>
                        </th>
                        <th scope="row">
                          <b-form-input
                            v-model="form.thursday"
                            type="text"
                          ></b-form-input>
                        </th>
                        <th scope="row">
                          <b-form-input
                            v-model="form.friday"
                            type="text"
                          ></b-form-input>
                        </th>
                      </tr>
                    </tbody>
                  </table>
                  <div class="d-flex justify-content-center">
                    <b-button
                      type="submit"
                      variant="primary"
                      class="mr-4"
                      size="lg"
                    >
                      <b-spinner
                        v-if="form.busy"
                        variant="light"
                        small
                        class="mr-1 mb-1"
                      />Register</b-button
                    >
                  </div>
                </b-form>
              </div>
            </b-tab>

            <b-tab lazy @click="registrationMenu">
              <template #title>
                <strong>View Timetable</strong>
                <b-icon scale="0.8" icon="caret-down-fill" />
              </template>

              <div class="menu" style="background-color: #fff">
                <ul
                  v-show="registerMenu"
                  class="shadow"
                  :class="registrationMenuClass"
                >
                  <span v-for="klase in klases" :key="klase.id">
                    <li
                      @click.prevent="
                        dynamicStudentClass(klase.id, klase.name)
                        activeTab = 'TimetableEditClassTimetable'
                      "
                    >
                      <span class="d-flex">{{ klase.name }}</span>
                    </li>
                  </span>
                </ul>
              </div>

              <component
                :is="activeTab"
                :edit-current-class="[dynamicClass, klaseName]"
              />
            </b-tab>
          </b-tabs>
        </b-card>
      </div>
    </template>
  </div>
</template>

<script>
import { KLASE_QUERIES } from '~/graphql/klases/queries'
import { TIMETABLE_QUERIES } from '~/graphql/timetables/queries'

import {
  CREATE_TIMETABLE_MUTATION,
  DELETE_TIMETABLE_MUTATION,
} from '~/graphql/timetables/mutations'
export default {
  middleware: 'auth',
  data() {
    return {
      timetables: [],
      klases: [],
      infoModal: 'modelInfo',
      slug: '',
      timetableDropdownClass: false,
      id: 0,
      klaseName: '',
      show: true,
      form: new this.$form({
        class: null,
        time: null,
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        busy: false,
      }),
      fields: [
        { key: 'time', label: 'Time' },
        { key: 'monday', label: 'Monday' },

        { key: 'tuesday', label: 'Tuesday' },

        { key: 'wednesday', label: 'Wednesday' },

        { key: 'thursday', label: 'Thursday' },

        { key: 'friday', label: 'Friday' },
        { key: 'Action', label: 'Action' },
      ],
      dynamicClass: '',

      activeTab: '',
      registerMenu: false,
      registrationMenuClass: '',
    }
  },
  apollo: {
    klases: {
      query: KLASE_QUERIES,
    },
  },
  methods: {
    // modal
    timetableEdit(item) {
      this.$bvModal.show(this.infoModal)
      this.slug = item
    },
    // end modal
    dynamicStudentClass(item, itemName) {
      this.dynamicClass = item
      this.klaseName = itemName
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
    timetableDropdown() {
      this.$apollo.addSmartQuery('timetables', {
        query: TIMETABLE_QUERIES,
        variables() {
          return {
            klase_id: parseInt(this.form.class),
          }
        },
        result({ data, loading }) {
          if (!loading) {
            this.timetables = data.timetables
          }
        },
      })

      if (this.form.class === null) {
        return false
      } else {
        this.timetableDropdownClass = true
      }
    },

    // -------- create mutation -------------- //
    onSubmit() {
      if (
        this.form.time === null &&
        this.form.monday === null &&
        this.form.tuesday === null &&
        this.form.wednesday === null &&
        this.form.thursday === null &&
        this.form.friday === null
      ) {
      } else {
        const klaseId = this.form.class
        this.form.busy = true
        this.$apollo
          .mutate({
            mutation: CREATE_TIMETABLE_MUTATION,
            variables: {
              time: this.form.time,
              monday: this.form.monday,
              tuesday: this.form.tuesday,
              wednesday: this.form.wednesday,
              thursday: this.form.thursday,
              friday: this.form.friday,
              klase_id: parseInt(this.form.class),
            },
            update: (store, { data: { createTimetable } }) => {
              // Read the data from our cache for this query.
              const data = store.readQuery({
                query: TIMETABLE_QUERIES,
                variables: { klase_id: parseInt(klaseId) },
              })
              // console.log(this.form.class);

              data.timetables.push(createTimetable)
              // console.log(dataCopy)

              // Write our data back to the cache.
              // Write back to the cache
              store.writeQuery({
                query: TIMETABLE_QUERIES,
                variables: {
                  klase_id: parseInt(klaseId),
                },
                data,
              })
            },
          })
          .then(() => {
            this.form.busy = false

            this.form.time = ''
            this.form.monday = ''
            this.form.tuesday = ''
            this.form.wednesday = ''
            this.form.thursday = ''
            this.form.friday = ''
          })
          .catch((e) => {
            console.log(e)
          })
      }
    },
    // -------- end mutation -------------- //

    // -------- delete mutation -------------- //
    deleteItem(item) {
      const klaseId = this.form.class
      const deleteId = item
      this.form.busy = true
      this.$apollo
        .mutate({
          mutation: DELETE_TIMETABLE_MUTATION,
          variables: {
            id: parseInt(item),
          },
          update: (store, { data: { deleteTimetable } }) => {
            const data = store.readQuery({
              query: TIMETABLE_QUERIES,
              variables: { klase_id: parseInt(klaseId) },
            })

            const index = data.timetables.findIndex((m) => m.id == deleteId)
            if (index !== -1) {
              // Mutate cache result
              data.timetables.splice(index, 1)

              store.readQuery({
                query: TIMETABLE_QUERIES,
                variables: {
                  klase_id: parseInt(klaseId),
                },
                data,
              })
            }
          },
        })
        .then(() => {
          this.form.busy = false
        })
        .catch((e) => {
          console.log(e)
        })
    },
    // -------- end mutation -------------- //
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
        top: -9.5rem;
        left: 15.5rem;
        background-color: #fff;
      }

      li {
        background-color: #fff;
        padding: 1.3rem 5.5rem;
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
