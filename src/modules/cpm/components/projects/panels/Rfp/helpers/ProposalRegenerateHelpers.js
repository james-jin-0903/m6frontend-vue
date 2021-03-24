
import ProposalPreview from './ProposalPreview'
import { db } from '@/utils/Firebase'

class RegenerateHelper {
  constructor(templateId, sections = [], proposals = []) {
    this.templateId = templateId
    this.sections = sections
    this.proposals = proposals
  }

  getProposalDates(proposal) {
    return {
      'sentOut': proposal.sentOut ? proposal.sentOut : '',
      'mandatoryPreBid': proposal.mandatoryPreBid ? proposal.mandatoryPreBid : '',
      'bidders1on1': proposal.bidders1on1 ? proposal.bidders1on1 : '',
      'finalRfi': proposal.finalRfi ? proposal.finalRfi : '',
      'lastAddendum': proposal.lastAddendum ? proposal.lastAddendum : '',
      'technicalProposals': proposal.technicalProposals ? proposal.technicalProposals : '',
      'technicalEvaluation': proposal.technicalEvaluation ? proposal.technicalEvaluation : '',
      'interviews': proposal.interviews ? proposal.interviews : '',
      'noticeOnIntent': proposal.noticeOnIntent ? proposal.noticeOnIntent : '',
      'boardMemo': proposal.boardMemo ? proposal.boardMemo : '',
      'sharpBoard': proposal.sharpBoard ? proposal.sharpBoard : '',
      'noticeToProceed': proposal.noticeToProceed ? proposal.noticeToProceed : '',
      'kickOff': proposal.kickOff ? proposal.kickOff : '',
      'realDueDate': proposal.realDueDate ? proposal.realDueDate : '',
      'realRfiDueDate': proposal.realRfiDueDate ? proposal.realRfiDueDate : ''
    }
  }


  regeneraterRFP(sections, options, auxOptions) {
    const proposalPreview = new ProposalPreview(sections, options, auxOptions)
    const aux = proposalPreview.getFullBody()

    const payload = {
      body: aux.fullTaggedTemplate,
      portraitTaggedTemplate: aux.portraitTaggedTemplate,
      bodyTaggedTemplate: aux.bodyTaggedTemplate,

      components: proposalPreview.getComponentsToMount(),
      tableOfContents: proposalPreview.getTablesOfContents(),
      proposalPreview: proposalPreview
    }

    return payload
  }

  getCampusOptions(project) {
    const campus = project && project.campus && project.campus.length > 0 ? project.campus[0].item : null

    const options = {
      address: '',
      name: '',
      logo: ''
    }

    if (campus != null) {
      options.address = campus.address
      options.name = campus.name
      options.logo = campus.logo ? campus.logo.url : ''
    }

    return options
  }

  updateRFPSPromise() {
    const promiseAux = new Promise((resolve, reject) => {
      try {
        const proposalsToUpdate = this.proposals.filter(proposal => proposal.template != null && proposal.template && proposal.template.id && proposal.template.id == this.templateId)
        // No proposals to update
        if (proposalsToUpdate.length <= 0) {
          return
        }
        const template = db.collection('rfp_templates').doc(this.templateId)
        proposalsToUpdate.map(proposal => {
          db.collection('cpm_projects').doc(proposal.projectId).get().then(snapshot => {
            const project = snapshot.data()

            const options = {
              proposal: proposal,
              project: project,
              timeline: this.getProposalDates(proposal),
              campus: this.getCampusOptions(project)
            }

            const aux = this.regeneraterRFP(this.sections, options)

            proposal.template = template

            proposal.rfpTemplatePreview = {
              body: aux.body,
              components: aux.components,
              tableOfContents: aux.tableOfContents,

              portraitTaggedTemplate: aux.portraitTaggedTemplate,
              bodyTaggedTemplate: aux.bodyTaggedTemplate
            }


            this.saveRFP(proposal).then(
              result => {
                // console.log(result,"update template");
              },
              error => {
                // console.log(error)
              }
            )
          })
        })

        resolve('done')
      } catch (error) {
        reject(error)
      }
    })

    return promiseAux
  }

  updateRFPS() {
    return this.updateRFPSPromise()
  }

  saveRFP(proposal) {
    const promiseAux = new Promise((resolve, reject) => {
      try {
        db.collection('proposals').doc(proposal.id).set(proposal).then(doc => {
          resolve(proposal)
        })
      } catch (error) {
        reject(error)
      }
    })

    return promiseAux
  }
}

export default RegenerateHelper
