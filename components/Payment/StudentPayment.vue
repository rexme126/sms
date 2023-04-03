<template>
  <div class="student-payment">
    <b-card no-body style="border-radius: 6px">
      <b-tabs card>
        <b-tab active>
          <template #title>
            <strong>Incomplete Payment</strong>
          </template>

          <b-card class="card-student">
            <hr />
            <b-container fluid>
              <!-- User Interface controls -->
              <b-row>
                <b-col lg="6" class="my-1">
                  <b-form-group
                    v-slot="{ ariaDescribedby }"
                    label="Sort"
                    label-for="sort-by-select"
                    label-cols-sm="3"
                    label-align-sm="right"
                    label-size="md"
                    class="mb-0"
                  >
                    <b-input-group size="md">
                      <b-form-select
                        id="sort-by-select"
                        v-model="sortBy"
                        :options="sortOptions"
                        :aria-describedby="ariaDescribedby"
                        class="w-75"
                        style="background-color: #f9f9f9"
                      >
                        <template #first>
                          <option value="">-- none --</option>
                        </template>
                      </b-form-select>

                      <b-form-select
                        v-model="sortDesc"
                        :disabled="!sortBy"
                        :aria-describedby="ariaDescribedby"
                        size="md"
                        class="w-10"
                      >
                        <option :value="false">Asc</option>
                        <option :value="true">Desc</option>
                      </b-form-select>
                    </b-input-group>
                  </b-form-group>
                </b-col>

                <b-col lg="6" class="my-1">
                  <b-form-group
                    label="Initial sort"
                    label-for="initial-sort-select"
                    label-cols-sm="3"
                    label-align-sm="right"
                    label-size="md"
                    class="mb-0"
                  >
                    <b-form-select
                      id="initial-sort-select"
                      v-model="sortDirection"
                      :options="['asc', 'desc', 'last']"
                      size="sm"
                    ></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col lg="6" class="my-1">
                  <b-form-group
                    label="Filter"
                    label-for="filter-input"
                    label-cols-sm="3"
                    label-align-sm="right"
                    label-size="md"
                    class="mb-0"
                  >
                    <b-input-group size="md">
                      <b-form-input
                        id="filter-input"
                        v-model="filter"
                        type="search"
                        placeholder="Type to Search"
                        style="background-color: #f9f9f9"
                      ></b-form-input>

                      <b-input-group-append>
                        <b-button :disabled="!filter" @click="filter = ''"
                          >Clear</b-button
                        >
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-col>

                <b-col lg="6" class="my-1">
                  <b-form-group
                    v-slot="{ ariaDescribedby }"
                    v-model="sortDirection"
                    label="Filter On"
                    description="Leave all unchecked to filter on all data"
                    label-cols-sm="3"
                    label-align-sm="right"
                    label-size="sm"
                    class="mb-0"
                  >
                    <b-form-checkbox-group
                      v-model="filterOn"
                      :aria-describedby="ariaDescribedby"
                      class="mt-1"
                    >
                      <b-form-checkbox value="name">Name</b-form-checkbox>
                      <b-form-checkbox value="photo">Photo</b-form-checkbox>
                      <b-form-checkbox value="paid">Paid Fee</b-form-checkbox>
                      <b-form-checkbox value="gender">Gender</b-form-checkbox>
                    </b-form-checkbox-group>
                  </b-form-group>
                </b-col>
              </b-row>

              <b-row>
                <b-col md="1"></b-col>
                <b-col sm="5" md="3" class="my-1">
                  <b-form-group
                    label="Show"
                    label-for="per-page-select"
                    label-cols-sm="6"
                    label-cols-md="4"
                    label-cols-lg="3"
                    label-align-sm="right"
                    label-size="md"
                    class="mb-0"
                  >
                    <b-form-select
                      id="per-page-select"
                      v-model="perPage"
                      :options="pageOptions"
                      size="lg"
                      style="background-color: #f9f9f9"
                    ></b-form-select>
                  </b-form-group> </b-col
              ></b-row>

              <br /><br />
              <!-- Main table element -->
              <b-table
                :items="paymentRecords"
                :fields="fields"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                :filter-included-fields="filterOn"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                show-empty
                small
                striped
                hover
                :responsive="true"
                @filtered="onFiltered"
              >
                <template #cell(index)="data">
                  {{ data.index + 1 }}
                </template>

                <template #cell(student)="data">
                  {{ data.item.student.first_name }}
                  {{ data.item.student.last_name }}
                </template>

                <template #cell(klase)="data">
                  {{ data.item.klase.name }}
                </template>
                <template #cell(term)="data">
                  {{ data.item.term.name }}
                </template>
                <template #cell(session)="data">
                  {{ data.item.session.name }}
                </template>

                <template #cell(paidNow)="data">
                  <div>
                    <b-row no-gutters>
                      <b-col md="4">
                        <input
                          style="width: 10rem; padding: 0.3rem 0 3px 9px"
                          @keydown.enter="
                            payFee(data.item, $event.target.value)
                          "
                          :ref="`t-${data.item.id}`"
                          type="number"
                          placeholder="Pay now"
                          min="1"
                          :max="`${data.item.balance}`"
                          required
                          size="md"
                        />
                      </b-col>
                    </b-row>
                  </div>
                </template>

                <!-- view modal -->
                <template #cell(actions)="data">
                  <!-- <b-button
                    variant="danger"
                    size="md"
                    class="px-3"
                    type="submit"
                    disabled
                    @click="getModal(data.item.id)"
                  >
                    Reset
                  </b-button> -->

                  <b-button
                    v-show="data.item.amt_paid > 0"
                    variant="success"
                    size="sm"
                    class="px-3 ml-2"
                    @click.prevent="generateReport"
                  >
                    <b-icon class="ml-2" icon="printer" />

                    Print
                  </b-button>

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
                      <b-card class="display">
                        <div
                          style="padding: 8px; margin: auto; min-height: 100vh"
                        >
                          <div class="mt-4">
                            <div class="text-center mb-4">
                              <div v-if="mainWorkspace.logo == null"></div>
                              <div v-else-if="encodedImages">
                                <img
                                  :src="`data:image/png;base64,${encodedImages.logo}`"
                                  alt="logo"
                                  width="100"
                                />
                              </div>
                            </div>

                            <h1
                              class="text-center"
                              style="
                                color: #1c0988;
                                text-transform: uppercase;
                                font-weight: bold;
                              "
                            >
                              {{ mainWorkspace.name }}
                            </h1>
                            <h6
                              class="text-center"
                              style="
                                text-transform: uppercase;
                                color: #1c0988;
                                font-weight: bold;
                                margin-bottom: 8px;
                              "
                            >
                              {{ data.item.term.name }} Payment Receipt ({{
                                data.item.session.name
                              }}
                              Session)
                            </h6>
                          </div>

                          <div
                            class="d-flex justify-content-align mt-2 mb-2 p-2"
                            style="background-color: #007bff; color: #fff"
                          >
                            STUDENT INFORMATION
                          </div>

                          <div class="d-flex justify-content-center">
                            <div v-if="data.item.student.photo == null"></div>
                            <div v-else-if="encodedImages">
                              <b-img
                                :src="`data:image/png;base64,${encodedImages.photoBase64}`"
                                alt="photo"
                                width="100"
                              ></b-img>
                            </div>
                          </div>

                          <div class="d-flex justify-content-between mt-4">
                            <div>
                              <h6>FULL NAME:</h6>
                              <h6>ADM_NO:</h6>
                              <h6>CLASS:</h6>
                            </div>

                            <div style="text-transform: uppercase">
                              <h6>
                                {{ data.item.student.first_name }}
                                {{ data.item.student.last_name }}
                                {{ data.item.student.middle_name }}
                              </h6>
                              <h6>
                                {{ data.item.student.adm_no }}
                              </h6>
                              <h6>{{ data.item.student.last_name }}</h6>
                              <h6>{{ data.item.klase.name }}</h6>
                            </div>
                          </div>

                          <h5
                            class="d-flex justify-content-align mt-4 mb-2 p-2"
                            style="background-color: #007bff; color: #fff"
                          >
                            PAYMENT INFORMATION
                          </h5>
                          <div class="d-flex justify-content-between mt-4">
                            <div>
                              <h6>TITLE:</h6>

                              <h6>REFERENCE:</h6>

                              <h6>Amount</h6>

                              <h6>Amount Paid:</h6>

                              <h6>Balance</h6>
                              <h6>Payment Date</h6>
                            </div>

                            <div style="margin-left: 3rem">
                              <h6>{{ data.item.title }}</h6>
                              <h6>{{ data.item.ref_no }}</h6>
                              <h6>
                                <span>&#x20A6;</span>{{ data.item.amount }}
                              </h6>
                              <h6>
                                <span>&#x20A6;</span>{{ data.item.amt_paid }}
                              </h6>
                              <h6>
                                <span>&#x20A6;</span>{{ data.item.balance }}
                              </h6>
                              <h6>
                                {{ data.item.created_at | formatDate }}
                              </h6>
                            </div>
                          </div>
                          <hr />
                        </div>
                      </b-card>
                    </section>
                  </vue-html2pdf>
                </template>

                <template #row-details="row">
                  <b-card>
                    <ul>
                      <li v-for="(value, key) in row.item" :key="key">
                        {{ key }}: {{ value }}
                      </li>
                    </ul>
                  </b-card>
                </template>
              </b-table>
            </b-container>
          </b-card>

          <!-- modal -->
          <!-- <b-modal
                    :id="infoModal"
                    class="modal"
                    :hide-backdrop="false"
                    body-bg-variant=""
                    size="sm"
                    centered
                    :hide-footer="true"
                  >
                    <template #default="{ hide }">
                      <div class="p-4 text-center">
                        <h6 class="mb-3">
                          This payment will be reset to default.
                        </h6>
                        <h5>Are you sure you want to continue?</h5>

                        <div class="mt-4">
                          <b-button
                            variant="link"
                            class="px-4 mr-2"
                            pill
                            @click="hide"
                          >
                            Cancel
                          </b-button>
                          <b-button
                            type="submit"
                            variant="danger"
                            class="px-4"
                            pill
                            :disabled="resetBusy"
                            @click="resetPayment"
                          >
                            <b-spinner v-if="resetBusy" class="mr-1" small />
                            Reset
                          </b-button>
                        </div>
                      </div>
                    </template>
                  </b-modal> -->
          <!-- end modal -->
        </b-tab>

        <b-tab>
          <template #title>
            <strong>Complete Payment</strong>
          </template>

          <b-card class="card-student">
            <hr />
            <b-container fluid>
              <!-- User Interface controls -->
              <b-row>
                <b-col lg="6" class="my-1">
                  <b-form-group
                    v-slot="{ ariaDescribedby }"
                    label="Sort"
                    label-for="sort-by-select"
                    label-cols-sm="3"
                    label-align-sm="right"
                    label-size="md"
                    class="mb-0"
                  >
                    <b-input-group size="md">
                      <b-form-select
                        id="sort-by-select"
                        v-model="sortBy"
                        :options="sortOptions"
                        :aria-describedby="ariaDescribedby"
                        class="w-75"
                        style="background-color: #f9f9f9"
                      >
                        <template #first>
                          <option value="">-- none --</option>
                        </template>
                      </b-form-select>

                      <b-form-select
                        v-model="sortDesc"
                        :disabled="!sortBy"
                        :aria-describedby="ariaDescribedby"
                        size="md"
                        class="w-10"
                      >
                        <option :value="false">Asc</option>
                        <option :value="true">Desc</option>
                      </b-form-select>
                    </b-input-group>
                  </b-form-group>
                </b-col>

                <b-col lg="6" class="my-1">
                  <b-form-group
                    label="Initial sort"
                    label-for="initial-sort-select"
                    label-cols-sm="3"
                    label-align-sm="right"
                    label-size="md"
                    class="mb-0"
                  >
                    <b-form-select
                      id="initial-sort-select"
                      v-model="sortDirection"
                      :options="['asc', 'desc', 'last']"
                      size="sm"
                    ></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col lg="6" class="my-1">
                  <b-form-group
                    label="Filter"
                    label-for="filter-input"
                    label-cols-sm="3"
                    label-align-sm="right"
                    label-size="md"
                    class="mb-0"
                  >
                    <b-input-group size="md">
                      <b-form-input
                        id="filter-input"
                        v-model="filter"
                        type="search"
                        placeholder="Type to Search"
                        style="background-color: #f9f9f9"
                      ></b-form-input>

                      <b-input-group-append>
                        <b-button :disabled="!filter" @click="filter = ''"
                          >Clear</b-button
                        >
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-col>

                <b-col lg="6" class="my-1">
                  <b-form-group
                    v-slot="{ ariaDescribedby }"
                    v-model="sortDirection"
                    label="Filter On"
                    description="Leave all unchecked to filter on all data"
                    label-cols-sm="3"
                    label-align-sm="right"
                    label-size="sm"
                    class="mb-0"
                  >
                    <b-form-checkbox-group
                      v-model="filterOn"
                      :aria-describedby="ariaDescribedby"
                      class="mt-1"
                    >
                      <b-form-checkbox value="name">Name</b-form-checkbox>
                      <b-form-checkbox value="photo">Photo</b-form-checkbox>
                      <b-form-checkbox value="paid">Paid Fee</b-form-checkbox>
                      <b-form-checkbox value="gender">Gender</b-form-checkbox>
                    </b-form-checkbox-group>
                  </b-form-group>
                </b-col>
              </b-row>

              <b-row>
                <b-col md="1"></b-col>
                <b-col sm="5" md="3" class="my-1">
                  <b-form-group
                    label="Show"
                    label-for="per-page-select"
                    label-cols-sm="6"
                    label-cols-md="4"
                    label-cols-lg="3"
                    label-align-sm="right"
                    label-size="md"
                    class="mb-0"
                  >
                    <b-form-select
                      id="per-page-select"
                      v-model="perPage"
                      :options="pageOptions"
                      size="lg"
                      style="background-color: #f9f9f9"
                    ></b-form-select>
                  </b-form-group> </b-col
              ></b-row>

              <br /><br />
              <!-- Main table element -->
              <b-table
                :items="paidPaymentRecords"
                :fields="fields"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                :filter-included-fields="filterOn"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                show-empty
                small
                striped
                hover
                :responsive="true"
                @filtered="onFiltered"
              >
                <template #cell(index)="data">
                  {{ data.index + 1 }}
                </template>

                <template #cell(student)="data">
                  {{ data.item.student.first_name }}
                  {{ data.item.student.last_name }}
                </template>

                <template #cell(klase)="data">
                  {{ data.item.klase.name }}
                </template>
                <template #cell(term)="data">
                  {{ data.item.term.name }}
                </template>
                <template #cell(session)="data">
                  {{ data.item.session.name }}
                </template>
                <template #cell(paidNow)="data">
                  {{ data.item.status }}
                </template>

                <!-- view modal -->
                <template #cell(actions)="data">
                  <b-button
                    variant="secondary"
                    size="sm"
                    class="px-3 ml-2"
                    @click.prevent="generateReports"
                  >
                    <b-icon class="ml-2" icon="printer" />

                    Print
                  </b-button>

                  <vue-html2pdf
                    ref="html2Pdf1"
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
                      <div class="display" style="padding: 2rem; margin: auto">
                        <div class="mt-3 mb-4">
                          <div class="text-center mb-2">
                            <div v-if="mainWorkspace.logo == null"></div>
                            <div v-else-if="encodedImages">
                              <b-img
                                :src="`data:image/png;base64,${encodedImages.logoBase64}`"
                                alt="logo"
                                width="100"
                              ></b-img>
                            </div>
                          </div>

                          <h2
                            class="text-center"
                            style="
                              color: #1c0988;
                              text-transform: uppercase;
                              font-weight: bold;
                            "
                          >
                            {{ mainWorkspace.name }}
                          </h2>
                          <h6
                            class="text-center"
                            style="
                              text-transform: uppercase;
                              color: #1c0988;
                              font-weight: bold;
                              margin-bottom: 5px;
                            "
                          >
                            {{ data.item.term.name }} Payment Receipt ({{
                              data.item.session.name
                            }}
                            Session)
                          </h6>
                        </div>

                        <div
                          class="d-flex justify-content-align mt-4 mb-2 p-2"
                          style="
                            background-color: #007bff;
                            font-weight: bold;
                            color: #fff;
                          "
                        >
                          STUDENT INFORMATION
                        </div>

                        <div class="d-flex justify-content-center">
                          <div v-if="data.item.student.photo == null"></div>
                          <div v-else-if="encodedImages">
                            <b-img
                              :src="`data:image/png;base64,${encodedImages.photoBase64}`"
                              alt="photo"
                              width="100"
                            ></b-img>
                          </div>
                        </div>

                        <div class="d-flex justify-content-between mt-4">
                          <div>
                            <h6>FULL NAME:</h6>
                            <h6>ADM_NO:</h6>
                            <h6>CLASS:</h6>
                          </div>

                          <div style="text-transform: uppercase">
                            <h6>
                              {{ data.item.student.first_name }}
                              {{ data.item.student.last_name }}
                              {{ data.item.student.middle_name }}
                            </h6>
                            <h6>
                              {{ data.item.student.adm_no }}
                            </h6>
                            <h6>{{ data.item.student.last_name }}</h6>
                            <h6>{{ data.item.klase.name }}</h6>
                          </div>
                        </div>

                        <h5
                          class="d-flex justify-content-align mt-3 p-2"
                          style="
                            background-color: #007bff;
                            font-weight: bold;
                            color: #fff;
                          "
                        >
                          PAYMENT INFORMATION
                        </h5>
                        <div class="d-flex justify-content-between mt-3">
                          <div>
                            <h6>TITLE:</h6>

                            <h6>REFERENCE:</h6>

                            <h6>Amount</h6>

                            <h6>Amount Paid:</h6>

                            <h6>Balance</h6>
                            <h6>Payment Date</h6>
                          </div>

                          <div style="margin-left: 3rem">
                            <h6>{{ data.item.title }}</h6>
                            <h6>{{ data.item.ref_no }}</h6>
                            <h6><span>&#x20A6;</span>{{ data.item.amount }}</h6>
                            <h6>
                              <span>&#x20A6;</span>{{ data.item.amt_paid }}
                            </h6>
                            <h6>
                              <span>&#x20A6;</span>{{ data.item.balance }}
                            </h6>
                            <h6>
                              {{ data.item.created_at | formatDate }}
                            </h6>
                          </div>
                        </div>
                        <hr />
                      </div>
                    </section>
                  </vue-html2pdf>
                </template>

                <template #row-details="row">
                  <b-card>
                    <ul>
                      <li v-for="(value, key) in row.item" :key="key">
                        {{ key }}: {{ value }}
                      </li>
                    </ul>
                  </b-card>
                </template>
              </b-table>
            </b-container>
          </b-card>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import Swal from 'sweetalert2'
