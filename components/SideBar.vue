<template>
  <div class="sidebar-wrapper">
    <div
      class="aside shadow-sm"
      :class="`${isCollasped == true ? 'is-expanded' : 'not-expanded'}`"
    >
      <div class="logo">
        <div v-if="mainWorkspace.logo == null" />
        <img
          v-else
          :src="`${$config.APIRoot}/storage/${mainWorkspace.id}/logo/${mainWorkspace.logo}`"
          alt=""
          width="50"
        />
      </div>

      <div v-for="role in user.roles" :key="role.id">
        <!-- super user -->
        <span v-if="role.name == 'super admin'">
          <h3 class="h3-memu">Schools</h3>

          <div class="menu">
            <nuxt-link
              :to="{
                name: 'workspace-school',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon icon="grid" class="material-icons" @click="ToggleMenus" />
              <span class="text" @click="ToggleMenus">Schools</span>
            </nuxt-link>

            <nuxt-link
              :to="{
                name: 'workspace-school-create',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon
                icon="columns-gap"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Create School</span>
            </nuxt-link>
          </div>
        </span>

        <!-- Accountant -->
        <span v-if="role.name == 'accountant'">
          <h3 class="h3-memu">Accountant</h3>

          <div class="menu">
            <nuxt-link
              :to="{
                name: 'workspace-dashboard',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon icon="grid" class="material-icons" @click="ToggleMenus" />
              <span class="text" @click="ToggleMenus">Dashboard</span>
            </nuxt-link>

            <nuxt-link
              :to="{
                name: 'workspace-accountant-profile',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon
                icon="person-circle"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Profile</span>
            </nuxt-link>
            <nuxt-link v-b-toggle.collapse-1 to="#" class="button">
              <b-icon
                icon="person-fill"
                class="material-icons"
                @click="ToggleMenus()"
              />
              <span class="text" @click="ToggleMenus()"
                >Payment
                <b-icon
                  style="margin-left: 80px"
                  class="caret-down"
                  scale="0.8"
                  icon="caret-down"
              /></span>
            </nuxt-link>

            <b-collapse
              visible
              id="collapse-1"
              accordion="my-accordion"
              role="tabpanel"
              class="mt-2 dropMenuClose"
            >
              <b-card bg-variant="light" class="closeNavHeight">
                <nuxt-link
                  :to="{
                    name: 'workspace-accountant-create-payment',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <span class="text">Create</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-accountant-fee-payment',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <span class="text" @click="ToggleMenus">Fee Payments</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-accountant-payments',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <span class="text" @click="ToggleMenus">Payments</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-accountant-due-payments',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <span class="text" @click="ToggleMenus">Due Payment</span>
                </nuxt-link>
              </b-card>
            </b-collapse>
          </div>
        </span>

        <!-- Teacher -->
        <span v-if="role.name == 'teacher'">
          <h3 class="h3-memu">Teacher</h3>

          <div class="menu">
            <nuxt-link
              :to="{
                name: 'workspace-dashboard',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon icon="grid" class="material-icons" @click="ToggleMenus" />
              <span class="text" @click="ToggleMenus">Dashboard</span>
            </nuxt-link>

            <nuxt-link
              :to="{
                name: 'workspace-teacher-profile',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon
                icon="person-fill"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Profile</span>
            </nuxt-link>

            <nuxt-link
              :to="{
                name: 'workspace-teacher-subjects-allocation',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon
                icon="alarm"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Subjects Allocation</span>
            </nuxt-link>

            <nuxt-link
              :to="{
                name: 'workspace-teacher-timetable',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon
                icon="alarm"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Timetable</span>
            </nuxt-link>

            <nuxt-link
              :to="{
                name: 'workspace-teacher-exam-timetable',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon
                icon="vector-pen"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Exam Timetable</span>
            </nuxt-link>
            <nuxt-link
              :to="{
                name: 'workspace-teacher-marksheet',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon
                icon="vector-pen"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Marksheet</span>
            </nuxt-link>

            <nuxt-link
              :to="{
                name: 'workspace-teacher-result',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon
                icon="vector-pen"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Results</span>
            </nuxt-link>
          </div>
        </span>

        <!-- Student -->
        <span v-if="role.name == 'student'">
          <h3 class="h3-memu">Student</h3>

          <div class="menu">
            <nuxt-link
              :to="{
                name: 'workspace-dashboard',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon icon="grid" class="material-icons" @click="ToggleMenus" />
              <span class="text" @click="ToggleMenus">Dashboard</span>
            </nuxt-link>
            <nuxt-link
              :to="{
                name: 'workspace-student-profile',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon
                icon="person-circle"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Profile</span>
            </nuxt-link>

            <nuxt-link
              :to="{
                name: 'workspace-student-subjects-allocation',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon
                icon="alarm"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Subjects Allocation</span>
            </nuxt-link>

            <nuxt-link
              :to="{
                name: 'workspace-student-timetable',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon
                icon="alarm"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Timetable</span>
            </nuxt-link>

            <nuxt-link
              :to="{
                name: 'workspace-student-exam-timetable',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon
                icon="alarm"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Exam Timetable</span>
            </nuxt-link>

            <nuxt-link
              :to="{
                name: 'workspace-student-result',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon
                icon="file-text"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Result</span>
            </nuxt-link>

            <!-- collapse -->
            <nuxt-link
              v-b-toggle.accordion-4
              block
              event=""
              to="admin"
              class="button"
            >
              <b-icon
                icon="vector-pen"
                class="material-icons"
                @click="ToggleMenus()"
              />
              <span class="text" @click="ToggleMenus()"
                >Payment
                <b-icon
                  style="margin-left: 85px"
                  scale="0.8"
                  class="caret-down"
                  icon="caret-down"
              /></span>
            </nuxt-link>

            <b-collapse
            visible
              id="accordion-4"
              accordion="my-accordion"
              role="tabpanel"
              class="mt-2 dropMenuClose"
            >
              <b-card bg-variant="light">
                <nuxt-link
                  :to="{
                    name: 'workspace-student-payment',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="person-fill"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Fee Payment</span>
                </nuxt-link>

                <nuxt-link
                  t
                  :to="{
                    name: 'workspace-student-fee-receipt',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="person-fill"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Print Receipt</span>
                </nuxt-link>
              </b-card>
            </b-collapse>
          </div>
        </span>

        <!-- guardian -->
        <span v-if="role.name == 'guardian'">
          <h3 class="h3-memu">Guardian</h3>

          <div class="menu">
            <nuxt-link
              :to="{
                name: 'workspace-dashboard',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon icon="grid" class="material-icons" @click="ToggleMenus" />
              <span class="text" @click="ToggleMenus">Dashboard</span>
            </nuxt-link>

            <nuxt-link
              :to="{
                name: 'workspace-guardian-profile',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon
                icon="person-circle"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Profile</span>
            </nuxt-link>

            <nuxt-link
              :to="{
                name: 'workspace-guardian-timetable',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon
                icon="alarm"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Timetable</span>
            </nuxt-link>

            <nuxt-link
              :to="{
                name: 'workspace-guardian-exam-timetable',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon
                icon="vector-pen"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Exam Timetable</span>
            </nuxt-link>

            <nuxt-link
              :to="{
                name: 'workspace-guardian-result',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon
                icon="file-text"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Result</span>
            </nuxt-link>

            <nuxt-link
              :to="{
                name: 'workspace-guardian-payments',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon
                icon="file-text"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Payments</span>
            </nuxt-link>

            <nuxt-link
              :to="{
                name: 'workspace-guardian-fee-receipt',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon
                icon="file-text"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Print Receipt</span>
            </nuxt-link>
          </div>
        </span>

        <!-- admin -->

        <span v-if="role.name == 'admin'">
          <h3 class="h3-memu">School Admin</h3>

          <div class="menu">
            <nuxt-link
              :to="{
                name: 'workspace-dashboard',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon icon="grid" class="material-icons" @click="ToggleMenus" />
              <span class="text" @click="ToggleMenus">Dashboard</span>
            </nuxt-link>

            <!-- collapse -->
            <nuxt-link
              v-b-toggle.accordion-1
              block
              event=""
              to="admin"
              class="button"
            >
              <b-icon
                icon="people"
                class="material-icons"
                @click.prevent="ToggleMenus()"
              />
              <span class="text" @click="ToggleMenus()"
                >Users
                <b-icon
                  style="margin-left: 103px"
                  scale="0.8"
                  class="caret-down"
                  icon="caret-down"
              /></span>
            </nuxt-link>

            <b-collapse
              id="accordion-1"
              accordion="my-accordion"
              role="tabpanel"
              class="mt-2 dropMenuClose"
            >
              <b-card bg-variant="light" class="closeNavHeight">
                <nuxt-link
                  :to="{
                    name: 'workspace-admin-teacher',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="person-circle"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Teachers</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-student',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="people-fill"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Students</span>
                </nuxt-link>
                <nuxt-link
                  :to="{
                    name: 'workspace-admin-accountant',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="person-circle"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Accountants</span>
                </nuxt-link>
              </b-card>
            </b-collapse>

            <!-- toggle menu -->
            <nuxt-link
              v-b-toggle.accordion-2
              event=""
              to="admin/school"
              block
              class="button"
            >
              <b-icon
                icon="pen"
                class="material-icons"
                @click="ToggleMenus()"
              />
              <span class="text" @click="ToggleMenus()"
                >Exam
                <b-icon
                  style="margin-left: 103px"
                  scale="0.8"
                  class="caret-down"
                  icon="caret-down"
              /></span>
            </nuxt-link>

            <b-collapse
              id="accordion-2"
              accordion="my-accordion"
              role="tabpanel"
              class="mt-2 dropMenuClose"
            >
              <b-card bg-variant="light" class="closeNavHeight">
                <nuxt-link
                  :to="{
                    name: 'workspace-admin-exam-timetable',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="alarm"
                    scale="0.85"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Timetable</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-exam-grades',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="file-text"
                    scale="0.85"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Grades</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-exam-marksheet',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="file-earmark-ruled"
                    scale="0.85"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Marksheet</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-exam-attendance',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="file-text"
                    scale="0.85"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Attendance</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-exam-resumption',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="newspaper"
                    scale="0.85"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Resumption</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-exam-publishResult',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="newspaper"
                    scale="0.85"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Publish Result</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-exam-result',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="file-text"
                    scale="0.85"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Results</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-exam-promotion',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="arrow-right-circle"
                    scale="0.85"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Promotion</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-exam-reset',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="arrow-left-circle"
                    scale="0.85"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Reset Promotion</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-exam-graduate-class',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="arrow-right-circle"
                    scale="0.85"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Graduate class</span>
                </nuxt-link>
              </b-card>
            </b-collapse>
            <!-- end -->

            <!-- collapse -->
            <nuxt-link
              v-b-toggle.accordion-3
              block
              event=""
              to="admin/school"
              class="button"
            >
              <b-icon
                icon="vector-pen"
                class="material-icons"
                @click="ToggleMenus()"
              />
              <span class="text" @click="ToggleMenus()"
                >Setup
                <b-icon
                  style="margin-left: 103px"
                  scale="0.8"
                  class="caret-down"
                  icon="caret-down"
              /></span>
            </nuxt-link>

            <b-collapse
              id="accordion-3"
              accordion="my-accordion"
              role="tabpanel"
              class="mt-2 dropMenuClose"
            >
              <b-card bg-variant="light" class="closeNavHeight">
                <nuxt-link
                  :to="{
                    name: 'workspace-admin-timetable',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="alarm"
                    class="material-icons"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Timetable</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-session',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="layers"
                    class="material-icons"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Sessions</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-section',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="layers"
                    class="material-icons"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Section</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-classes',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="layers"
                    class="material-icons"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Classes</span>
                </nuxt-link>
                <nuxt-link
                  :to="{
                    name: 'workspace-admin-subjects',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="text-indent-left"
                    class="material-icons"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Subjects</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-assign-subject-to-teachers',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="text-indent-left"
                    class="material-icons"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Assign Subjects</span>
                </nuxt-link>
              </b-card>
            </b-collapse>

            <nuxt-link
              class="button"
              :to="{
                name: 'workspace-admin-event',
                params: { workspace: mainWorkspace.slug },
              }"
            >
              <b-icon
                icon="calendar2-date"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Event</span>
            </nuxt-link>

            <nuxt-link
              class="button"
              :to="{
                name: 'workspace-admin-notice',
                params: { workspace: mainWorkspace.slug },
              }"
            >
              <b-icon
                icon="calendar2-date"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Notices</span>
            </nuxt-link>
          </div>
        </span>

        <!-- main admin -->

        <span v-if="role.name == 'main admin'">
          <h3 class="h3-memu">Admin</h3>

          <div class="menu">
            <nuxt-link
              :to="{
                name: 'workspace-dashboard',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon icon="grid" class="material-icons" @click="ToggleMenus" />
              <span class="text" @click="ToggleMenus">Dashboard</span>
            </nuxt-link>

            <!-- collapse -->
            <nuxt-link
              v-b-toggle.accordion-1
              block
              event=""
              to="admin"
              class="button"
            >
              <b-icon
                icon="people"
                class="material-icons"
                @click="ToggleMenus()"
              />
              <span class="text"
                >Users
                <b-icon
                  style="margin-left: 103px"
                  scale="0.8"
                  class="caret-down"
                  icon="caret-down"
              /></span>
            </nuxt-link>

            <b-collapse
              id="accordion-1"
              accordion="my-accordion"
              role="tabpanel"
              class="mt-2 dropMenuClose"
            >
              <b-card bg-variant="light" class="closeNavHeight">
                <nuxt-link
                  :to="{
                    name: 'workspace-admin-teacher',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="person-circle"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Teachers</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-student',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="person-circle"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Students</span>
                </nuxt-link>
                <nuxt-link
                  :to="{
                    name: 'workspace-admin-accountant',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="person-circle"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Accountants</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-school-admin',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="person-fill"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Admin</span>
                </nuxt-link>
              </b-card>
            </b-collapse>

            <!-- toggle menu -->
            <nuxt-link
              v-b-toggle.accordion-2
              event=""
              to="admin/school"
              block
              class="button"
            >
              <b-icon
                icon="pen"
                class="material-icons"
                @click="ToggleMenus()"
              />
              <span class="text"
                >Exam
                <b-icon
                  style="margin-left: 103px"
                  scale="0.8"
                  class="caret-down"
                  icon="caret-down"
              /></span>
            </nuxt-link>

            <b-collapse
              id="accordion-2"
              accordion="my-accordion"
              role="tabpanel"
              class="mt-2 dropMenuClose"
            >
              <b-card bg-variant="light" class="closeNavHeight">
                <nuxt-link
                  :to="{
                    name: 'workspace-admin-exam-timetable',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="alarm"
                    scale="0.85"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Timetable</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-exam-grades',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="file-text"
                    scale="0.85"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Grades</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-exam-marksheet',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="file-earmark-ruled"
                    scale="0.85"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Marksheet</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-exam-attendance',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="file-text"
                    scale="0.85"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Attendance</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-exam-resumption',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="newspaper"
                    scale="0.85"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Resumption</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-exam-publish-result',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="newspaper"
                    scale="0.85"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Publish Result</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-exam-result',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="file-text"
                    scale="0.85"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Results</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-exam-promotion',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="arrow-right-circle"
                    scale="0.85"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Promotion</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-exam-reset',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="arrow-left-circle"
                    scale="0.85"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Reset Promotion</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-exam-graduate-class',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="arrow-right-circle"
                    scale="0.85"
                    class="material-icon"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Graduate Class</span>
                </nuxt-link>
              </b-card>
            </b-collapse>
            <!-- end -->

            <!-- collapse -->
            <nuxt-link
              v-b-toggle.accordion-3
              block
              event=""
              to="admin/school"
              class="button"
            >
              <b-icon
                icon="x-diamond"
                class="material-icons"
                @click="ToggleMenus()"
              />
              <span class="text"
                >Setup
                <b-icon
                  style="margin-left: 103px"
                  scale="0.8"
                  class="caret-down"
                  icon="caret-down"
              /></span>
            </nuxt-link>

            <b-collapse
              id="accordion-3"
              accordion="my-accordion"
              role="tabpanel"
              class="mt-2 dropMenuClose"
            >
              <b-card bg-variant="light" class="closeNavHeight">
                <nuxt-link
                  :to="{
                    name: 'workspace-admin-timetable',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="alarm"
                    class="material-icons"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Timetable</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-session',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="vr"
                    class="material-icons"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Sessions</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-section',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="pie-chart"
                    class="material-icons"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Section</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-classes',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="layers"
                    class="material-icons"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Classes</span>
                </nuxt-link>
                <nuxt-link
                  :to="{
                    name: 'workspace-admin-subjects',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="text-indent-left"
                    class="material-icons"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Subjects</span>
                </nuxt-link>

                <nuxt-link
                  :to="{
                    name: 'workspace-admin-assign-subject-to-teachers',
                    params: { workspace: mainWorkspace.slug },
                  }"
                  class="button"
                >
                  <b-icon
                    icon="text-indent-left"
                    class="material-icons"
                    @click="ToggleMenus"
                  />
                  <span class="text" @click="ToggleMenus">Assign Subjects</span>
                </nuxt-link>
              </b-card>
            </b-collapse>

            <nuxt-link
              class="button"
              :to="{
                name: 'workspace-admin-event',
                params: { workspace: mainWorkspace.slug },
              }"
            >
              <b-icon
                icon="calendar2-date"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Event</span>
            </nuxt-link>

            <nuxt-link
              class="button"
              :to="{
                name: 'workspace-admin-notice',
                params: { workspace: mainWorkspace.slug },
              }"
            >
              <b-icon
                icon="calendar2-date"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Notices</span>
            </nuxt-link>

            <nuxt-link
              class="button"
              :to="{
                name: 'workspace-admin-profile',
                params: { workspace: mainWorkspace.slug },
              }"
            >
              <b-icon
                icon="person-circle"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Profile</span>
            </nuxt-link>

            <nuxt-link
              :to="{
                name: 'workspace-admin-payments',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
              ><b-icon
                icon="list-stars"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">View Payment</span>
            </nuxt-link>

            <nuxt-link
              :to="{
                name: 'workspace-admin-payments-due-payments',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
              ><b-icon
                icon="view-list"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Due Payment</span>
            </nuxt-link>

            <nuxt-link
              :to="{
                name: 'workspace-admin-settings',
                params: { workspace: mainWorkspace.slug },
              }"
              class="button"
            >
              <b-icon
                icon="gear-fill"
                class="material-icons"
                @click="ToggleMenus"
              />
              <span class="text" @click="ToggleMenus">Settings</span>
            </nuxt-link>
          </div>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import { useToggleMenu } from '@/stores/toggle'
