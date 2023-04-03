<template>
  <div class="default-layout" @click="closeTopNavDropdown">
    <template v-if="$fetchState.pending"><Preload /></template>
    <template v-else-if="$fetchState.error">Error Message</template>
    <template v-else>
      <SideBar />
      <main class="main">
        <TopNav />
        <Nuxt />
      </main>
    </template>
  </div>
</template>

<script>
import { mapActions } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import { useToggleMenu } from '@/stores/toggle'
import { GUARDIAN_DASHBOARD_QUERIES } from '~/graphql/guardians/queries'
import { STUDENT_DASHBOARD_QUERIEX } from '~/graphql/students/queries'
import { TEACHER_DASHBOARD_QUERIES } from '~/graphql/teachers/queries'
import { ROLEX_QUERIEX, USER_WORKSPACE_QUERY } from '~/graphql/users/queries'
import Preload from '~/components/Preload.vue'
import TopNav from '~/components/TopNav.vue'
import SideBar from '~/components/SideBar.vue'

export default {
  components: { TopNav, SideBar, Preload },
  async fetch() {
    const { app, route, redirect } = this.$nuxt.context

    const {
      apolloProvider: { defaultClient: apolloClient },
      pinia,
    } = app

    const {
      data: { user },
    } = await apolloClient.query({
      query: ROLEX_QUERIEX,
      variables: { id: parseInt(this.$auth.user.id) },
    })
    const {
      data: { userWorkspace },
    } = await apolloClient.query({
      query: USER_WORKSPACE_QUERY,
      variables: { id: parseInt(this.$auth.user.id) },
    })

    const {
      data: { guardiansDashboard },
    } = await apolloClient.query({
      query: GUARDIAN_DASHBOARD_QUERIES,
      variables: {
        workspaceId: parseInt(userWorkspace.workspace.id),
      },
    })
    const {
      data: { teachersDashboard },
    } = await apolloClient.query({
      query: TEACHER_DASHBOARD_QUERIES,
      variables: {
        workspaceId: parseInt(userWorkspace.workspace.id),
      },
    })

    const {
      data: { studentsDashboard },
    } = await apolloClient.query({
      query: STUDENT_DASHBOARD_QUERIEX,
      variables: {
        workspaceId: parseInt(userWorkspace.workspace.id),
      },
    })

    if (
      this.$auth.user.email === 'tojufutughe@gmail.com' &&
      userWorkspace.workspace.slug === 'defaultworkspace'
    ) {
      return redirect({
        name: 'workspace-school',
        params: { workspace: userWorkspace.workspace.slug },
      })
    } else if (
      userWorkspace.workspace.status === 1 &&
      this.$auth.user.email !== 'tojufutughe@gmail.com' &&
      userWorkspace.workspace.slug !== 'defaultWorkspace'
    ) {
      return redirect({
        name: 'workspace-dashboard',
        params: { workspace: userWorkspace.workspace.slug },
      })
    } else if (
      userWorkspace.workspace.status === 0 &&
      this.$auth.user.email !== 'tojufutughe@gmail.com' &&
      userWorkspace.workspace.slug !== 'defaultWorkspace'
    ) {
      return redirect({
        name: 'workspace-account-status',
        params: { workspace: userWorkspace.workspace.slug },
      })
    }
  },

  created() {
    window.addEventListener('resize', this.checkScreen)
    this.checkScreen()
  },
  // fetchDelay: 8000,

  watch: {
    userWorkspace(value) {
      this.setWorkspaces(value)
    },
  },

  apollo: {
    userWorkspace: {
      query: USER_WORKSPACE_QUERY,
      variables() {
        return { id: parseInt(this.$auth.user.id) }
      },
    },
  },

  methods: {
    ...mapActions(useWorkspaceStore, ['setWorkspace']),
    ...mapActions(useToggleMenu, ['toggleIcon']),
    ...mapActions(useToggleMenu, ['hideNav']),
    async setWorkspaces() {
      const {
        apolloProvider: { defaultClient: apolloClient },
      } = this.$nuxt.context.app

      const {
        data: { userWorkspace },
      } = await apolloClient.query({
        query: USER_WORKSPACE_QUERY,
        variables: { id: parseInt(this.$auth.user.id) },
      })
      this.setWorkspace(userWorkspace.workspace)
    },

    closeTopNavDropdown() {
      this.hideNav(false)
    },

    checkScreen() {
      const windowWidth = window.innerWidth
      if (windowWidth <= 900) {
        this.toggleIcon(false)
        return
      }
      this.toggleIcon(true)
      return
    },
  },
}
</script>

<style lang="scss">
.default-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;

  .main {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
