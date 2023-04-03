<<template>
  <div v-if="!schoolEvents"></div>
  <div v-else class="p-2 mt-4">
    <template v-if="schoolEvents.length > 0">
      <b-table
        striped
        :responsive="true"
        :items="schoolEvents"
        small
        :fields="fields"
      >
        <template #cell(date)="row">
          <div class="d-flex flex-column">
            <div>
              <b-badge
                style="font-size: 14px"
                class="d-inline-block"
                variant="danger"
                >{{ row.item.date }}</b-badge
              >
            </div>

            <span v-html="row.item.description"></span>
          </div>
        </template>
      </b-table>
    </template>
    <template v-else>
      <div class="text-center p-4">No record found</div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useWorkspaceStore } from '@/stores/wokspace'
import { SCHOOL_EVENT_QUERIES } from '@/graphql/events/queries'
export default {
  data() {
    return {
      fields: [
        {
          key: 'date',
          label: 'School Event',
        },
      ],
      form: {
        text: '',
        busy: false,
      },
    }
  },
  computed: {
    ...mapState(useWorkspaceStore, {
      mainWorkspace: (store) => store.currentWorkspace,
    }),
  },
  apollo: {
    schoolEvents: {
      query: SCHOOL_EVENT_QUERIES,
      variables() {
        return {
          workspaceId: parseInt(this.mainWorkspace.id),
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped></style>
