<template>
  <div class="profile">
    <template v-if="$apollo.queries.libarian.loading"><Preload /></template>
    <template v-else>
      <b-button
        to="/admin/libarian"
        variant="primary"
        size="lg"
        class="add-student mb-4"
      >
        <b-icon icon="arrow-left" /> Back
      </b-button>
      <b-jumbotron header="" class="libarian shadow">
        <h1>About {{ libarian.last_name }}</h1>
        <div class="d-flex justify-content-center mb-4">
          <span v-if="libarian.gender == 'Female' && libarian.photo == null">
            <b-img
              src="~/assets/images/teacher.jpeg"
              thumbnail
              fluid
              alt="Responsive image"
              width="230"
            ></b-img>
          </span>
          <span v-else>
            <b-img
              :src="`http://sms.test/storage/libarian/${libarian.photo}`"
              thumbnail
              fluid
              alt="image"
              width="230"
            ></b-img>
          </span>
        </div>
        <b-row no-gutters class="sm-query">
          <b-col md="6" class="first-detail p-4">
            <p>Full Name</p>
            <p>Phone no:</p>
            <p>Qualifications</p>
            <p>Code</p>
            <p>Gender</p>
            <p>Blood Group</p>
            <p>Country</p>
            <p>State</p>
            <p>City</p>
            <p>L.G.A</p>

            <!-- <p>
              <b-badge style="font-size: 1.6rem" variant="warning"
                >Subjects Assigned</b-badge
              >
            </p> -->
          </b-col>
          <b-col md="6" class="first-details p-4">
            <p>
              {{ libarian.last_name }} {{ libarian.first_name }}
              {{ libarian.middle_name }}
            </p>
            <p>{{ libarian.phone }}</p>
            <p>{{ libarian.qualification }}</p>
            <p>{{ libarian.code }}</p>

            <p>{{ libarian.gender }}</p>
            <p>
              {{ libarian.user.blood_group.name }}
            </p>
            <p>
              {{ libarian.user.country.name }}
            </p>
            <p>
              {{ libarian.user.state.name }}
            </p>
            <p>
              {{ libarian.user.city.name }}
            </p>
            <p>
              {{ libarian.user.lga }}
            </p>
            <!-- <h3 v-for="klase in libarian.klases" :key="klase">
              <p>
                <b-badge
                  style="line-height: 1.6"
                  variant="warning"
                  class="px-2"
                  :id="klase.id"
                  >{{ klase.name }}</b-badge
                >
              </p>
              <b-popover :target="klase.id" triggers="hover click">
                <b-nav vertical>
                  <b-nav-item
                    v-for="subject in klase.subjects"
                    :key="subject.id"
                  >
                    <div style="font-size: 1.4rem">{{ subject.subject }}</div>
                  </b-nav-item>
                </b-nav>
              </b-popover>
            </h3> -->
          </b-col>
        </b-row>
      </b-jumbotron></template
    >
  </div>
</template>

<script>
import { LIBARIAN_QUERY } from '~/graphql/libarians/queries'
export default {
  apollo: {
    libarian: {
      query: LIBARIAN_QUERY,
      variables() {
        return {
          slug: this.$route.params.slug,
        }
      },
    },
  },
  data() {
    return {
      libarian: [],
    }
  },
}
</script>

<style lang="scss" scoped>
.profile {
  font-size: 1.6rem;
  padding: 1rem;

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
