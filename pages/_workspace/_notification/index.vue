<template>
  <div class="home dashboard-wrapper p-3">
    <div class="cardB shadow-sm">
      <b-tabs card>
        <b-tab :active="notice" class="card-overflow">
          <template #title>
            <div class="d-flex align-items-center">
              <b-spinner type="grow" variant="danger" small></b-spinner
              ><strong> Notice Board</strong>
            </div>
          </template>
          <EventNoticeSchoolNotice />
        </b-tab>

        <b-tab :active="event" class="card-overflow">
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
import EventNoticeSchoolNotice from '~/components/EventNotice/SchoolNotice.vue'
import EventNoticeSchoolEvent from '~/components/EventNotice/SchoolEvent.vue'

export default {
  components: { EventNoticeSchoolNotice, EventNoticeSchoolEvent },
  middleware: 'auth',
  data() {
    return {
      notice: null,
      event: null,
    }
  },

  mounted() {
    if (this.$route.params.notification == 'event') {
      this.event = 'active'
    } else {
      this.notice = 'active'
    }
  },

  computed: {
    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
  },
}
</script>

<style lang="scss">
.home {
  .cardB {
    border: none;
    border-radius: 5px;
    position: sticky;
    background-color: #fff;

    .card-overflow {
      overflow: auto;
      height: 80vh;
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
