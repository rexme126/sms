<template>
  <div class="p-3">
    <template v-if="nowloading"><Preload /></template>
    <template v-else>
      <b-card class="mb-2">
        <b-row no-gutters>
          <b-col md="3">
            <b-form-group label="Current Class:">
              <b-form-select
                id="klase"
                v-model="studentClass"
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
                    >-- select class --</b-form-select-option
                  >
                </template>

                <!-- These options will appear after the ones from 'options' prop -->
              </b-form-select>
            </b-form-group>
          </b-col>

          <b-col md="3" class="ml-2">
            <b-form-group label="Sections">
              <b-form-select
                id="sections"
                v-model="section"
                value-field="id"
                text-field="name"
                :options="sections"
                class="mb-3"
                size="lg"
                required
                @change="timetableDropdown"
              >
              <template #first>
                  <b-form-select-option :value="null" disabled
                    >-- select section --</b-form-select-option
                  >
                </template>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
      </b-card>

      <div v-show="timetableDropdownClass">
        <b-card v-if="examTimetables.length > 0" class="p-4">
          <vue-html2pdf
            ref="html2Pdf"
            :show-layout="true"
            :float-layout="false"
            :enable-download="false"
            :preview-modal="true"
            :paginate-elements-by-height="1400"
            filename="Pdf"
            :pdf-quality="2"
            :manual-pagination="false"
            pdf-format="a4"
            pdf-orientation="landscape"
            pdf-content-width=""
          >
            <section slot="pdf-content">
              <h5 class="text-center mb-5">
                <span style="color: green"
                  >({{
                    sections[0] == null ? '' : sections[0].klase.name
                  }})</span
                >
                Exam timetable
              </h5>

              <b-table
                hover
                bordered
                head-variant="dark"
                caption-top
                no-border-collapse
                fixed
                responsive="true"
                :items="examTimetables"
                :fields="fields"
              >
              </b-table>
            </section>
          </vue-html2pdf>

          <div class="text-center mt-4">
            <b-button
              variant="danger"
              pill
              size="md"
              @click.prevent="generateReport"
              >download</b-button
            >
          </div>
        </b-card>
        <b-card v-else-if="examTimetables.length == 0" class="exam-wrapper p-4">
          <h2 class="text-center p-4">No record found</h2>
        </b-card>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import { EXAM_TIMETABLE_QUERIES } from '~/graphql/examTimetables/queries'
import { USER_STUDENT_QUERY } from '~/graphql/students/queries'
import { KLASE_QUERIES } from '~/graphql/klases/queries'
import { SECTION_QUERIES } from '~/graphql/sections/queries'
import Preload from '~/components/Preload.vue'

export default {
  components: { Preload },
  middleware: 'auth',
  data() {
    return {
      examTimetables: {},
      timetableDropdownClass: false,
      studentClass: null,
      section: null,
      klases: [],
      klaseName: '',
      items: [],
      fields: [
        { key: 'date', label: 'Date' },
        { key: 'time', label: 'Time' },
        { key: 'monday', label: 'Monday' },

        { key: 'tuesday', label: 'Tuesday' },

        { key: 'wednesday', label: 'Wednesday' },

        { key: 'thursday', label: 'Thursday' },

        { key: 'friday', label: 'Friday' },
      ],
    }
  },
  apollo: {
    user: {
      query: USER_STUDENT_QUERY,
      variables() {
        return {
          id: parseInt(this.$auth.user.id),
        }
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
    sections: {
      query: SECTION_QUERIES,
      variables() {
        return {
          klase_id: parseInt(this.studentClass),
          workspaceId: parseInt(this.mainWorkspace.id),
        }
      },
    },
  },

  computed: {
    nowloading() {
      return (
        this.$apollo.queries.user.loading && this.$apollo.queries.klases.loading
      )
    },

    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
  },

  methods: {
    generateReport() {
      this.$refs.html2Pdf.generatePdf()
    },

    timetableDropdown() {
      this.timetableDropdownClass = true
      this.$apollo.addSmartQuery('examTimetables', {
        query: EXAM_TIMETABLE_QUERIES,
        variables() {
          return {
            klase_id: parseInt(this.studentClass),
            section_id: parseInt(this.section),
            workspaceId: parseInt(this.mainWorkspace.id),
          }
        },

        result({ loading, data }, key) {
          if (!loading) {
            this.examTimetables = data.examTimetables
          }
        },
      })
    },
  },
}
</script>