import { ROLEX_QUERIEX } from '~/graphql/users/queries'
export default {
  data() {
    return {
      rotate: '',
      user: [],
    }
  },
  computed: {
    ...mapState(useWorkspaceStore, ['currentWorkspace']),
    ...mapState(useToggleMenu, ['isCollasped']),
    mainWorkspace() {
      return this.currentWorkspace
    },
  },

  apollo: {
    user: {
      query: ROLEX_QUERIEX,
      variables() {
        return { id: parseInt(this.$auth.user.id) }
      },
    },
  },

  methods: {
    ...mapActions(useToggleMenu, ['toggleIcon']),

    ToggleMenus() {
      this.toggleIcon(true)
      this.windowWidth = window.innerWidth
      if (this.windowWidth <= 750) {
        this.toggleIcon(false)
        return
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.sidebar-wrapper {
  top: 0;
  background-color: #fff;
  z-index: 3;
  font-size: 18px;

  .aside {
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    background-color: var(--color-white);
    padding: 10px;

    @include media-breakpoint-down(sm) {
      margin-top: 85px;
      width: 0;
      padding: 0;
    }

    width: calc(1rem + 32px);
    height: 100vh;
    transition: 0.3s ease-out;

    .logo {
      margin-bottom: 22px;

      img {
        width: 100px;
      }
    }

    .dropMenuClose {
      .button {
        width: 108%;
        &.nuxt-link-exact-active {
          border-radius: 0 !important;
          border-left: -5px solid red !important;
          width: 108%;
        }
        &:hover {
          border-left: -5px solid red !important;
          border-radius: 0 !important;
          width: 108%;
        }
      }
    }

    h3 {
      opacity: 0;
      transition: opacity 0.1s ease-out;
      color: var(--color-primary);
      font-size: 23px;
      margin-bottom: 2px;
      text-transform: uppercase;
    }

    .menu {
      margin: 0 -10px;

      .button {
        display: flex;
        align-items: center;
        text-decoration: none;
        transition: 0.1s ease-out;
        padding: 4px 10px;
        margin-bottom: 8px;

        .material-icons {
          color: var(--color-body);
          transition: 0.1s ease-out;
          margin-top: 0;
        }
        .material-icon {
          padding-right: 20px;
          color: var(--color-body);
          transition: 0.1s ease-out;
          margin-top: -0.1px;
        }
        &.nuxt-link-exact-active {
          border-radius: 0 20px 20px 0;
          border-left: 5px solid limegreen;

          .material-icons,
          .material-icon {
            transition: 0.2s ease-out;
          }

          .text {
            color: var(--color-body);
          }
        }
        .text {
          color: var(--color-body);
          transition: 0.2s ease-out;
          display: none;
        }
      }
    }

    &.is-expanded {
      width: 256px;
      padding: 10px;

      .menu-toggle-wrap {
        top: -30px;
        .menu-toggle {
          transform: rotate(-180deg);
          margin-top: -10px;
          margin-bottom: 20px;
        }
      }

      .caret-down.upDown {
        transform: rotate(90deg);
        transition: 0.2s ease-out;
      }

      .h3-memu {
        margin-left: 20px;
        margin-bottom: 10px;
        font-weight: 600;
      }

      h3 {
        opacity: 1;
      }
      .text {
        white-space: nowrap;
      }
      .button .text {
        display: block;
        margin-left: 15px;
      }

      .menu {
        .button {
          .material-icons {
            margin-right: 10px;
          }
          .material-icon {
            margin-right: 0;
          }

          &:hover {
            background-color: var(--color-primary);
            border-radius: 0 20px 20px 0;
            .material-icon,
            .material-icons,
            .text {
              color: var(--color-white);
            }
          }
        }

        .nuxt-link-exact-active {
          background-color: var(--color-primary);
          border-radius: 0 20px 20px 0;
          border-left: 5px solid limegreen;

          .material-icons,
          .material-icon,
          .text {
            color: var(--color-white);
          }
        }
      }
    }

    &.not-expanded {
      .closeNavHeight {
        display: none;
      }
      // .menu {
      //   .button:hover {
      //     background-color: var(--color-primary);
      //     .text{
      //      width:250px;
      //     }

      //   }
      // }
    }

    @include media-breakpoint-down(sm) {
      position: absolute;
      z-index: 999;
    }
  }
}
</style>