import {
  CREATE_PAYMENT_RECORD_MUTATION,
  RESET_PAYMENT_RECORD_MUTATION,
} from '~/graphql/payments/mutations'
import { PAYMENT_RECORD_QUERIES } from '~/graphql/payments/queries'
import { ENCODED_IMAGE_QUERIES } from '~/graphql/students/queries'
export default {
  props: {
    paymentRecords: Array,
    paidPaymentRecords: Array,
    student: Array,
  },
  data() {
    return {
      id: null,
      resetBusy: false,
      payment: {},
      infoModal: 'modelInfo',
      resetThisPayment: 'reset-Payment',
      form: new this.$form({
        id: null,
        class: null,
        term: null,
        session: null,
        amounts: null,
        busy: false,
      }),

      items: [],

      fields: [
        {
          key: 'index',
          label: 'S/N',
        },
        {
          key: 'student',
          label: 'Name',
          sortable: true,
          // sortDirection: 'desc',
        },

        {
          key: 'ref_no',
          label: 'Ref No.',
          sortable: true,
          // sortDirection: 'desc',
        },
        {
          key: 'klase',
          label: 'Class',
          sortable: true,
          // sortDirection: 'desc',
        },
        {
          key: 'term',
          label: 'Term',
          sortable: true,
          // sortDirection: 'desc',
        },
        {
          key: 'session',
          label: 'Session',
          sortable: true,
          // sortDirection: 'desc',
        },
        {
          key: 'amount',
          label: 'Amount',
          sortable: true,
          // sortDirection: 'desc',
        },
        {
          key: 'amt_paid',
          label: 'Paid',
          sortable: true,

          // sortDirection: 'desc',
        },
        {
          key: 'balance',
          label: 'Balance',
          sortable: true,
          // sortDirection: 'desc',
        },
        {
          key: 'paidNow',
          label: 'Paid Now',
          sortable: true,
          // sortDirection: 'desc',
        },
        { key: 'actions', label: 'Actions' },
      ],
      slug: '',
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [50, 100, { value: 200, text: 'Show a lot' }],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      infoModal: 'info-modal',
    }
  },
  apollo: {
    encodedImages: {
      query: ENCODED_IMAGE_QUERIES,
      variables() {
        return {
          studentId: 4,
          workspaceId: parseInt(this.mainWorkspace.id),
        }
      },
    },
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter((f) => f.sortable)
        .map((f) => {
          return { text: f.label, value: f.key }
        })
    },
    ...mapState(useWorkspaceStore, ['currentWorkspace']),
    mainWorkspace() {
      return this.currentWorkspace
    },
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length
  },
  methods: {
    generateReport() {
      this.$refs.html2Pdf.generatePdf()
    },
    generateReports() {
      this.$refs.html2Pdf1.generatePdf()
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    // getModal(item) {
    //   this.id = item
    //   this.$bvModal.show(this.infoModal)
    // },
    // resetPayment() {
    //   this.resetBusy = true
    //   this.$apollo
    //     .mutate({
    //       mutation: RESET_PAYMENT_RECORD_MUTATION,
    //       variables: {
    //         id: parseInt(this.id),
    //         workspaceId: parseInt(this.mainWorkspace.id),
    //       },
    //       update: (store, { data: { createPaymentRecord } }) => {
    //         // Read the data from our cache for this query.
    //         const data = store.readQuery({
    //           query: PAYMENT_RECORD_QUERIES,
    //           variables: {
    //             klase_id: parseInt(this.student[0]),
    //             session_id: parseInt(this.student[2]),
    //             term_id: parseInt(this.student[1]),
    //             workspaceId: parseInt(this.mainWorkspace.id),
    //           },
    //         })

    //         data.paymentRecords = data.paymentRecords.filter((t) => {
    //           return t.status === 'Due'
    //         })

    //         store.writeQuery({
    //           query: PAYMENT_RECORD_QUERIES,
    //           variables: {
    //             klase_id: parseInt(this.student[0]),
    //             session_id: parseInt(this.student[2]),
    //             term_id: parseInt(this.student[1]),
    //             workspaceId: parseInt(this.mainWorkspace.id),
    //           },
    //           data,
    //         })
    //       },
    //     })
    //     .then(({ data }) => {
    //       this.$bvModal.hide(this.infoModal)
    //       this.resetBusy = false
    //     })
    // },

    payFee(item, value) {
      if (value > item.balance) {
        Swal.fire({
          title: 'Ooops...',
          icon: 'warning',
          text: `Amount entered can't be greater than the balance`,
          position: 'center',
          color: '#fff',
          background: '#cc3300',
          toast: false,
          backdrop: false,
          timer: 2000,
          showConfirmButton: false,
        })
        return
      }

      if (value == null || value == 0) {
        Swal.fire({
          title: 'Ooops...',
          icon: 'warning',
          text: 'Field cannot be empty!',
          position: 'center',
          color: '#fff',
          background: '#cc3300',
          toast: false,
          backdrop: false,
          timer: 1500,
          showConfirmButton: false,
        })
      } else {
        const payId = item.id
        const payValue = value
        this.$refs[`t-${payId}`].value = null

        this.$apollo
          .mutate({
            mutation: CREATE_PAYMENT_RECORD_MUTATION,
            variables: {
              id: parseInt(payId),
              amt_paid: parseInt(payValue),
              workspaceId: parseInt(this.mainWorkspace.id),
            },
            update: (store, { data: { createPaymentRecord } }) => {
              // Read the data from our cache for this query.
              const data = store.readQuery({
                query: PAYMENT_RECORD_QUERIES,
                variables: {
                  klase_id: parseInt(this.student[0]),
                  session_id: parseInt(this.student[2]),
                  term_id: parseInt(this.student[1]),
                  workspaceId: parseInt(this.mainWorkspace.id),
                },
              })

              data.paymentRecords = data.paymentRecords.filter((t) => {
                return t.status === 'Due'
              })

              store.writeQuery({
                query: PAYMENT_RECORD_QUERIES,
                variables: {
                  klase_id: parseInt(this.student[0]),
                  session_id: parseInt(this.student[2]),
                  term_id: parseInt(this.student[1]),
                  workspaceId: parseInt(this.mainWorkspace.id),
                },
                data,
              })
            },
          })
          .then(() => {
            Swal.fire({
              text: 'Fee payed successfully',
              timer: 1000,
              position: 'top-right',
              color: '#fff',
              background: '#4bb543',
              toast: false,
              backdrop: false,
              showConfirmButton: false,
            })
          })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.student-payment {
  .display {
    display: none;
  }

  .card-student {
    border: none;
    border-radius: 5px;
    height: auto;

    .input-group > .input-group-append > .btn,
    .input-group > .input-group-append > .input-group-text {
      background: var(--color-primary);
      color: #fff;
      font-size: 16px;
    }
    .input-group:not(.has-validation) > .custom-select:not(:last-child),
    .input-group > .form-control:not(:first-child),
    .input-group > .custom-select:not(:first-child),
    .custom-select {
      height: 38px;
      font-size: 12px;
    }
    .form-control,
    .mb-3 {
      height: 38px;
      font-size: 16px;
    }
  }
}
</style>
