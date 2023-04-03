<template>
  <div class="profile p-3">
    <template v-if="$apollo.queries.teacher.loading"><Preload /></template>
    <template v-else>
      <b-button
        :to="{
          name: 'workspace-admin-teacher',
          params: { workspace: mainWorkspace.slug },
        }"
        variant="primary"
        size="md"
        class="add-student mb-2"
      >
        <b-icon icon="arrow-left" /> Back
      </b-button>

      <b-card class="user shadow-sm">
        <div v-if="teacher.photo == null" class="text-center mb-4 mt-2">
          <b-img
            src="@/assets/svg/user-avatar.svg"
            fluid
            alt="teacher"
            width="200"
          ></b-img>
        </div>

        <div v-else class="text-center mb-4 mt-4">
          <b-img
            style="border-radius: 50%"
            :src="`${$config.APIRoot}/storage/${mainWorkspace.id}/teachers/${teacher.photo}`"
            thumbnail
            fluid
            alt="teacher"
            width="200"
          ></b-img>
        </div>

        <div class="d-flex justify-content-between p-5">
          <div>
            <p>Full Name</p>
            <p>Qualifications</p>
            <p>Reg. Code</p>
            <p>Date of employment</p>
            <p>Email</p>
            <p>Phone no:</p>
            <p>Gender</p>
            <p>Blood Group</p>
            <p>Country</p>
            <p>State</p>
            <p>City</p>
            <p>L.G.A</p>
          </div>

          <div style="font-weight: bold">
            <p>
              {{ teacher.last_name }} {{ teacher.first_name }}
              {{ teacher.middle_name }}
            </p>
            <p>{{ teacher.qualification }}</p>
            <p>{{ teacher.code }}</p>
            <p>{{ teacher.employment }}</p>
            <p>{{ teacher.user.email }}</p>
            <p>{{ teacher.phone }}</p>

            <p>{{ teacher.gender }}</p>
            <p>
              {{
                teacher.user.blood_group != null
                  ? teacher.user.blood_group.name
                  : ''
              }}
            </p>
            <p>
              {{ teacher.user.country.name }}
            </p>
            <p>
              {{ teacher.user.state.name }}
            </p>
            <p>
              {{ teacher.user.city }}
            </p>
            <p>
              {{ teacher.user.lga }}
            </p>
          </div>
        </div>
      </b-card>
    </template>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import { TEACHER_QUERY } from '@/graphql/teachers/queries'
import Preload from '~/components/Preload.vue'

export default {
  components: { Preload },
  middleware: 'auth',
  apollo: {
    teacher: {
      query: TEACHER_QUERY,
      variables() {
        return {
          id: parseInt(this.$route.params.id),
          workspaceId: parseInt(this.mainWorkspace.id),
        }
      },
    },
  },
  computed: {
    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
  },
}
</script>

<style lang="scss" scoped>
.profile {
  .first-detail p {
    display: block;
    margin-left: 40%;
  }
  .first-details p {
    display: block;
    margin-left: 30%;
    font-weight: bold;
  }
  @include media-breakpoint-down(md) {
    .first-detail p {
      margin-left: 0;
    }
    .first-details p {
      margin-left: 0;
    }
  }
  @include media-breakpoint-down(sm) {
    .col-md-6 {
      flex: 0 0 50%;
      max-width: 50%;
    }
    .first-details p {
      margin-left: 50%;
    }
  }
}
</style>
