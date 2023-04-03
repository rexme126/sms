<template>
  <div>
    <div class="d-flex justify-content-between">
      <h5>Notifications</h5>

      <b-button class="mb-2" variant="warning" pill size="sm" @click="close"
        >Mark As Read</b-button
      >
    </div>
    <div v-for="data in user.notifications" :key="data.id" class="">
      <!-- notice -->
      <div
        v-if="data.type == 'App\\Notifications\\SchoolNotice'"
        style="padding: 2px"
      >
        <b-card
          v-if="data.read_at == null"
          style="background-color: lightgray"
          class="pointer"
          @click="markOneAsRead(data.id, 'notice')"
        >
          <b-badge variant="danger">{{ data.created_at | formatDate }}</b-badge>
          <p>There is a new school notice, click here to view</p>
        </b-card>
      </div>
      <!-- event -->

      <div
        v-if="data.type == 'App\\Notifications\\SchoolEvent'"
        style="padding: 2px"
      >
        <b-card
          class="pointer"
          v-if="data.read_at == null"
          style="background-color: lightgray"
          @click="markOneAsRead(data.id, 'event')"
        >
          <b-badge variant="primary">{{
            data.created_at | formatDate
          }}</b-badge>

          <p>There is a new school event, click here to view</p>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import { USER_NOTIFICATION_QUERIES } from '~/graphql/notifications/queries'
import {
  MARK_AS_READ,
  MARK_ONE_AS_READ,
} from '@/graphql/notifications/mutations'
export default {
  filters: {
    formatDate(value) {
      const date = moment.utc(value).local()
      return date.format('D MMM YYYY')
    },
  },
  props: {
    notifyNow: {
      type: Array,
      required: false,
    },
  },
  data: () => ({
    user: [],
  }),
  computed: {
    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
  },
  apollo: {
    user: {
      query: USER_NOTIFICATION_QUERIES,
      variables() {
        return { id: parseInt(this.notifyNow[0]) }
      },
    },
  },
  methods: {
    close() {
      this.$apollo
        .mutate({
          mutation: MARK_AS_READ,
          variables: { notifiable_id: parseInt(this.notifyNow[0]) },
        })
        .then(() => {
          this.$bvModal.hide(this.notifyNow[1])
        })
    },

    markOneAsRead(id, notificationSlugs) {
      this.$apollo
        .mutate({
          mutation: MARK_ONE_AS_READ,
          variables: { id: id },
        })
        .then(() => {
          this.$router.push({
            name: 'workspace-notification',
            params: {
              workspace: this.mainWorkspace.slug,
              notification: notificationSlugs,
            },
          }),
            this.$bvModal.hide(this.notifyNow[1])
        })
    },
  },
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
