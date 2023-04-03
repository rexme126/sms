<template>
  <div class="leads-page p-3">
    <template v-if="$apollo.queries.allDuePaymentRecords.loading"
      ><Preload
    /></template>
    <template v-else>
      <div class="mb-2">
        <h5 class="mb-4">All Due Fee Payment</h5>
      </div>

      <div class="lead-wrapper">
        <div class="show-input-wrap">
          <div class="d-flex align-items-center">
            <span>Show</span
            ><b-form-select
              v-model="show"
              :options="shows"
              size="sm"
              class="ml-2"
              style="background-color: lightgray"
            ></b-form-select>
            <span class="ml-1">entries</span>
          </div>
        </div>

        <div class="search-input-wrap mr-3 ml-auto p-2">
          <b-form-input v-model="search" placeholder="Search..." />
          <b-icon
            style="color: #111"
            class="h5 mt-3 search-icon"
            icon="search"
          />
        </div>
      </div>

      <template v-if="$apollo.queries.allDuePaymentRecords.loading">
        <div class="bg-secoundary skeleton-table mt-2">
          <b-card class="shadow-sm border-0">
            <b-skeleton-table
              :rows="11"
              :columns="4"
              :table-props="{ bordered: false, striped: false }"
            ></b-skeleton-table>
          </b-card>
        </div>
      </template>

      <template v-else-if="allDuePaymentRecords.data.length > 0">
        <div class="shadow-sm table-wrap mt-2">
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
              <b-table-simple hover responsive>
                <b-thead>
                  <tr>
                    <b-th>S/N</b-th>
                    <b-th>Full Name</b-th>
                    <b-th>Ref No</b-th>
                    <b-th>class</b-th>
                    <b-th>term</b-th>
                    <b-th>Session</b-th>
                    <b-th>Amount</b-th>
                    <b-th>Amount Paid</b-th>
                    <b-th>Balance</b-th>
                    <b-th>Status</b-th>
                    <b-th>Receipt</b-th>
                  </tr>
                </b-thead>

                <tbody>
                  <b-tr
                    v-for="(payment, index) in searchFilter"
                    :key="payment.id"
                  >
                    <b-td>{{ index + 1 }}</b-td>
                    <b-td>
                      {{ payment.student.first_name }}
                      {{ payment.student.last_name }}
                    </b-td>
                    <b-td>
                      {{ payment.ref_no }}
                    </b-td>
                    <b-td>
                      {{ payment.klase.name }}
                    </b-td>
                    <b-td>
                      {{ payment.term.name }}
                    </b-td>
                    <b-td>
                      {{ payment.session.name }}
                    </b-td>
                    <b-td style="color: red">
                      {{ payment.amount }}
                    </b-td>
                    <b-td style="color: green">
                      {{ payment.amt_paid }}
                    </b-td>
                    <b-td style="color: red">
                      {{ payment.balance }}
                    </b-td>
                    <b-td style="color: red">
                      {{ payment.status }}
                    </b-td>
                    <b-td>
                      {{ payment.receipt }}
                    </b-td>

                    <!-- <b-td>{{ lead.createdAt | formatDate }} </b-td> -->
                  </b-tr>
                </tbody>
              </b-table-simple>
            </section>
          </vue-html2pdf>
          <div class="text-center">
            <b-button
              class="px-3 ml-2 text-center"
              variant="secondary"
              size="md"
              pill
              @click.prevent="generateReports"
            >
              <b-icon class="ml-2" icon="printer" />

              Print
            </b-button>
          </div>
        </div>

        <b-pagination-nav
          v-if="lastPage > 1"
          pills
          :link-gen="linkGen"
          :number-of-pages="lastPage"
          use-router
          align="right"
        ></b-pagination-nav>

        <!-- pagination -->
      </template>

      <template v-else-if="allDuePaymentRecords.data.length == 0">
        <b-card class="shadow-sm border-0 text-center no-lead mt-2 p-4">
          <div>
            <h4 class="mt-4 light-text">No record found.</h4>
          </div>
        </b-card>
      </template>
    </template>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import { ALL_DUE_PAYMENT_QUERY } from '~/graphql/payments/queries'
