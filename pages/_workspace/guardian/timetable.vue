<template>
  <div class="p-4 view-payment">
    <template>
      <div class="fonts">
        <template v-if="!klases"> <div></div></template>
        <template v-else>
          <div class="libarian__wrapper">
            <b-card no-body @click="hideMenu">
              <b-tabs card style="font-size: 1.4rem">
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
      infoModal: 'modelInfo',
      slug: '',

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
          .then(({ data }) => {
            this.form.busy = false

            this.form.time = ''
            this.form.monday = ''
            this.form.tuesday = ''
            this.form.wednesday = ''
            this.form.thursday = ''
            this.form.friday = ''

            this.$router.push('/admin/timetable')
          })
          .catch((err) => {
            // this.klase_id =
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
        .then(({ data }) => {
          this.form.busy = false
          // this.$router.push('/admin/teacher')
        })
        .catch((err) => {
          // this.klase_id =
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