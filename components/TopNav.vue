<template>
  <div class="top">
    <nav>
      <img
        class="toggle-menu"
        src="@/assets/svg/menu-bars-.svg"
        alt="menu-bar"
        width="40"
        @click="toggleThisMenu"
      />

      <ul class="d-flex align-items-center">
        <li>
          <span class="mainNotification">
            <b-icon
              class="h2 bell"
              scale="1.2"
              variant="light"
              icon="bell-fill"
            />

            <div v-if="user.notifications.length === 0"></div>

            <div v-else class="userNotification" @click="notificationModal">
              {{ user.notifications.length }}
            </div>
          </span>
        </li>
        <li>
          <span
            v-if="$auth.loggedIn"
            class="profile-image"
            @click="profileImage"
          >
            <div class="nav-image">
              <img src="@/assets/images/background.jpg" alt="" />
              <h6>
                {{ $auth.user.first_name
                }}<b-icon icon="caret-down-fill" style="color: #fff"></b-icon>
              </h6>
            </div>
            <transition class="leave-cancelled">
              <div
                v-show="profileBody"
                class="profile"
                :class="isHideNav == true ? topNavClass : (profileBody = false)"
              >
                <div class="align-content">
                  <img src="@/assets/images/background.jpg" alt="" />
                  <p>{{ $auth.user.last_name }} {{ $auth.user.first_name }}</p>
                </div>
                <hr />
                <ul>
                  <li @click="logout">
                    <span class="nav-profile"><b-icon icon="power" /></span
                    >Logout
                  </li>
                </ul>
              </div>
            </transition>
          </span>
        </li>
      </ul>

      <!-- notification -->
      <b-modal
        :id="notice"
        class="modal"
        body-bg-variant="light"
        :hide-backdrop="false"
        scrollable
        size="lg"
        :hide-footer="true"
      >
        <Notification :notify-now="[$auth.user.id, notice]" />
      </b-modal>
    </nav>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import { useToggleMenu } from '@/stores/toggle'
import { USER_NOTIFICATION_QUERIES } from '~/graphql/notifications/queries'
import Notification from './Notification.vue'
export default {
  components: { Notification },
  data() {
    return {
      profileBody: false,
      topNavClass: '',
      notice: 'info',
      user: {
        notifications: [],
      },
    }
  },
  computed: {
    ...mapState(useWorkspaceStore, ['currentWorkspace']),
    ...mapState(useToggleMenu, ['isHideNav']),
    mainWorkspace() {
      return this.currentWorkspace
    },
  },
  apollo: {
    user: {
      query: USER_NOTIFICATION_QUERIES,
      variables() {
        return { id: parseInt(this.$auth.user.id) }
      },
      // fetchPolicy: 'no-cache',
      // pollInterval: 15000,
    },
  },

  methods: {
    ...mapActions(useToggleMenu, ['toggleMenu']),
    ...mapActions(useToggleMenu, ['hideNavs']),
    toggleThisMenu() {
      this.toggleMenu()
    },
    profileImage(e) {
      this.hideNavs()
      if (this.topNavClass === '') {
        this.profileBody = true
        this.topNavClass = 'off'
        e.stopPropagation()
      } else {
        this.topNavClass = ''
      }
    },

    async logout() {
      this.$nuxt.$loading.start()
      await this.$auth.logout()
    },
    notificationModal() {
      this.$bvModal.show(this.notice)
    },
  },
}
</script>

<style lang="scss" scoped>
.top {
  right: 0;
  bottom: 0;
  top: 0;
  width: 100%;
  position: sticky;
  z-index: 6;
  background: linear-gradient(to right, #5142f5, #047edf 99%);
  height: 85px;

  nav {
    display: flex;
    height: 100%;
    justify-content: space-between;
    align-items: center !important;
    flex: 1;
    z-index: 5;

    .toggle-menu {
      margin-left: 7px;
      margin-top: 0.5px;
      cursor: pointer;
    }

    .bell {
      margin-top: 17px;
      height: 100%;
      align-self: center;
      margin-right: 17px;
      cursor: pointer;
    }

    .mainNotification {
      position: relative;
      .userNotification {
        background-color: #ff0e0e;
        text-align: center;
        color: #fff;
        min-width: 43%;
        min-height: 100%;
        font-size: 14px;
        position: absolute;
        border-radius: 50%;
        right: 12px;
        top: -19px;
        cursor: pointer;
      }
    }

    .profile-image {
      z-index: 99;

      .nav-image {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        margin-right: 40px;
        h6 {
          color: #fff;
          margin-left: 0.5px;
          cursor: pointer;
        }
      }
      img {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .profile {
        z-index: 999;
        position: absolute;
        background-color: #fff;
        top: 90px;
        right: 30px;
        border-radius: 5px;
        box-shadow: 0 3px 21px 0 rgba(0, 0, 0, 0.219);

        .align-content {
          display: flex;
          flex-direction: column;
          align-items: center;

          img {
            margin: 15px 0 20px 0;
          }
        }
        a {
          color: var(--color-body);
        }
        & li {
          padding: 25px 90px;
          border-bottom: 1px solid #d8e0c0;
          cursor: pointer;

          .nav-profile {
            position: absolute;
            right: 155px;
          }
        }
      }
    }
  }
}
</style>
