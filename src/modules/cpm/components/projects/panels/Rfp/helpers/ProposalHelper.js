import Vue from 'vue'

// Components to use
import TimelineView from '../PreviewComponents/TimelineView'
const TimelineViewCtor = Vue.extend(TimelineView)

import ProposalScoringSummaryView from '../PreviewComponents/ProposalScoringSummary'
const ProposalScoringSummaryCtor = Vue.extend(ProposalScoringSummaryView)

import ProposalScoringDetailedView from '../PreviewComponents/ProposalScoringDetailed'
const ProposalScoringDetailedCtor = Vue.extend(ProposalScoringDetailedView)

import TechnicalScoreView from '../PreviewComponents/TechnicalScore'
const TechnicalScoreCtor = Vue.extend(TechnicalScoreView)

import AllowanceView from '../PreviewComponents/AllowanceView'
const AllowanceCtor = Vue.extend(AllowanceView)

import ProposalScoringView from '../PreviewComponents/ProposalScoring'
const ProposalScoringCtor = Vue.extend(ProposalScoringView)

import Interview from '../PreviewComponents/Interview'
const InterviewCtor = Vue.extend(Interview)

import InterviewScoring from '../PreviewComponents/InterviewScoring'
const InterviewScoringCtor = Vue.extend(InterviewScoring)


import InterviewDetailsView from '../PreviewComponents/InterviewTableView'
const InterviewDetailsViewCtor = Vue.extend(InterviewDetailsView)

import PeopleGeneral from '../PreviewComponents/PeopleGeneral'
const PeopleGeneralCtor = Vue.extend(PeopleGeneral)


import LessonsLearned from '../PreviewComponents/LessonsLearned'
const LessonsLearnedCtor = Vue.extend(LessonsLearned)

import RiskManagement from '../PreviewComponents/RiskManagement'
const RiskManagementCtor = Vue.extend(RiskManagement)


import AlternatesView from '../PreviewComponents/Alternates'
const AlternatesViewCtor = Vue.extend(AlternatesView)


import BiddersOneOnOne from '../PreviewComponents/BiddersMeetings'
const BiddersMeetingsCtor = Vue.extend(BiddersOneOnOne)

import QualificationScoring from '../PreviewComponents/QualificationScoring'
const QualificationScoringCtor = Vue.extend(QualificationScoring)

function mountComponents(componentsArray, proposal, settings = {}) {
  const auxPromise = new Promise((resolve, reject) => {
    try {
      // Todo:Unmount unnecessary components
      const componentsToMount = componentsArray

      let aux = null
      componentsToMount.map(component => {
        switch (component.value) {
          // case "TimeLine":
          //   aux = new TimelineViewCtor(
          //     {  propsData: { proposal:proposal } }
          //   );

          //   break;

          case 'TechnicalProposalSummary':
            aux = new ProposalScoringSummaryCtor(
              { propsData: { proposal: proposal } }
            )
            break

          case 'TechnicalScore':
            aux = new TechnicalScoreCtor(
              { propsData: { proposal: proposal } }
            )
            break

          case 'TechnicalProposalDetailed':
            aux = new ProposalScoringDetailedCtor(
              { propsData: { proposal: proposal } }
            )
            break

          case 'Allowance':
            aux = new AllowanceCtor(
              { propsData: { proposal: proposal } }
            )
            break

          case 'Alternates':
            aux = new AlternatesViewCtor(
              {
                propsData: {
                  proposal: proposal,
                  typeValue: 'alternates',
                  noAvailableItems: 'No alternates will be held for this project.'
                }
              }
            )
            break

          case 'ProposalScoring':
            aux = new ProposalScoringCtor(
              { propsData: { proposal: proposal } }
            )
            break


          case 'TechnicalReviewPanel':
            aux = new PeopleGeneralCtor(
              {
                propsData: {
                  proposal: proposal,
                  typeValue: 'reviewPanel',
                  noAvailableItems: 'No reviews will be held for this project.'
                }
              }
            )
            break

          case 'Interview':
            aux = new InterviewCtor(
              { propsData: { proposal: proposal } }
            )

            break

          case 'InterviewScoring':
            aux = new InterviewScoringCtor(
              { propsData: { proposal: proposal } }
            )
            break

          case 'QualificationScoring':
            aux = new QualificationScoringCtor(
              { propsData: { proposal: proposal } }
            )
            break

          case 'InterviewPanel':
            aux = new PeopleGeneralCtor(
              {
                propsData: {
                  proposal: proposal,
                  typeValue: 'interviewPanel',
                  noAvailableItems: 'No interviews will be held for this project.'
                }
              }
            )
            break

          case 'PrebidConference':
            aux = new PeopleGeneralCtor(
              {
                propsData: {
                  proposal: proposal,
                  typeValue: 'questionsPanel',
                  noAvailableItems: 'No questions will be held for this project.'
                }
              }
            )
            break

          case 'MeetingsPanel':
            aux = new PeopleGeneralCtor(
              {
                propsData: {
                  proposal: proposal,
                  typeValue: 'meetingsPanel',
                  noAvailableItems: 'No meetings will be held for this project.'
                }
              }
            )
            break

          case 'LessonsLearned':
            aux = new LessonsLearnedCtor(
              { propsData: { proposal: proposal } }
            )
            break

          case 'RiskManagement':
            aux = new RiskManagementCtor(
              { propsData: { project: settings.project } }
            )
            break

          case 'ManagementTeam':
            aux = new PeopleGeneralCtor(
              {
                propsData: {
                  proposal: proposal,
                  typeValue: 'managementTeam',
                  noAvailableItems: 'No management team will be held for this project.'
                }
              }
            )
            break

          case 'InterviewDetails':
            aux = new InterviewDetailsViewCtor(
              { propsData: { proposal: proposal } }
            )
            break

          case 'BiddersOneOnOne':
            aux = new BiddersMeetingsCtor(
              { propsData: { proposal: proposal } }
            )
            break
        }
        try {
          aux.$mount('#' + component.id)
        } catch (error) {}
      })

      resolve(true)
    } catch (error) {
      reject(error)
    }
  })

  return auxPromise
}

export { mountComponents }
