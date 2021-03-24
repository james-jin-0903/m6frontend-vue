
import ProposalPreview from './ProposalPreview.js'
import { mountComponents } from './ProposalHelper.js'
import { db } from '@/utils/Firebase'


class ProposalGeneratePreview {
  constructor(selectedTemplate, proposal, projectId, proposalDates, customOptionsProposal, extras = {
    type: 'default'
  }) {
    this.selectedTemplate = selectedTemplate
    this.proposal = proposal
    this.projectId = projectId
    this.proposalDates = proposalDates
    this.customOptionsProposal = customOptionsProposal
    this.extras = extras
  }
  
  getscheduleDates({ rootState }) {
    const aux = new Promise((resolve, reject) => {
      try {
        const scheduleDates = {}
        if (this.proposal.schedule && this.proposal.schedule.slug) {
          let auxKey = this.proposal.schedule.slug
          auxKey = auxKey + '-sharpBoard'
          scheduleDates['sharpBoard'] = this.proposal[auxKey]
        }
        db.collection('settings')
          .doc(rootState.Companies.currentCompany.id)
          .collection('settings')
          .doc('rfp')
          .collection('scheduleDates')
          .orderBy('created_at', 'asc')
          .get()
          .then(snap => {
            if (!snap.empty) {
              snap.docs.forEach(doc => {
                const aux = doc.data()
                aux.id = doc.id

                scheduleDates[aux.slug] = ''
                if (this.proposal.schedule && this.proposal.schedule.slug) {
                  let auxKey = this.proposal.schedule.slug
                  auxKey = auxKey + '-' + aux.slug
                  scheduleDates[aux.slug] = this.proposal[auxKey]
                }
              })
            }
            resolve(scheduleDates)
          })
      } catch (error) {
        reject(error)
      }
    })
    return aux
  }

  /**
   * @param {project} object
   * @description function for getting the campus
   * @returns campus
   */
  getCampusOptions(project, { rootState }) {
    const auxPromise = new Promise((resolve, reject) => {
      try {
        const options = {
          address: '',
          name: '',
          logo: ''
        }

        db.collection('settings').doc(rootState.Companies.currentCompany.id).collection('settings').doc('projects').get().then(snap => {
          if (snap.exists) {
            const campusArray = snap.data().campus

            if (campusArray != null) {
              const campusAuxId = project && project.campus && project.campus.length > 0 ? project.campus[0].item.id : ''

              const campus = campusArray.find(campusAuxArray => campusAuxArray.id && campusAuxArray.id == campusAuxId)

              if (campus != null) {
                options.address = campus.address
                options.name = campus.name
                options.logo = campus.logo ? campus.logo.url : ''
              }
            }
          }

          resolve(options)
        })
      } catch (error) {
        reject(error)
      }
    })

    return auxPromise
  }


  /**
   * @param {type} string
   * @param {selectedTemplateId} template id
   * @description function for getting the sections of the template
   * @returns array of sections
   */
  getSections(type = 'default', selectedTemplateId = '') {
    const auxPromise = new Promise((resolve, reject) => {
      const sections = []

      try {
        if (type == 'default') {
          db.collection('rfp_templates').doc(selectedTemplateId).collection('sections').orderBy('idx').get().then(snap => {
            snap.forEach(doc => {
              const data = doc.data()

              sections.push(data)
            })

            resolve(sections)
          })
        }
      } catch (error) {
        reject(sections)
      }
    })

    return auxPromise
  }

  /**
   * @param {id} string
   * @description function for getting the project
   * @returns project
   */
  getProject(id) {
    const auxPromise = new Promise((resolve, reject) => {
      try {
        db.collection('cpm_projects').doc(id).get().then(snapshot => {
          const project = snapshot.data()
          resolve(project)
        })
      } catch (error) {
        reject(error)
      }
    })
    return auxPromise
  }

  /**
   * @description function for getting the options
   * @returns object with proposal,project,timeline,campus
   */
  getOptions() {
    const auxPromise = new Promise((resolve, reject) => {
      try {
        if (!this.selectedTemplate.id || !this.proposal.name) {
          reject('Variables missing')
        }

        Promise.all([
          this.getProject(this.projectId),
          this.getscheduleDates()
        ]).then(values => {
          this.getCampusOptions(values[0]).then(campus => {
            const options = {
              proposal: this.proposal,
              project: values[0],
              timeline: values[1],
              campus: campus
            }

            resolve(options)
          })
        })
      } catch (error) {
        reject(error)
      }
    })


    return auxPromise
  }

