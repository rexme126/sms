<template>
  <div>
    <b-card>
      <template v-if="studentMarkResult.length != 0">
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
            <div class="p-4">
              <div
                style="
                  border: 2px solid #111;
                  font-weight: bold;
                  width: 90%;
                  margin: auto;
                "
              >
                <div
                  v-for="first in studentExamResult"
                  :key="first.id"
                  style="
                    margin-top: 10px;
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
                  >
                    <div class="school-logo">
                      <div v-if="mainWorkspace.logo == null"></div>
                      <div v-else-if="encodedImages">
                        <img
                          :src="`data:image/png;base64,${encodedImages.logoBase64}`"
                          alt="logo"
                          width="50"
                        />
                      </div>
                    </div>
                    <div class="d-flex flex-column align-items-center">
                      <h1 style="font-weight: bold; color: #1c0988">
                        {{ mainWorkspace.name }}
                      </h1>
                      <h4 style="font-weight: bold; color: #1c0988">
                        Result sheet {{ first.klase.name }}
                      </h4>
                    </div>
                    <div class="student-picture">
                      <div v-if="first.student.photo == null"></div>
                      <div v-else-if="encodedImages">
                        <img
                          :src="`data:image/png;base64,${encodedImages.photoBase64}`"
                          alt="photo"
                          width="100"
                        />
                      </div>
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
                        <th
                          v-if="student[1] == 1"
                          style="padding: 5px"
                          colspan="1"
                        >
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
                          v-if="student[1] == 2"
                          style="padding: 5px"
                          colspan="1"
                        >
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
                          v-if="student[1] == 3 && first.ps != 'graduated'"
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
                          v-if="student[1] == 3 && first.ps == 'graduated'"
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
                        <th
                          style="padding: 5px"
                          colspan="1"
                          v-if="student[1] == 1"
                        >
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

                        <th
                          style="padding: 5px"
                          colspan="1"
                          v-if="student[1] == 2"
                        >
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

                        <th
                          style="padding: 5px"
                          colspan="1"
                          v-if="student[1] == 3"
                        >
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

                <!-- table -->

                <div
                  style="
                    overflow-x: auto;
                    font-weight: bold;
                    width: 98%;
                    margin: 20px auto;
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
                        <th style="padding: 5px; color: #1c0988">
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
                        <h6 v-else class="blue p-3" style="color: #000">
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
                          <div v-else-if="encodedImages">
                            <img
                              :src="`data:image/png;base64,${encodedImages.stampBase64}`"
                              alt="stamp"
                              width="50"
                            />
                          </div>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </vue-html2pdf>
        <div class="d-flex justify-content-center mb-4">
          <b-button
            variant="danger"
            size="md"
            pill
            @click.prevent="generateReport"
            ><b-icon variant="seccondary" icon="printer" /> print</b-button
          >
        </div>
      </template>

      <template v-else>
        <h3 class="text-center p-5">No Record Found</h3>
      </template>
    </b-card>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import { SET_PROMOTION_QUERIES } from '~/graphql/promotions/queries'
import { GRADE_QUERIES } from '~/graphql/grades/queries'
import { ENCODED_IMAGE_QUERIES } from '~/graphql/students/queries'
export default {
  props: {
    studentExamResult: Array,
    studentMarkResult: Array,
    student: Array,
  },
  data: () => ({
    setPromotion: {},
  }),
  computed: {
    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
    numStudents() {
      return this.student[4]
    },
  },
  apollo: {
    encodedImages: {
      query: ENCODED_IMAGE_QUERIES,
      variables() {
        return {
          studentId: parseInt(this.studentExamResult[0].student.id),
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
    grades: {
      query: GRADE_QUERIES,
      variables() {
        return {
          workspaceId: parseInt(this.mainWorkspace.id),
        }
      },
    },
  },
  methods: {
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
  },
}
</script>
<style scoped>
.blue {
  background-color: #007bff07;
}
</style>
