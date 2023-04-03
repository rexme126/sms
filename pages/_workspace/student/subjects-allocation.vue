<template>
  <div class="p-3">
    <template v-if="$fetchState.pending"><Preload /></template>
    <template v-else>
      <b-card v-if="studentSubjectAllocation.length > 0">
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
            <h4 class="text-center mt-5 mb-4">Assigned Teachers To Subjects</h4>

            <div class="search-input-wrap mr-3 mb-2">
              <b-form-input v-model="search" placeholder="Search..." />
            </div>

            <div>
              <b-table
                hover
                bordered
                head-variant="light"
                caption-top
                no-border-collapse
                :responsive="true"
                :items="searchFilter"
                :fields="fields"
              >
                <template #cell(index)="data">
                  {{ data.index + 1 }}
                </template>
                <template #cell(klase)="data">
                  {{ data.item.klase.name }}
                </template>
                <template #cell(section)="data">
                  {{ data.item.section.name }}
                </template>
                <template #cell(subject)="data">
                  <span style="color: red; font-weight: bold">{{
                    data.item.subject.subject
                  }}</span>
                </template>
                <template #cell(teacher)="data">
                  <span style="color: blue; font-weight: bold"
                    >{{ data.item.teacher.last_name }}
                    {{ data.item.teacher.first_name }}</span
                  >
                </template>
              </b-table>
            </div>
          </section>
        </vue-html2pdf>

        <div class="text-center mb-3">
          <b-button variant="danger" size="md" @click.prevent="generateReport"
            >download</b-button
          >
        </div>
      </b-card>
      <b-card v-else-if="studentSubjectAllocation.length == 0" class="p-3">
        <h2 class="text-center">No record found</h2>
      </b-card>
    </template>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import Preload from '~/components/Preload.vue'
import {
  STUDENT_SUBJECT_ALLOCATION_QUERIES,
  USER_STUDENT_QUERY,
} from '~/graphql/students/queries'

export default {
  components: { Preload },
  middleware: 'auth',
  data() {
    return {
      search: '',
      studentSubjectAllocation: [],
      user: {},
      klaseId: '',
      items: [],
      fields: [
        { key: 'index', label: 'S/N' },
        { key: 'klase', label: 'Class' },
        { key: 'section', label: 'Section' },
        { key: 'subject', label: 'Subject' },
        { key: 'teacher', label: "Teacher's Name" },
      ],
    }
  },
  async fetch() {
    const { app, route, redirect } = this.$nuxt.context

    const {
      apolloProvider: { defaultClient: apolloClient },
    } = app

    const {
      data: { user },
    } = await apolloClient.query({
      query: USER_STUDENT_QUERY,
      variables: { id: parseInt(this.$auth.user.id) },
    })
    this.user = user

    const {
      data: { studentSubjectAllocation },
    } = await apolloClient.query({
      query: STUDENT_SUBJECT_ALLOCATION_QUERIES,
      variables: {
        klaseId: parseInt(user.student.klase.id),
        workspaceId: parseInt(this.mainWorkspace.id),
      },
    })
    this.studentSubjectAllocation = studentSubjectAllocation
  },
  fetchDelay: 1000,

  computed: {
    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
    searchFilter() {
      return this.studentSubjectAllocation.filter((t) => {
        return (
          t.teacher.first_name.toLowerCase().match(this.search.toLowerCase()) ||
          t.teacher.last_name.toLowerCase().match(this.search.toLowerCase()) ||
          t.subject.subject.toLowerCase().match(this.search.toLowerCase())
        )
      })
    },
  },

  methods: {
    generateReport() {
      this.$refs.html2Pdf.generatePdf()
    },
  },
}
</script>

<style lang="scss" scoped>
.search-input-wrap {
  width: 300px;
  position: relative;

  .form-control {
    border-radius: 30px;
    font-size: 0.85rem;
    padding: 6px 25px;
    height: 30px;
    background-color: rgba(#d9ecff, 0.5);
    // border-color: transparent;
  }
}
</style>
