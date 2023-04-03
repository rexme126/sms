<template>
  <div class="home dashboard-wrapper p-3">
    <div v-if="!user"></div>
    <div v-else v-for="role in user.roles" :key="role.id">
      <span
        v-if="
          role.name == 'super admin' ||
          role.name == 'main admin' ||
          role.name == 'guardian' ||
          role.name == 'student' ||
          role.name == 'teacher' ||
          role.name == 'admin'
        "
      >
        <b-row>
          <b-col md="4" class="py-2">
            <b-card class="card1 shadow-sm p-3">
              <img
                src="@/assets/svg/users-svgrepo.svg"
                class="top-card"
                alt=""
              />

              <div class="xxx">
                <h5>{{ studentsDashboard.length }}</h5>
                <h4 class="mr-1">Students</h4>
              </div>
            </b-card>
          </b-col>

          <b-col md="4" class="py-2">
            <b-card class="card2 shadow-sm p-3">
              <img
                src="@/assets/svg/people-svgrepo.svg"
                class="top-card"
                alt=""
              />
              <div class="xxx">
                <h5>{{ teachersDashboard.length }}</h5>
                <h4>Teachers</h4>
              </div>
            </b-card>
          </b-col>

          <b-col md="4" class="py-2">
            <b-card class="card card3 shadow-sm p-3">
              <img
                src="@/assets/svg/users-svgrepo.svg"
                class="top-card"
                alt=""
              />
              <div class="xxx">
                <h5>{{ guardiansDashboard.length }}</h5>
                <h4>Guardians</h4>
              </div>
            </b-card>
          </b-col>
        </b-row>

        <b-row>
          <b-col lg="6" class="py-3 pie-chart">
            <b-card class="cardA">
              <apexchart
                width="380"
                type="pie"
                :options="options"
                :series="admin"
              ></apexchart>
            </b-card>
          </b-col>

          <b-col lg="6" class="py-3 donut-chart">
            <b-card class="cardA">
              <apexchart
                width="380"
                type="donut"
                :options="options"
                :series="admin"
              ></apexchart>
            </b-card>
          </b-col>
        </b-row>
      </span>
    </div>

    <div class="cardB shadow-sm">
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
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import { GUARDIAN_DASHBOARD_QUERIES } from '@/graphql/guardians/queries'
import { TEACHER_DASHBOARD_QUERIES } from '@/graphql/teachers/queries'
import { STUDENT_DASHBOARD_QUERIEX } from '@/graphql/students/queries'
import { ROLEX_QUERIEX } from '~/graphql/users/queries'
import EventNoticeSchoolNotice from '~/components/EventNotice/SchoolNotice.vue'
import EventNoticeSchoolEvent from '~/components/EventNotice/SchoolEvent.vue'

export default {
  components: { EventNoticeSchoolNotice, EventNoticeSchoolEvent },
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

  apollo: {
    studentsDashboard: {
      query: STUDENT_DASHBOARD_QUERIEX,
      variables() {
        return {
          workspaceId: parseInt(this.mainWorkspace.id),
        }
      },
    },
    teachersDashboard: {
      query: TEACHER_DASHBOARD_QUERIES,
      variables() {
        return {
          workspaceId: parseInt(this.mainWorkspace.id),
        }
      },
    },
    guardiansDashboard: {
      query: GUARDIAN_DASHBOARD_QUERIES,
      variables() {
        return {
          workspaceId: parseInt(this.mainWorkspace.id),
        }
      },
    },
    user: {
      query: ROLEX_QUERIEX,
      variables() {
        return { id: parseInt(this.$auth.user.id) }
      },
    },
  },
  computed: {
    admin() {
      return [
        this.studentsDashboard.length,
        this.teachersDashboard.length,
        this.guardiansDashboard.length,
      ]
    },
    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
  },
}
</script>

<style lang="scss">
.home {
  &.dashboard-wrapper {
    flex: 1 1 0;

    .top-card {
      width: 80px;

      @media only screen and (min-width: 750px) and (max-width: 1025px) {
        width: 40%;
      }
       @media only screen and (min-width: 350px) and (max-width: 770px) {
        width: 20%;
      }
    }

    @media (max-width: 768px) {
      padding-left: 1.7rem;
    }

    .donut-chart {
      @include media-breakpoint-down(md) {
        display: none;
      }
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
      }
    }

    border: none;
    margin-bottom: 10px;
    border-radius: 5px;
    position: relative;
    height: 11rem;

    .card-image {
      position: absolute;
      top: 0;
      right: 0;
      height: 100%;
    }
    h5,
    h4 {
      color: #fff;
      padding: 10px 13px;

      @media only screen and (min-width: 750px) and (max-width: 1062px) {
        font-size: 18px;
        padding: 8px 0;
      }
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
    margin-bottom: 40px;
    border-radius: 5px;
    height: 250px;
    background-color: #fff;
  }

  .cardB {
    border: none;
    margin-bottom: 2px;
    border-radius: 5px;
    position: sticky;
    background-color: #fff;

    .card-overflow {
      overflow: auto;
      height: 395px;
    }

    .nav-link.active {
      border-top: 5px solid limegreen;
    }
    .nav-link.active:hover {
      border-top: 5px solid limegreen;
    }
  }
}
</style>
