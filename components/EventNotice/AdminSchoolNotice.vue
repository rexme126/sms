<template>
  <div class="notice">
    <div class="shadow p-4 notice__wrapper mt-4">
      <h1 class="d-flex justify-content-center mb-4 mt-4">Notice Board</h1>

      <b-row no-gutters>
        <b-col md="12">
          <b-table striped responsive hover :items="notices" :fields="fields">
            <template #cell(date)="date">
              <b-badge class="d-inline-block" variant="danger">{{
                date.value
              }}</b-badge>
            </template>
            <template #cell(actions)="row" class="d-flex">
              <div class="d-flex">
                <b-button size="sm" variant="primary" class="mr-1">
                  Unpublished
                </b-button>
                <b-button size="sm" variant="info" class="mr-1">
                  <b-icon icon="pencil-square"></b-icon>
                </b-button>

                <b-button
                  size="sm"
                  variant="danger"
                  @click="row.toggleDetails"
                >
                  <b-icon icon="trash"></b-icon>
                </b-button>
              </div>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { NOTICE_QUERIES } from '@/graphql/notices/queries'
export default {
  data() {
    return {
      notices: [],
      fields: [
        {
          key: 'date',
          label: 'Date',
        },
        {
          key: 'description',
          label: 'Description',
        },
          {
          key: 'title',
          label: 'Title',
        },
        {
          key: 'published',
          label: 'Published',
        },
        {
          key: 'photo',
          label: 'Photo',
        },


        { key: 'actions', label: 'Actions' },
      ],
      form: {
        text: '',
        busy: false,
      },
    }
  },
  apollo: {
    notices: {
      query: NOTICE_QUERIES,
    },
  },
}
</script>

<style lang="scss" scoped>
.notice {
  padding: 20px;
  .form-control {
    background-color: var(--color-input);
  }

  .notice__wrapper {
    background-color: var(--color-white);
    border-radius: 5px;
    border: none;
  }
}
</style>