import Preload from '~/components/Preload.vue'

export default {
  components: { Preload },
  middleware: 'auth',

  data() {
    return {
      show: 10,
      search: '',
      selectedOptions: null,

      allDuePaymentRecords: {
        data: [],
        paginatorInfo: {
          lastPage: 1,
        },
      },

      shows: [
        { value: null, text: 10 },
        { value: 25, text: 25 },
        { value: 100, text: 100 },
        { value: 1000, text: 'more' },
      ],
    }
  },

  computed: {
    ...mapState(useWorkspaceStore, ['currentWorkspace']),
    mainWorkspace() {
      return this.currentWorkspace
    },

    currentPage() {
      if (
        parseInt(this.$route.query.page) >
          this.allDuePaymentRecords.paginatorInfo.lastPage ||
        Number.isInteger(parseInt(this.$route.query.page)) !== true
      ) {
        return 1
      } else {
        return parseInt(this.$route.query.page || 1)
      }
    },

    lastPage() {
      return this.allDuePaymentRecords.paginatorInfo.lastPage
    },
    searchFilter() {
      return this.allDuePaymentRecords.data.filter((t) => {
        return (
          t.klase.name.toLowerCase().match(this.search.toLowerCase()) ||
          t.student.first_name.toLowerCase().match(this.search.toLowerCase()) ||
          t.student.last_name.toLowerCase().match(this.search.toLowerCase()) ||
          t.session.name.match(this.search) ||
          t.term.name.toLowerCase().match(this.search.toLowerCase()) ||
          t.ref_no.toLowerCase().match(this.search.toLowerCase())
        )
      })
    },
  },

  apollo: {
    allDuePaymentRecords: {
      query: ALL_DUE_PAYMENT_QUERY,
      variables() {
        return {
          workspaceId: parseInt(this.mainWorkspace.id),
          // search: this.search,
          first: parseInt(this.show || 10),
          page: parseInt(this.currentPage),
        }
      },
    },
  },

  methods: {
    linkGen(pageNum) {
      return pageNum === 1 ? '?' : `?page=${pageNum}`
    },
    generateReports() {
      this.$refs.html2Pdf1.generatePdf()
    },
  },
}
</script>

<style lang="scss">
@import '~@/assets/scss/variables';

.leads-page {
  padding: 40px 45px 10px 45px;
  .lead-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .search-input-wrap {
      width: 270px;
      position: relative;
      display: flex;

      & .search-icon {
        position: absolute;
        right: 11px;
        top: -2px;
      }

      .form-control {
        border-radius: 30px;
        font-size: 0.85rem;
        padding: 16px 30px;
        height: 35px;
        background-color: rgba(#d9ecff, 0.7);
        border-color: transparent;
      }
    }
    .show-input-wrap {
      width: 17rem;
    }

    .custom-select-sm {
      height: 32px;
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
      width: 135px;
      padding-left: 0.5rem;
      font-size: 0.83125rem;
      background-color: transparent;
    }
  }
  .table-wrap {
    overflow-x: hidden;
    padding: 30px 10px;
    height: auto;
    border-radius: 1rem;
    background-color: white;
    margin-bottom: 20px;
    white-space: nowrap;
    width: 100%;

    .table {
      font-size: 1rem;
      margin-left: -0.4rem;
      margin-right: -0.4rem;

      thead {
        tr {
          border-bottom: 1px solid #000;
          th {
            padding: 15px 30px;
            background-color: white;
            border: 0;
            font-weight: normal;
            font-weight: 600;

            &:first-child {
              text-align: right;
            }
          }
        }
      }

      tbody {
        tr {
          background-color: white;
          td {
            padding: 15px 30px;
            border: 0;

            &:first-child {
              text-align: right;
            }
          }
        }
      }
    }
    .table-actions {
      .btn {
        padding: 2px 4px;
      }
    }
  }

  .skeleton-table {
    margin-top: 24px;
    .card {
      border-radius: 15px;

      & .table thead th div {
        width: 75%;
      }
    }
  }

  .no-message {
    padding: 8rem 8rem 3rem 8rem;
    margin-top: 24px;
    border: none;
    border-radius: 0.5rem;
  }
}
</style>
