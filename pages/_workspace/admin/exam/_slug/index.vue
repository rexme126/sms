<template>
  <div>
    <div v-if="nowLoading"><Preload /></div>
    <div v-else>
      <div class="card">
        <div class="card-header">
          <b-button
            class="mb-2"
            variant="warning"
            pill
            @click="handleEditCommits()"
            >Edit Comments</b-button
          >
          <div id="card">
            <div class="p-4">
              <div
                class="student__wrapper"
                style="
                  border: 30px solid purple;
                  width: 90%;
                  border-radius: 20px;
                  padding: 10px;
                  margin: 40px auto auto auto;
                "
              >
                <div
                  v-for="first in studentExamResult"
                  :key="first.id"
                  style="
                    margin-top: 13px;
                    padding: 5px;

                    overflow-x: auto;
                    font-weight: bold;
                  "
                >
                  <div
                    class="
                      mt-4
                      d-flex
                      justify-content-between
                      align-items-center
                    "
                    style=""
                  >
                    <div class="school-logo" style="">
                      <div v-if="mainWorkspace.logo == null"></div>
                  
                        <img
                         v-else
                          :src="`data:image/jegp;base64,${encodedImages.logoBase64}`"
                         
                          alt="logo"
                          width="70"
                        />
                     
                    </div>
                    <div class="d-flex flex-column align-items-center">
                      <h1
                        style="
                          font-weight: bold;
                          color: #000;
                          text-transform: capitalize;
                        "
                      >
                        {{ mainWorkspace.name }}
                      </h1>
                      <h4 style="font-weight: bold; color: #1c0988">
                        Result sheet {{ first.klase.name }}
                      </h4>
                    </div>
                    <div class="student-picture">
                      <div v-if="first.student.photo == null"></div>
                      <img
                        v-else
                       :src="`data:image/png;base64,${encodedImages.photoBase64}`"
                        alt="student"
                        width="100"
                      />
                    </div>
                  </div>

                  <!-- end header -->
                  <!-- section 1 -->

                  <div class="mt-4">
                    <table
                      border="2"
                      style="
                        border: 2px solid #292b2c;
                        width: 100%;
                        margin: 0;
                        text-transform: uppercase;
                      "
                    >
                      <tr style="color: #1c0988">
                        <th style="padding: 5px" colspan="2">
                          <span class="d-flex">
                            <h6
                              class="mt-2"
                              style="color: #1c09f5; font-weight: bold"
                            >
                              NAME OF STUDENT:
                            </h6>
                            <h6
                              class="mt-2 ml-2"
                              style="color: #111; font-weight: bold"
                            >
                              {{ first.student.first_name }}
                              {{ first.student.last_name }}
                              {{ first.student.middle_name }}
                            </h6>
                          </span>
                        </th>

                        <th style="padding: 5px" colspan="1">
                          <span class="d-flex">
                            <h6
                              class="mt-2"
                              style="color: #1c09f5; font-weight: bold"
                            >
                              SEX:
                            </h6>
                            <h6
                              class="mt-2 ml-2"
                              style="color: #111; font-weight: bold"
                            >
                              {{ first.student.gender }}
                            </h6>
                          </span>
                        </th>
                        <th style="padding: 5px" rowspan="1">
                          <span class="d-flex">
                            <h6
                              class="mt-2"
                              style="color: #1c09f5; font-weight: bold"
                            >
                              ADMISSION NO:
                            </h6>
                            <h6
                              class="mt-2 ml-2"
                              style="color: #111; font-weight: bold"
                            >
                              {{ first.student.adm_no }}
                            </h6>
                          </span>
                        </th>

                        <th style="padding: 5px" rowspan="1">
                          <span class="d-flex align-items-stretch">
                            <h6
                              class="mt-2"
                              style="color: #1c09f5; font-weight: bold"
                            >
                              AGE:
                            </h6>
                            <h6
                              class="mt-2 ml-2"
                              style="color: #111; font-weight: bold"
                              v-html="getAge(first.student.birthday)"
                            ></h6>
                          </span>
                        </th>
                      </tr>
                      <tr>
                        <th style="padding: 5px" colspan="1">
                          <span class="d-flex align-items-stretch">
                            <h6
                              class="mt-2"
                              style="color: #1c09f5; font-weight: bold"
                            >
                              ATTENDANCE:
                            </h6>
                            <h6
                              class="mt-2 ml-2"
                              style="color: #111; font-weight: bold"
                            >
                              {{ first.num_present }} /
                              {{ first.num_total }}
                            </h6>
                          </span>
                        </th>

                        <th style="padding: 5px" colspan="1">
                          <span class="d-flex align-items-stretch">
                            <h6
                              class="mt-2"
                              style="color: #1c09f5; font-weight: bold"
                            >
                              NUMBER IN CLASS:
                            </h6>
                            <h6
                              class="mt-2 ml-2"
                              style="color: #111; font-weight: bold"
                            >
                              {{ numStudents }}
                            </h6>
                          </span>
                        </th>

                        <th style="padding: 5px" colspan="1">
                          <span class="d-flex align-items-stretch">
                            <h6
                              class="mt-2"
                              style="color: #1c09f5; font-weight: bold"
                            >
                              POSITION:
                            </h6>
                            <h6
                              class="mt-2 ml-2"
                              style="color: #111; font-weight: bold"
                              v-html="position(first.position)"
                            ></h6>
                          </span>
                        </th>

                        <th style="padding: 5px" colspan="1">
                          <span class="d-flex align-items-stretch">
                            <h6
                              class="mt-2"
                              style="color: #1c09f5; font-weight: bold"
                            >
                              RESULT STATUS:
                            </h6>
                            <h6
                              v-if="first.avg >= setPromotion.name"
                              class="mt-2 ml-2"
                              style="color: green; font-weight: bold"
                            >
                              PASS
                            </h6>
                            <h6
                              v-else
                              class="mt-2 ml-2"
                              style="color: #d9534f; font-weight: bold"
                            >
                              FAIL
                            </h6>
                          </span>
                        </th>
                        <th v-if="term == 1" style="padding: 5px" colspan="1">
                          <span class="d-flex align-items-stretch">
                            <h6
                              class="mt-2"
                              style="color: #1c09f5; font-weight: bold"
                            >
                              class:
                            </h6>
                            <h6
                              class="mt-2 ml-2"
                              style="color: #111; font-weight: bold"
                            >
                              {{ first.klase.name }}
                            </h6>
                          </span>
                        </th>

                        <th v-if="term == 2" style="padding: 5px" colspan="1">
                          <span class="d-flex align-items-stretch">
                            <h6
                              class="mt-2"
                              style="color: #1c09f5; font-weight: bold"
                            >
                              class:
                            </h6>
                            <h6
                              class="mt-2 ml-2"
                              style="color: #111; font-weight: bold"
                            >
                              {{ first.klase.name }}
                            </h6>
                          </span>
                        </th>

                        <th
                          v-if="term == 3 && first.ps != 'graduated'"
                          style="padding: 5px"
                          colspan="1"
                        >
                          <span class="d-flex align-items-stretch">
                            <h6
                              class="mt-2"
                              style="color: #1c09f5; font-weight: bold"
                            >
                              PROMOTED TO:
                            </h6>
                            <h6
                              class="mt-2 ml-2"
                              style="color: #111; font-weight: bold"
                            >
                              {{ first.promoted_to }}
                            </h6>
                          </span>
                        </th>

                        <th
                          v-if="term == 3 && first.ps == 'graduated'"
                          style="padding: 5px"
                          colspan="1"
                        >
                          <span class="d-flex align-items-stretch">
                            <h6
                              class="mt-2"
                              style="color: #1c09f5; font-weight: bold"
                            >
                              class :
                            </h6>
                            <h6
                              class="mt-2 ml-2"
                              style="color: #111; font-weight: bold"
                            >
                              {{ first.klase.name }}
                            </h6>
                          </span>
                        </th>
                      </tr>

                      <tr>
                        <th
                          style="padding: 5px"
                          rowspan="1"
                          v-if="first.ps != 'graduated'"
                        >
                          <span class="d-flex align-items-stretch">
                            <h6
                              class="mt-2"
                              style="color: #1c09f5; font-weight: bold"
                            >
                              Term Begins:
                            </h6>
                            <h6
                              class="mt-2 ml-2"
                              style="color: #111; font-weight: bold"
                            >
                              {{ first.term_start }}
                            </h6>
                          </span>
                        </th>

                        <th
                          style="padding: 5px"
                          rowspan="1"
                          v-if="first.ps != 'graduated'"
                        >
                          <span class="d-flex align-items-stretch">
                            <h6
                              class="mt-2"
                              style="color: #1c09f5; font-weight: bold"
                            >
                              Term Ends:
                            </h6>
                            <h6
                              class="mt-2 ml-2"
                              style="color: #111; font-weight: bold"
                            >
                              {{ first.term_end }}
                            </h6>
                          </span>
                        </th>

                        <th
                          style="padding: 5px"
                          colspan="2"
                          v-if="first.ps == 'graduated'"
                        >
                          <span class="d-flex align-items-stretch">
                            <h6
                              class="mt-2"
                              style="color: #1c09f5; font-weight: bold"
                            >
                              Graduate Student
                            </h6>
                          </span>
                        </th>
                        <th style="padding: 5px" colspan="1" v-if="term == 1">
                          <span class="d-flex align-items-stretch">
                            <h6
                              class="mt-2"
                              style="color: #1c09f5; font-weight: bold"
                            >
                              TERM:
                            </h6>
                            <h6
                              class="mt-2 ml-2"
                              style="color: #111; font-weight: bold"
                            >
                              {{ first.term.name }}
                            </h6>
                          </span>
                        </th>

                        <th style="padding: 5px" colspan="1" v-if="term == 2">
                          <span class="d-flex align-items-stretch">
                            <h6
                              class="mt-2"
                              style="color: #1c09f5; font-weight: bold"
                            >
                              TERM:
                            </h6>
                            <h6
                              class="mt-2 ml-2"
                              style="color: #111; font-weight: bold"
                            >
                              {{ first.term.name }}
                            </h6>
                          </span>
                        </th>

                        <th style="padding: 5px" colspan="1" v-if="term == 3">
                          <span class="d-flex align-items-stretch">
                            <h6
                              class="mt-2"
                              style="color: #1c09f5; font-weight: bold"
                            >
                              TERM:
                            </h6>
                            <h6
                              class="mt-2 ml-2"
                              style="color: #1f1f9f; font-weight: bold"
                            >
                              {{ first.term.name }}
                            </h6>
                          </span>
                        </th>

                        <th style="padding: 5px" colspan="1">
                          <span class="d-flex align-items-stretch">
                            <h6
                              class="mt-2"
                              style="color: #1c09f5; font-weight: bold"
                            >
                              SECTION:
                            </h6>
                            <h6
                              class="mt-2 ml-2"
                              style="color: #1f1f9f; font-weight: bold"
                            >
                              {{ first.section.name }}
                            </h6>
                          </span>
                        </th>
                        <th style="padding: 5px" rowspan="1">
                          <span class="d-flex align-items-stretch">
                            <h6
                              class="mt-2"
                              style="color: #1c09f5; font-weight: bold"
                            >
                              SESSION:
                            </h6>
                            <h6
                              class="mt-2 ml-2"
                              style="color: #111; font-weight: bold"
                            >
                              {{ first.session.name }}
                            </h6>
                          </span>
                        </th>
                      </tr>
                    </table>
                  </div>
                </div>

                <div
                  style="
                    overflow-x: auto;
                    font-weight: bold;
                    width: 99%;
                    margin: 25px auto;
                  "
                >
                  <div class="d-flex flex-column">
                    <table
                      border="2"
                      style="text-align: center; border: 3px solid #292b2c"
                    >
                      <tr style="color: #1c0988">
                        <th style="padding: 5px" rowspan="2">Subjects</th>
                        <th style="padding: 5px" colspan="3">
                          Contineous Assesment
                        </th>
                        <th style="padding: 5px" rowspan="2">Exam <br />60%</th>
                        <th style="padding: 5px" rowspan="2">
                          Final remarks <br />(100%)
                        </th>
                        <th style="padding: 5px" rowspan="2">Grade</th>
                        <th style="padding: 5px" rowspan="2">
                          Subject <br />position
                        </th>
                        <th style="padding: 5px" rowspan="2">Remarks</th>
                      </tr>
                      <tr style="color: #1c0988">
                        <th style="padding: 5px">Ca1<br />(20%)</th>
                        <th style="padding: 5px">Ca2<br />(20%)</th>
                        <th style="padding: 5px">Total<br />(40%)</th>
                      </tr>
                      <tr v-for="second in studentMarkResult" :key="second.id">
                        <th style="padding: 5px; color: #d9534f">
                          {{ second.subject.subject }}
                        </th>
                        <td style="padding: 5px">{{ second.ca1 }}</td>
                        <td style="padding: 5px">{{ second.ca2 }}</td>
                        <td style="padding: 5px">{{ second.tca }}</td>
                        <td style="padding: 5px">{{ second.exam }}</td>
                        <td style="padding: 5px">
                          {{ second.exam_total }}
                        </td>

                        <td
                          v-if="
                            second.grade == null ? '' : second.grade.name == 'F'
                          "
                          style="padding: 5px; color: #d9534f"
                        >
                          {{ second.grade == null ? '' : second.grade.name }}
                        </td>

                        <td v-else style="padding: 5px; color: green">
                          {{ second.grade == null ? '' : second.grade.name }}
                        </td>

                        <td
                          style="padding: 5px"
                          v-html="position(second.sub_position)"
                        ></td>

                        <td
                          v-if="
                            second.grade == null ? '' : second.grade.name == 'F'
                          "
                          style="padding: 5px; color: #d9534f"
                        >
                          {{ second.grade == null ? '' : second.grade.remark }}
                        </td>

                        <td v-else style="padding: 5px; color: green">
                          {{ second.grade == null ? '' : second.grade.remark }}
                        </td>
                      </tr>

                      <tr
                        v-for="(third, index) in studentExamResult"
                        :key="index"
                        style="color: #1c0988"
                      >
                        <th style="padding: 5px" colspan="3">
                          Total score obtained: {{ third.total }}
                        </th>
                        <th style="padding: 5px" colspan="3">
                          Final Average: {{ third.avg }}
                        </th>
                        <th style="padding: 5px" colspan="3">
                          Class Average: {{ third.klase_avg }}
                        </th>
                      </tr>
                    </table>
                  </div>

                  <!-- comments -->

                  <div
                    class="d-flex justify-content-between"
                    style="margin-top: 45px"
                  >
                    <div class="mt-4" style="width: 320px">
                      <div class="mr-2" style="width: 320px">
                        <div
                          class="text-center p-1"
                          style="
                            margin: 0;
                            background-color: #007bff93;
                            font-weight: bold;
                            color: #fff;
                          "
                        >
                          A GRADE KEY
                        </div>
                      </div>

                      <div class="blue p-2">
                        <span
                          class="p-1 mt-2 d-flex justify-content-between"
                          style="color: #000"
                          v-for="grade in grades"
                          :key="grade.id"
                        >
                          <span>{{ grade.name }} - {{ grade.remark }}</span>
                          <span class="ml-auto m-r-2" style="color: #000"
                            >{{ grade.mark_from }} - {{ grade.mark_to }} %</span
                          >
                        </span>
                      </div>
                    </div>

                    <!-- comments -->

                    <div class="mt-4 ml-3">
                      <div class="p-1" style="width: 620px">
                        <div
                          class="text-center p-1"
                          style="
                            margin: 0;
                            background-color: #007bff93;
                            color: #fff;
                          "
                        >
                          Principal's Remark
                        </div>
                        <div v-if="!studentExamResult"></div>
                        <h6
                          v-else
                          class="blue p-3"
                          style="color: #000; font-style: italic"
                        >
                          {{ studentExamResult[0].p_comment }}
                        </h6>
                      </div>

                      <div class="p-1" style="width: 620px">
                        <div
                          class="text-center p-1"
                          style="
                            margin: 0;
                            background-color: #007bff93;
                            color: #fff;
                          "
                        >
                          Head Teacher's Remark
                        </div>
                        <div v-if="!studentExamResult"></div>
                        <h6
                          v-else
                          class="blue p-2"
                          style="color: #000; font-style: italic"
                        >
                          {{ studentExamResult[0].t_comment }}
                          {{
                            studentExamResult[0].avg > 50
                              ? studentExamResult[0].t_comment
                              : 'A poor performance'
                          }}
                        </h6>
                      </div>

                      <div
                        class="p-1"
                        style="
                          width: 620px;
                          border: 0px solid #111;
                          margin-top: 0.2px;
                        "
                      >
                        <div
                          class="text-center p-1"
                          style="
                            margin: 0;

                            color: #fff;
                          "
                        ></div>

                        <h6 class="p-4 text-center">
                          <div v-if="mainWorkspace.stamp == null"></div>
                          <img
                            v-else
                            :src="`data:image/png;base64,${encodedImages.stampBase64}`"
                            alt="stamp/signature"
                            width="50"
                          />
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-center mb-4">
              <b-button
                variant="secondary"
                pill
                size="md"
                @click.prevent="makePDF"
                ><b-icon icon="printer" /> print</b-button
              >
            </div>
          </div>
        </div>
      </div>

      <!-- edit modal -->

      <ExamResultCommitsModal
        v-if="examRecords"
        v-model="isResultComments"
        :studentExamResult="examRecords"
        :student="[klaseId, studentId, term, sessionId, sectionId]"
      />
      <!-- end modal -->
    </div>
  </div>
