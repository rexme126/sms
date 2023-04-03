<template>
  <div class="admin-payment">
    <b-card no-body style="border-radius: 6px">
      <b-tabs card>
        <b-tab active>
          <template #title>
            <strong>Incomplete Payment</strong>
          </template>
          <div class="table-down">
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
                  </section>
                </vue-html2pdf>
              </b-container>
            </b-card>
          </div>

          <div class="text-center">
            <b-button v-if="paymentRecords.length > 0"
              variant="danger"
              size="md"
              pill
              @click="generateReportDue"
            >
              <b-icon class="ml-2" icon="printer" />
              Print
            </b-button>
          </div>
        </b-tab>

        <b-tab>
          <template #title>
            <strong>Complete Payment</strong>
          </template>
          <div>
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

                <vue-html2pdf
                  ref="html2Pdf2"
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
                  </section>
                </vue-html2pdf>
              </b-container>
            </b-card>
          </div>

          <div class="text-center">
            <b-button v-if="paidPaymentRecords.length > 0"
              variant="warning"
              size="md"
              pill
              @click="generateReportPaid"
            >
              <b-icon class="ml-2" icon="printer" />
              Print
            </b-button>
          </div>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
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
      ],
      slug: '',
      totalRows: 1,
      currentPage: 1,
      perPage: 5,
      pageOptions: [50, { value: 200, text: 'Show a lot' }],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      infoModal: 'info-modal',
    }
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
    // download
    generateReportDue() {
      this.$refs.html2Pdf1.generatePdf()
    },

    generateReportPaid() {
      this.$refs.html2Pdf2.generatePdf()
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    getModal(item) {
      this.id = item
      this.$bvModal.show(this.infoModal)
    },
  },
}
</script>

<style lang="scss">
.admin-payment {
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
      font-size: 16px;
    }
    .form-control,
    .mb-3 {
      height: 38px;
      font-size: 16px;
    }
  }
}
</style>