  /**
   * @param {allowances} array
   * @param {allowanceIndex} id,
   * @param {components} array
   * @param {project} object
   * @description function for mounting allowance components
   * @returns object with html body
   */
  mountAllowanceComponents(allowances = [], allowanceIndex, components = [], project = {}) {
    const auxPromise = new Promise((resolve, reject) => {
      try {
        let auxElement = null
        this.createComponents(components, project).then(() => {
          auxElement = document.getElementById('allowanceBody')
          // Saving in the allowances
          allowances[allowanceIndex].html = auxElement.innerHTML

          db.collection('proposals')
            .doc(this.proposal.id).update({
              allowances: allowances
            }).then(() => {
              const payload = {
                body: auxElement.innerHTML
              }
              resolve(payload)
            })
        })
      } catch (error) {
        reject(error)
      }
    })

    return auxPromise
  }

  /**
   * @param {type} string
   * @description function for getting the body of the allowance with the the variables replaced of amount and description
   * @returns body string
   */
  getBodyReplaceWithAllowanceVariables(allowance, body) {
    // Replace the tags of amount and description
    const variables = [
      'amount',
      'description'
    ]

    variables.map(variable => {
      const stringToFind = '#' + variable

      // Todo:improve regex to match exact
      const regex = new RegExp(stringToFind, 'g')

      body = body.replace(regex, allowance[variable])
    })
    return body
  }

  /**
   * @param {allowance} object
   * @param {templates} array
   * @param {options} object
   * @description function for getting the allowance html
   * @returns array of sections
   */
  getAllowanceHtml(allowance, templates, options) {
    const auxPromise = new Promise((resolve, reject) => {
      try {
        const template = templates.find(auxTemplate => {
          if (allowance.template != null) {
            return auxTemplate.id == allowance.template.id
          }
          return false
        })
        // If it finds the template get the section of the template
        if (template) {
          db.collection('allowance_templates').doc(template.id)
            .collection('sections').get().then(snap => {
              const sections = []
              snap.forEach(doc => {
                const data = doc.data()
                sections.push(data)
              })

              const customOptions = {
                idPortraitSection: 'sectionAuxPortrait',
                idBodySection: 'sectionAuxAllowanceBody',
                initialId: 'sectionAuxAllowance',
                addSectionLabel: false
              }

              const proposalPreviewAux = new ProposalPreview(sections, options, customOptions)
              const aux = proposalPreviewAux.getFullBody()

              const auxBody = proposalPreviewAux.substituteValues(aux.fullTaggedTemplate, proposalPreviewAux.getVariables())

              const payload = {
                components: proposalPreviewAux.getComponentsToMount(),
                body: this.getBodyReplaceWithAllowanceVariables(allowance, auxBody.body)
              }

              resolve(payload)
            })
        } else {
          resolve({
            components: [],
            body: ''
          })
        }
      } catch (error) {
        reject(error)
      }
    })

    return auxPromise
  }

  /**
   * @description function for getting the allowance templates
   * @returns array of templates
   */
  getAllowanceTemplates() {
    const auxPromise = new Promise((resolve, reject) => {
      try {
        const templates = []

        db
          .collection('allowance_templates')
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              const template = doc.data()
              template.id = doc.id
              templates.push(template)
            })

            resolve(templates)
          })
      } catch (error) {
        reject(error)
      }
    })
    return auxPromise
  }

  /**
   * @description function for getting the html body
   * @returns object with html properties
   */
  calculatePreview() {
    const auxPromise = new Promise((resolve, reject) => {
      try {
        if (!this.selectedTemplate.id || !this.proposal.name) {
          reject('Variables missing')
        }

        this.getSections(this.extras.type, this.selectedTemplate.id).then(sections => {
          this.getOptions().then(options => {
            const proposalPreview = new ProposalPreview(sections, options, this.customOptionsProposal)
            const aux = proposalPreview.getFullBody()


            const payload = {
              fullTaggedTemplate: aux.fullTaggedTemplate,
              portraitTaggedTemplate: aux.portraitTaggedTemplate,
              bodyTaggedTemplate: aux.bodyTaggedTemplate,

              tableOfContents: proposalPreview.getTablesOfContents(),
              proposalPreview: proposalPreview,
              project: options.project,
              options: options
            }


            resolve(payload)
          })
        })
      } catch (error) {
        reject(error)
      }
    })


    return auxPromise
  }

  /**
   * @param {components} array
   * @param {project} object
   * @description function for mounting components
   */
  createComponents(components, project) {
    const aux = {
      project: project
    }
    return mountComponents(components, this.proposal, aux)
  }
}

export default ProposalGeneratePreview
