<template>
  <div class="p-3">
    <template v-if="nowLoading"><Preload /></template>
    <template v-else>
      <b-card class="p-4" v-if="school">
        <div class="text-center mb-4">
          <b-img
            v-if="school"
            :src="`${$config.APIRoot}/storage/${schoolId}/schools/${school.photo}`"
            fluid
            alt="school"
            width="150"
          ></b-img>
        </div>

        <h5 class="text-center">
          <span v-if="school" style="color: green">{{ school.name }}</span>
        </h5>

        <h5 v-if="school">
          Full Name:
          <span v-if="school" style="color: green"
            >{{ school.user.last_name }} {{ school.user.first_name }}</span
          >
        </h5>

        <h5 v-if="school">
          All students: <span style="color: red">{{ students }}</span>
        </h5>

        <h5 v-if="school">
          All Guardians: <span style="color: red">{{ guardians }}</span>
        </h5>

        <h5 v-if="school">
          All Teachers: <span style="color: red">{{ teachers }}</span>
        </h5>

        <h5 v-if="school">
          All accountants:
          <span style="color: red">{{ accountantLength }}</span>
        </h5>
        <h5 v-if="school">
          School Admin:
          <span style="color: red">{{ schoolAdmin }}</span>
        </h5>

        <h5 v-if="school">
          Total Users:
          <span style="color: red">{{ totalUsers }}</span>
        </h5>
      </b-card>
    </template>
  </div>
</template>

<script>
import { GUARDIAN_DASHBOARD_QUERIES } from '@/graphql/guardians/queries'
import { TEACHER_DASHBOARD_QUERIES } from '@/graphql/teachers/queries'
import { STUDENT_DASHBOARD_QUERIEX } from '@/graphql/students/queries'
import Preload from '~/components/Preload.vue'
import { SCHOOL_QUERY } from '~/graphql/workspace/queries'
import { ACCOUNTANT_QUERIES } from '~/graphql/accountants/queries'
import { SCHOOL_ADMIN_QUERIES } from '~/graphql/admin/queries'

export default {
  components: { Preload },
  middleware: 'auth',

  data() {
    return {
      studentsDashboard: [],
      teachersDashboard: [],
      guardiansDashboard: [],
      accountants: [],
      schoolAdmins: [],
    }
  },
  computed: {
    nowLoading() {
      return (
        this.$apollo.queries.studentsDashboard.loading &&
        this.$apollo.queries.teachersDashboard.loading &&
        this.$apollo.queries.guardiansDashboard.loading &&
        this.$apollo.queries.school.loading
      )
    },
    schoolId() {
      return this.$route.params.id
    },
    students() {
      return this.studentsDashboard.length
    },
    guardians() {
      return this.guardiansDashboard.length
    },
    teachers() {
      return this.teachersDashboard.length
    },
    accountantLength() {
      return this.accountants.length
    },
    schoolAdmin() {
      return this.schoolAdmins.length
    },
    totalUsers() {
      return (
        this.studentsDashboard.length +
        this.guardiansDashboard.length +
        this.teachersDashboard.length +
        this.accountants.length +
        this.schoolAdmins.length +
        1
      )
    },
  },

  apollo: {
    school: {
      query: SCHOOL_QUERY,
      variables() {
        return {
          id: parseInt(this.$route.params.id),
        }
      },
    },
    studentsDashboard: {
      query: STUDENT_DASHBOARD_QUERIEX,
      variables() {
        return {
          workspaceId: parseInt(this.schoolId),
        }
      },
    },
    teachersDashboard: {
      query: TEACHER_DASHBOARD_QUERIES,
      variables() {
        return {
          workspaceId: parseInt(this.schoolId),
        }
      },
    },
    guardiansDashboard: {
      query: GUARDIAN_DASHBOARD_QUERIES,
      variables() {
        return {
          workspaceId: parseInt(this.schoolId),
        }
      },
    },
    accountants: {
      query: ACCOUNTANT_QUERIES,
      variables() {
        return {
          workspaceId: parseInt(this.schoolId),
        }
      },
    },
    schoolAdmins: {
      query: SCHOOL_ADMIN_QUERIES,
      variables() {
        return {
          workspaceId: parseInt(this.schoolId),
        }
      },
    },
  },
}
</script>
