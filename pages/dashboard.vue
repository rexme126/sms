<template>
  <div class="home main">
    <!-- <template v-if="nowLoading"><Preload/></template> -->
    <template>
      <b-row no-gutters>
        <b-col md="4" class="p-3">
          <div class="card card1 shadow p-3">
            <div class="card-body">
              <img
                src="@/assets/svg/users-svgrepo.svg"
                width="100"
                class="red"
                alt=""
              />

              <div class="xxx">
                <h3>{{ studentsDashboard.length }}</h3>
                <h2>Total Students</h2>
              </div>
            </div>
          </div>
        </b-col>

        <b-col md="4" class="p-3">
          <div class="card card2 shadow">
            <div class="card-body">
              <img
                src="@/assets/svg/people-svgrepo.svg"
                width="100"
                class="red"
                alt=""
              />
              <div class="xxx">
                <h3>{{ teachersDashboard.length }}</h3>
                <h2>Total Teachers</h2>
              </div>
            </div>
          </div>
        </b-col>

        <b-col md="4" class="p-3">
          <div class="card card3 shadow p-3">
            <div class="card-body">
              <img
                src="@/assets/svg/users-svgrepo.svg"
                width="100"
                class="red"
                alt=""
              />
              <div class="xxx">
                <h3>{{ guardiansDashboard.length }}</h3>
                <h2>Total Parents</h2>
              </div>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row no-gutters>
        <b-col md="6" class="p-3">
          <div class="cardA card1 shadow p-3">
            <div class="card-body">
              <apexchart
                width="410"
                type="pie"
                :options="options"
                :series="admin"
              ></apexchart>
            </div>
          </div>
        </b-col>

        <b-col md="6" class="p-3">
          <div class="cardA card1 shadow p-3">
            <div class="card-body">
              <apexchart
                width="410"
                type="donut"
                :options="options"
                :series="admin"
              ></apexchart>
            </div>
          </div>
        </b-col>
      </b-row>

      <b-row no-gutters>
        <b-col md="12" class="px-3">
          <div class="cardB shadow p-3">
            <div class="p-4">
              <b-tabs card>
                <b-tab active class="card-overflow">
                  <template #title>
                    <div class="d-flex align-items-center">
                      <b-spinner type="grow" variant="danger" small></b-spinner
                      ><strong> Notice Board</strong>
                    </div>
                  </template>
                  <EventNoticeSchoolNotice />
                </b-tab>

                <b-tab lazy class="card-overflow">
                  <template #title> School Event </template>
                  <EventNoticeSchoolEvent />
                </b-tab>
              </b-tabs>
            </div>
          </div> </b-col
      ></b-row>
    </template>
  </div>
</template>

<script>
import { GUARDIAN_DASHBOARD_QUERIES } from '@/graphql/guardians/queries'
import { TEACHER_DASHBOARD_QUERIES } from '@/graphql/teachers/queries'
import { STUDENT_DASHBOARD_QUERIEX } from '@/graphql/students/queries'

export default {
  middleware: 'auth',
  data() {
    return {
      studentsDashboard: [],
      teachersDashboard: [],
      guardiansDashboard: [],

      options: {
        chart: {
          id: 'vue-bar',
        },
        xxaxis: {
          categories: [2015, 2016, 2017, 2018, 2022],
        },
        labels: ['Students', 'Teachers', 'Parents'],
      },
      seriess: [{ name: 'series-7', data: [44, 55, 41, 17, 15] }],

      // colors: ['#206bc4', '#79a6dc', '#d2e1f3', '#e9ecf1'],
    }
  },
  computed: {
    // nowLoading() {
    //   return (
    //     this.$apollo.queries.studentsDashboard.loading &&
    //     this.$apollo.queries.teachersDashboard.loading &&
    //     this.$apollo.queries.guardiansDashboard.loading
    //   )
    // },
    admin() {
      return [
        this.studentsDashboard.length,
        this.teachersDashboard.length,
        this.guardiansDashboard.length,
      ]
    },
  },

  apollo: {
    studentsDashboard: {
      query: STUDENT_DASHBOARD_QUERIEX,
    },
    teachersDashboard: {
      query: TEACHER_DASHBOARD_QUERIES,
    },
    guardiansDashboard: {
      query: GUARDIAN_DASHBOARD_QUERIES,
    },
  },
}
</script>

<style lang="scss">
.home {
  // margin-top: 5rem;
  font-size: 1.6rem;
  &.main {
    flex: 1 1 0;
    padding: 2rem;

    @media (max-width: 768px) {
      padding-left: 2rem;
    }
  }

  .card {
    &.card1 {
      background: linear-gradient(to right, #90caf9, #047edf 99%);
    }
    &.card2 {
      background: linear-gradient(to right, #d543e2, #fe7096 99%);
    }
    &.card3 {
      background: linear-gradient(to right, #ffbf96, #fe7096);
    }

    &.card4 {
      background: linear-gradient(to right, #84d9d2, #07cdae);
    }
    h2 {
      color: #fff;
    }

    .card-body {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .xxx {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }

    border: none;
    margin-bottom: 4rem;
    border-radius: 0.5rem;
    position: relative;
    height: 18rem;

    .card-image {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
    }
    h4,
    h3 {
      color: #fff;
      padding: 2.2rem 1.3rem;
    }

    .beep {
      animation: BeepInOut 0.4s infinite 9s;
      display: inline-block;
      margin-top: 0.7rem;
      margin-left: 1rem;
      background-color: red;
      width: 1.1rem;
      height: 1.1rem;
      border-radius: 50%;
    }
    @keyframes BeepInOut {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  }
  .cardA {
    border: none;
    margin-bottom: 4rem;
    border-radius: 0.5rem;
    height: 30rem;
    background-color: #fff;
  }
  .cardB {
    border: none;
    margin-bottom: 2rem;
    border-radius: 0.5rem;
    position: sticky;
    background-color: #fff;

    .card-overflow {
      overflow: auto;
      height: 45rem;
    }

    .nav-link.active {
      border-top: 5px solid limegreen;
    }
    .nav-link.active:hover {
      border-top: 5px solid limegreen;
    }
  }

  .input-group > .input-group-append > .btn,
  .input-group > .input-group-append > .input-group-text,
  .input-group > .input-group-prepend:not(:first-child) > .btn,
  .input-group > .input-group-prepend:not(:first-child) > .input-group-text,
  .input-group > .input-group-prepend:first-child > .btn:not(:first-child),
  .input-group
    > .input-group-prepend:first-child
    > .input-group-text:not(:first-child) {
    background: var(--color-primary);
    color: #fff;
    font-size: 1rem;
    text-align: justify;
  }
}
</style>
