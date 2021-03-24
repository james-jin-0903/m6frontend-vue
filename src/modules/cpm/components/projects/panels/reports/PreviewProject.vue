<template>
  <v-card
    flat
    fluid
  >
    <v-card-title class="headline px-6 py-4 white">
      <span class="grey--text text--darken-1">
        {{ project.title }}
      </span>
    </v-card-title>
    <v-divider class="grey lighten-3" />
    <v-card-text class="vertical-scroll">
      <v-container
        class="pa-0 rounded-lg"
        fluid
        grid-list-md
      >
        <v-row>
          <v-col
            md="6"
            sm="12"
          >
            <v-avatar
              size="80px"
              :title="false"
            >
              <img :src="project.image">
            </v-avatar>
          </v-col>
          <v-col
            v-show="previewOptions.checkProjectDescription"
            md="6"
            sm="12"
          >
            <strong>Description</strong>
          </v-col>
          <v-col
            md="6"
            sm="12"
          >
            {{ project.description }}
          </v-col>
        </v-row>
        <v-row
          v-show="previewOptions.checkProfile"
        >
          <v-col
            md="6"
            sm="12"
          >
            <v-container
              class="rounded-lg"
              fluid
              grid-list-md
            >
              <v-row>
                <v-col
                  md="6"
                  sm="12"
                >
                  <strong>Manager</strong>
                </v-col>
                <v-col
                  md="6"
                  sm="12"
                >
                  {{ projectGroup.managerName }}
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  md="6"
                  sm="12"
                >
                  <strong>Category</strong>
                </v-col>
                <v-col
                  md="6"
                  sm="12"
                >
                  {{ project.category }}
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  md="6"
                  sm="12"
                >
                  <strong>Type</strong>
                </v-col>
                <v-col
                  md="6"
                  sm="12"
                >
                  {{ project.type }}
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  md="6"
                  sm="12"
                >
                  <strong>Budget</strong>
                </v-col>
                <v-col
                  md="6"
                  sm="12"
                >
                  ${{ project.budgetTotal }}
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  md="6"
                  sm="12"
                >
                  <strong>Start Date</strong>
                </v-col>
                <v-col
                  md="6"
                  sm="12"
                >
                  {{ project.startDate }}
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  md="6"
                  sm="12"
                >
                  <strong>End Date</strong>
                </v-col>
                <v-col
                  md="6"
                  sm="12"
                >
                  {{ project.endDate }}
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  md="6"
                  sm="12"
                >
                  <strong>Number</strong>
                </v-col>
                <v-col
                  md="6"
                  sm="12"
                >
                  {{ project.number }}
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  md="6"
                  sm="12"
                >
                  <strong>Licensing</strong>
                </v-col>
                <v-col
                  md="6"
                  sm="12"
                >
                  {{ project.license }}
                </v-col>
              </v-row>
            </v-container>
          </v-col>
          <v-col
            md="6"
            sm="12"
          >
            <v-container
              class="rounded-lg"
              fluid
              grid-list-md
            >
              <v-row>
                <v-col
                  md="6"
                  sm="12"
                >
                  <strong>Phase</strong>
                </v-col>
                <v-col
                  md="6"
                  sm="12"
                >
                  {{ project.phase }}
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  md="6"
                  sm="12"
                >
                  <strong>Phase Target Date</strong>
                </v-col>
                <v-col
                  md="6"
                  sm="12"
                >
                  {{ project.phaseTargetDate }}
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  md="6"
                  sm="12"
                >
                  <strong>Percentage Complete</strong>
                </v-col>
                <v-col
                  md="6"
                  sm="12"
                >
                  {{ project.completion ? project.completion : 0 }}%
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  md="6"
                  sm="12"
                >
                  <strong>Budget Status</strong>
                </v-col>
                <v-col
                  md="6"
                  sm="12"
                >
                  {{ project.budgetStatus }}
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  md="6"
                  sm="12"
                >
                  <strong>Commitments</strong>
                </v-col>
                <v-col
                  md="6"
                  sm="12"
                >
                  ${{ project.commitmentsTotal }}
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  md="6"
                  sm="12"
                >
                  <strong>Spend to Date</strong>
                </v-col>
                <v-col
                  md="6"
                  sm="12"
                >
                  ${{ project.spendingTotal }}
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  md="6"
                  sm="12"
                >
                  <strong>Proposed Spend</strong>
                </v-col>
                <v-col
                  md="6"
                  sm="12"
                >
                  ${{ project.changesTotal }}
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>

        <v-row
          v-show="previewOptions.checkProjectPhotos"
        >
          <v-col md="12">
            <gallery
              :files="project.files[4].children[5].children"
              title="Project Photos"
            />
          </v-col>
        </v-row>

        <v-row
          v-show="previewOptions.comments"
        >
          <v-col
            md="12"
            sm="12"
          >
            <budget-comment :pid="project.id" />
          </v-col>
          <v-col
            md="12"
            sm="12"
          >
            <status-comment :pid="project.id" />
          </v-col>
        </v-row>

        <v-row
          v-show="previewOptions.checkMilestones"
        >
          <v-col md="12">
            <v-card>
              <v-card-text class="vertical-scroll">
                <v-container
                  class="pa-0 rounded-lg"
                  fluid
                  grid-list-md
                >
                  <v-row>
                    <v-col md="12">
                      <milestones :pid="project.id" />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row
          v-show="previewOptions.checkCostSummary"
        >
          <v-col md="12">
            <financial-cost-summary :pid="project.id" />
          </v-col>
        </v-row>

        <v-row
          v-show="previewOptions.checkCommitments"
        >
          <v-col md="12">
            <financial-commitments :pid="project.id" />
          </v-col>
        </v-row>

        <v-row
          v-show="previewOptions.checkSpending"
        >
          <v-col md="12">
            <financial-spendings :pid="project.id" />
          </v-col>
        </v-row>

        <v-row
          v-show="previewOptions.checkCommitmentPictures"
        >
          <v-col md="12">
            <gallery
              :files="project.files[1].children[9].children"
              title="Commitment Pictures"
            />
          </v-col>
        </v-row>

        <v-row
          v-show="previewOptions.checkSpendingPictures"
        >
          <v-col md="12">
            <gallery
              :files="project.files[1].children[6].children"
              title="Spending Pictures"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import FinancialCostSummary from '../FinancialCostSummary'
import Gallery from './PreviewComponents/Gallery'
import BudgetComment from '../BudgetComment'
import StatusComment from '../StatusComment'
import FinancialCommitments from '../FinancialCommitments'
import FinancialSpendings from '../FinancialSpendings'
import Milestones from '../schedule/Milestones'

export default {
  components: {
    FinancialCostSummary,
    Gallery,
    BudgetComment,
    StatusComment,
    FinancialCommitments,
    FinancialSpendings,
    Milestones
  },
  props: {
    projectGroup: {
      type: Object,
      required: true
    },
    project: {
      type: Object,
      required: true
    },
    previewOptions: {
      type: Object,
      required: true
    }
  }
}
</script>