</template>

<script>
import html2PDF from 'jspdf-html2canvas'
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import { STUDENT_EXAM_RESULT_QUERIES } from '~/graphql/examRecord/queries'
import { STUDENT_MARK_RESULT_QUERIES } from '~/graphql/marks/queries'
import { GRADE_QUERIES } from '~/graphql/grades/queries'
import { SET_PROMOTION_QUERIES } from '~/graphql/promotions/queries'
import ExamResultCommitsModal from '~/components/Exam/ResultCommentsModal.vue'
import Preload from '~/components/Preload.vue'
import { ENCODED_IMAGE_QUERIES } from '~/graphql/students/queries'

export default {
  components: { ExamResultCommitsModal, Preload },
  middleware: 'auth',
  data: () => ({
    isResultComments: false,
    examRecords: null,
    setPromotion: {},
    customers: '',
  }),

  computed: {
    nowLoading() {
      return (
        this.$apollo.queries.studentExamResult.loading &&
        this.$apollo.queries.studentMarkResult.loading
      )
    },

    numStudents() {
      return this.$route.query.numStudents
    },
    term() {
      return this.$route.query.student[1]
    },
    studentId() {
      return this.$route.params.slug
    },
    klaseId() {
      return this.$route.query.student[0]
    },
    sessionId() {
      return this.$route.query.student[2]
    },
    sectionId() {
      return this.$route.query.student[3]
    },
    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
    teacherRemarks() {
      return this.teacherRemark()
    },
  },

  apollo: {
    studentExamResult: {
      query: STUDENT_EXAM_RESULT_QUERIES,
      variables() {
        return {
          klase_id: parseInt(this.klaseId),
          student_id: parseInt(this.studentId),
          term_id: parseInt(this.term),
          session_id: parseInt(this.sessionId),
          section_id: parseInt(this.sectionId),
          workspaceId: parseInt(this.mainWorkspace.id),
        }
      },
    },

    encodedImages: {
      query: ENCODED_IMAGE_QUERIES,
      variables() {
        return {
          studentId: parseInt(this.studentId),
          workspaceId: parseInt(this.mainWorkspace.id),
        }
      },
    },

    //
    studentMarkResult: {
      query: STUDENT_MARK_RESULT_QUERIES,
      variables() {
        return {
          klase_id: parseInt(this.klaseId),
          student_id: parseInt(this.studentId),
          term_id: parseInt(this.term),
          session_id: parseInt(this.sessionId),
          section_id: parseInt(this.sectionId),
          workspaceId: parseInt(this.mainWorkspace.id),
        }
      },
    },
    grades: {
      query: GRADE_QUERIES,
      variables() {
        return {
          workspaceId: parseInt(this.mainWorkspace.id),
        }
      },
    },
    setPromotion: {
      query: SET_PROMOTION_QUERIES,
      variables() {
        return {
          workspaceId: parseInt(this.mainWorkspace.id),
        }
      },
    },
  },

  methods: {    
    makePDF() {
      const pages = document.querySelector('#card')

      html2PDF(pages, {
        jsPDF: {
          format: 'a4',
        },
        html2canvas: {
          imageTimeout: 15000,
          logging: false,
          useCORS: true,
        },
        imageType: 'image/jpeg',
        output: './pdf/generate.pdf',
      })
    },
    position(i) {
      const j = i % 10
      const k = i % 100
      if (j == 1 && k != 11) {
        return i + '<sup>st</sup>'
      }
      if (j == 2 && k != 12) {
        return i + `<sup>nd</sup>`
      }
      if (j == 3 && k != 13) {
        return i + '<sup>rd</sup>'
      }
      if (i > 3) {
        return i + '<sup>th</sup>'
      }
    },
    teacherRemark() {
      const a = this.studentExamResult[0].t_comment
      a.substring(0, 50)
    },
    getAge(item) {
      const dob = new Date(item)
      const month_diff = Date.now() - dob.getTime()
      const age_dt = new Date(month_diff)
      const year = age_dt.getUTCFullYear()
      const age = Math.abs(year - 1970)
      return age + ' years'
    },
    generateReport() {
      this.$refs.html2Pdf.generatePdf()
    },
    handleEditCommits() {
      this.examRecords = this.studentExamResult
      this.isResultComments = true
    },
  },
}
</script>
<style scoped>
.blue {
  background-color: #007bff07;
}
</style>
