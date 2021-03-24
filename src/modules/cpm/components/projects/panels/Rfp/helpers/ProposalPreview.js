import { DateTime } from 'luxon'

const auxiliarVariable = {
  value: '',
  label: '',
  group: ''
}

class ProposalPreview {
  constructor(sections = [], options = {}, customOptions = {}) {
    this.customOptions = customOptions

    const sectionsSorted = this.orderSectionsByIdx(sections)

    const aux = this.getSections(sectionsSorted)

    this.sectionPortrait = aux.sectionPortrait
    this.bodySections = aux.sectionsBody

    this.tableOfContents = []

    this.options = options
    this.componentsToMount = []
    this.taggedTemplate = ''

    // Calculating dates
    this.scheduleDates = []
    this.schedules = []

    this.variables = [
      // Project
      {
        value: 'ProjectName',
        label: 'Project Name',
        replaceWith: { source: 'project', name: 'title', type: 'Text' },
        group: 'project'
      },
      {
        value: 'ProjectStartDate',
        label: 'Project Start Date',
        replaceWith: { source: 'project', name: 'startDate', type: 'Date' },
        group: 'project'
      },
      {
        value: 'ProjectManagerEmail',
        label: 'Project Manager Email',
        replaceWith: {
          source: 'project',
          name: 'manager.email',
          type: 'Text'
        },
        group: 'project'
      },
      {
        value: 'ProjectManager',
        label: 'Project Manager',
        replaceWith: {
          source: 'project',
          name: 'manager.label',
          type: 'Text'
        },
        group: 'project'
      },
      {
        value: 'ProjectAddress',
        label: 'Project Address',
        replaceWith: { source: 'project', name: 'address' },
        group: 'project'
      },
      {
        value: 'ProjectBackground',
        label: 'Project Background',
        replaceWith: { source: 'proposal', name: 'projectBackground' },
        group: 'project'
      },
      {
        value: 'ProjectOverview',
        label: 'Project Overview',
        replaceWith: { source: 'proposal', name: 'projectOverview' },
        group: 'project'
      },
      {
        value: 'ProjectScopeOfWork',
        label: 'Project Scope of Work',
        replaceWith: { source: 'proposal', name: 'scopeOfWork' },
        group: 'project'
      },
      // Campus
      {
        value: 'CampusAddress',
        label: 'Campus Address',
        replaceWith: { source: 'campus', name: 'address', type: 'Text' },
        group: 'project'
      },
      {
        value: 'CampusName',
        label: 'Campus Name',
        replaceWith: { source: 'campus', name: 'name', type: 'Text' },
        group: 'project'
      },
      {
        value: 'CampusLogo',
        label: 'Campus Logo',
        replaceWith: { source: 'campus', name: 'logo', type: 'Image' },
        group: 'project'
      },
      // Proposal Summary
      {
        value: 'MAC',
        label: 'MAC',
        replaceWith: { source: 'proposal', name: 'cost', type: 'Money' },
        group: 'proposal'
      },
      {
        value: 'ProposalSentDate',
        label: 'Proposal Sent Date',
        replaceWith: { source: 'project', name: 'title' },
        group: 'proposal'
      },
      {
        value: 'RFPName',
        label: 'RFP Name',
        replaceWith: { source: 'proposal', name: 'name', type: 'Text' },
        group: 'proposal'
      },
      {
        value: 'RFPType',
        label: 'RFP Type',
        replaceWith: { source: 'proposal', name: 'type', type: 'Text' },
        group: 'proposal'
      },
      {
        value: 'Rfpcoverphoto',
        label: 'Rfp Cover Photo',
        replaceWith: { source: 'proposal', name: 'cover.url', type: 'Image' },
        group: 'proposal'
      },
      {
        value: 'InterviewDate',
        label: 'Interview Date',
        replaceWith: {
          source: 'proposal',
          name: 'interviewDate',
          type: 'Text'
        },
        group: 'proposal'
      },
      {
        value: 'InterviewLocation',
        label: 'Interview Location',
        replaceWith: {
          source: 'proposal',
          name: 'interviewLocation',
          type: 'Text'
        },
        group: 'proposal'
      },


      // components
      {
        value: 'TechnicalProposalSummary',
        id: 'technicalProposalSummary',
        label: 'Proposal Scoring Summary',
        replaceWith: { source: 'component' },
        group: 'components'
      },
      {
        value: 'TechnicalProposalDetailed',
        id: 'technicalProposalDetailed',
        label: 'Proposal Scoring Detailed',
        replaceWith: { source: 'component' },
        group: 'components'
      },
      {
        value: 'TechnicalScore',
        id: 'technicalScore',
        label: 'Technical Score',
        replaceWith: { source: 'component' },
        group: 'components'
      },
      {
        value: 'ProposalScoring',
        id: 'proposalScoring',
        label: 'Proposal Scoring',
        replaceWith: { source: 'component' },
        group: 'components'
      },
      // { value: 'TimeLine', label:"TimeLine", id:"timelineView", replaceWith:{ source:"component" }, group: 'components' },
      {
        value: 'Allowance',
        label: 'Allowance',
        id: 'allowanceView',
        replaceWith: { source: 'component' },
        group: 'components'
      },
      {
        value: 'Alternates',
        label: 'Alternates',
        id: 'alternatesView',
        replaceWith: { source: 'component' },
        group: 'components'
      },
      {
        value: 'InterviewPanel',
        id: 'interviewPanel',
        label: 'Interview Panel',
        replaceWith: { source: 'component' },
        group: 'components'
      },
      {
        value: 'InterviewDetails',
        id: 'interviewDetails',
        label: 'Interview Details',
        replaceWith: { source: 'component' },
        group: 'components'
      },
      {
        value: 'InterviewScoring',
        id: 'interviewScoring',
        label: 'Interview Scoring',
        replaceWith: { source: 'component' },
        group: 'components'
      },
      {
        value: 'TechnicalReviewPanel',
        id: 'technicalReviewPanel',
        label: 'Technical Review Panel',
        replaceWith: { source: 'component' },
        group: 'components'
      },
      {
        value: 'PrebidConference',
        id: 'prebidConference',
        label: 'Pre-Bid Conference and Job Walk Q&A Panel',
        replaceWith: { source: 'component' },
        group: 'components'
      },
      {
        value: 'MeetingsPanel',
        id: 'meetingsPanel',
        label: 'Meetings Panel',
        replaceWith: { source: 'component' },
        group: 'components'
      },
      {
        value: 'RiskManagement',
        id: 'riskManagement',
        label: 'Risk Management',
        replaceWith: { source: 'component' },
        group: 'components'
      },
      {
        value: 'LessonsLearned',
        id: 'lessonsLearned',
        label: 'Lessons Learned',
        replaceWith: { source: 'component' },
        group: 'components'
      },
      {
        value: 'ManagementTeam',
        id: 'managementTeam',
        label: 'Management Team',
        replaceWith: { source: 'component' },
        group: 'components'
      },
      {
        value: 'Interview',
        id: 'interviewView',
        label: 'Interview',
        replaceWith: { source: 'component' },
        group: 'components'
      },
      {
        value: 'BiddersOneOnOne',
        id: 'biddersOneOnOne',
        label: 'Bidders One on One',
        replaceWith: { source: 'component' },
        group: 'components'
      },
      {
        value: 'QualificationScoring',
        id: 'qualificationScoring',
        label: 'Qualification Scoring',
        replaceWith: { source: 'component' },
        group: 'components'
      }
    ]

    // Get variables of schedule
    if (!(sections == [] && Object.keys(options).length <= 0 && Object.keys(customOptions).length <= 0)) {
      this.getScheduleActiveDates()
    }
    this.variables.forEach((variable, index) => {
      variable.id = index
    })
  }

  capitalize(s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }


  getValuesFromKey(auxKey = []) {
    let value = ''
    let label = ''
    let id = ''
    auxKey.forEach((word, index) => {
      value += this.capitalize(word)
      label += this.capitalize(word) + ' '

      if (index > 0) {
        id += this.capitalize(word)
      } else {
        id += word
      }
    })

    return {
      value: value,
      label: label,
      id: id
    }
  }


  getScheduleActiveDates() {
    if (this.options.timeline) {
      Object.keys(this.options.timeline).forEach(schedule => {
        const aux = { ...auxiliarVariable }
        const stringKey = schedule
        const auxKey = stringKey.split('-')

        const scheduleValues = this.getValuesFromKey(auxKey)
        aux.value = scheduleValues.value
        aux.label = scheduleValues.label
        aux.id = scheduleValues.id

        aux.replaceWith = {
          source: 'timeline',
          name: schedule,
          type: 'Date'
        }

        aux.group = 'timeline'

        this.variables.push(aux)
      })
    }
  }

  /**
   * @param {sections} array of objects
   * @description function for order the sections given idx
   * @returns sorted array of objects
   */
  orderSectionsByIdx(sections) {
    const sortedArray = sections.sort((a, b) => {
      if (!a.idx || !b.idx) {
        return 0
      }

      if (a.idx > b.idx) {
        return 1
      }
      if (a.idx < b.idx) {
        return -1
      }
      // a must be equal to b
      return 0
    })
    return sortedArray
  }

  /**
   * @param {sections} array of objects
   * @description function for getting the section of the portrait and the sections for the body
   * @returns object with the section of the portrait
  */
  getSections(sections) {
    return {
      sectionPortrait: sections.find(section => section.portrait == true),
      sectionsBody: sections.filter(section => !section.portrait || section.portrait == false)
    }
  }


  /**
   * @description function for getting the variables using in tiptap
   * @returns array
  */
  getVariables() {
    return this.variables
  }

  /**
   * @description function for getting the variables without the component allowance
   * @returns array
  */
  getVariablesForAllowanceAndAlternatesModule() {
    return this.variables.filter(variable => variable.label != 'Allowance')
  }


  /**
   * @param {variable} string with the name of the property
   * @description function for getting the variable in options given the variable name
   * @returns string
  */
  resolveOriginalData(variable) {
    return this.options[variable]
  }

  /**
   * @param {auxString} string
   * @description function for getting an unique id
   * @returns string
  */
  generateId(auxString) {
    return auxString + parseInt(Date.now() + Math.random())
  }

  /**
   * @description function for getting an id for the portrait section
   * @returns string
  */
  getIdPortraitSection() {
    if (this.customOptions.idPortraitSection && this.customOptions.idPortraitSection != '') {
      return this.customOptions.idPortraitSection
    }
    return 'portrait'
  }


  /**
   * @description function for getting an id for the body section
   * @returns string
  */
  getIdBodySection() {
    if (this.customOptions.idBodySection && this.customOptions.idBodySection != '') {
      return this.customOptions.idBodySection
    }
    return 'bodyPreview'
  }


  /**
  * @description function for getting an id
  * @returns string
  */
  getPreappendId() {
    if (this.customOptions.initialId && this.customOptions.initialId != '') {
      return this.customOptions.initialId
    }
    return ''
  }


  /**
   * @description function for getting the portrait section html
   * @returns string
  */
  generatePortraitSection() {
    let body = ''
    const id = this.getIdPortraitSection()
    if (this.sectionPortrait && this.sectionPortrait != null) {
      body += `<section id="${id}">`
      body += this.sectionPortrait.body
      body += '</section>'
    }
    return body
  }

  /**
   * @param {addSectionLabel} boolean determines if it exports with h1 for each section name
   * @description function for getting the body section html
   * @returns string
  */
  generateBodyFromSections(addSectionLabel = true) {
    let counter = 0
    const idSection = this.getIdBodySection()
    let mainBody = `<section id='${idSection}'>`

    this.bodySections.map(data => {
      // Calculating id
      const id = this.getPreappendId() + data.name.toLowerCase().replace(/\s+/g, '') + counter

      if (addSectionLabel) {
        mainBody += `<h1 id="${id}" >${data.name}</h1>`
      }
      mainBody += data.body

      const section = { title: data.name, id: id, subSections: [] }

      const dummyEl = document.createElement('html')
      dummyEl.innerHTML = data.body
      const sectionTitles = dummyEl.getElementsByTagName('h2')


      let counterSubtitle = 0
      for (let i = 0; i < sectionTitles.length; i++) {
        const subId = data.name.toLowerCase().replace(/\s+/g, '') + 'sub' + counterSubtitle
        mainBody = mainBody.replace('<h2>', `<h2 id="${subId}">`)

        section.subSections.push({
          body: sectionTitles[i].innerText,
          id: subId
        })
        counterSubtitle++
      }

      this.tableOfContents.push(section)

      // Adding +1 to the counter for the id in case the name repeats
      counter++
    })

    mainBody += '</section>'

    return mainBody
  }

  /**
   * @param {componentName} string
   * @description function for searching if the component is in the html
   * @returns boolean
  */
  isAnyComponentInComponentsToMounted(componentName) {
    const aux = this.componentsToMount.find(component => component.value == componentName)

    return aux ? true : false
  }

  /**
   * @description function for getting the html divided by portrait and section body
   * @returns object for portrait, body and combined
  */
  getFullBody() {
    let fullTaggedTemplate = ''
    const auxPortrait = this.getPortrait()
    const auxBody = this.getBody()

    fullTaggedTemplate = auxPortrait.taggedTemplate + auxBody.taggedTemplate

    return {

      fullTaggedTemplate: fullTaggedTemplate,
      portraitTaggedTemplate: auxPortrait.taggedTemplate,
      bodyTaggedTemplate: auxBody.taggedTemplate
    }
  }

  /**
   * @description function for getting portrait string
   * @returns string
  */
  getPortrait() {
    let body = this.generatePortraitSection()
    body = this.checkForInterviewTags(body)
    return this.getTaggedHtmlAndComponents(body)
  }

  /**
   * @description function for getting body string
   * @returns string
  */
  getBody() {
    const addSectionLabel = this.customOptions.addSectionLabel != undefined ? this.customOptions.addSectionLabel : true

    let body = this.generateBodyFromSections(addSectionLabel)
    body = this.checkForInterviewTags(body)

    return this.getTaggedHtmlAndComponents(body)
  }

  /**
   * @param {body} string
   * @description function for getting the components needed to mount
   * @returns object body and taggedTemplate
  */
  getTaggedHtmlAndComponents(body) {
    let taggedTemplate = body


    this.variables.map(variable => {
      let replaceString = ''

      const source = variable.replaceWith.source

      // let stringToFind = "#"+variable.value;
      const stringToFind = '(\\#' + variable.value + '+\\b)(?!;)'

      let regex = new RegExp(stringToFind, 'g')


      switch (source) {
        case 'component':
          // Checking if  a component needs to be mounted
          // Component string found

          const bodyReg = body.match(regex)

          if (!bodyReg) {
            break
          }
          bodyReg.map(() => {
            const aux = {
              id: this.getPreappendId() + 'comp-' + this.generateId(variable.id),
              value: variable.value
            }

            this.componentsToMount.push(aux)

            replaceString = `<div id="${aux.id}" ></div>`
            regex = new RegExp(stringToFind)

            body = body.replace(regex, replaceString)
            // Getting tagged template
            taggedTemplate = taggedTemplate.replace(regex, replaceString)
          })

          break
      }
    })

    body = this.cleanAfterMount(body)
    taggedTemplate = this.cleanAfterMount(taggedTemplate)


    return {
      body: body,
      taggedTemplate: taggedTemplate
    }
  }

  /**
   * @param {body} string
   * @description function for getting html tag substituted for value
   * @returns body string
  */
  substituteValues(body = '') {
    this.variables.map(variable => {
      let replaceString = ''

      const source = variable.replaceWith.source

      // let stringToFind = "#"+variable.value;
      const stringToFind = '(\\#' + variable.value + '+\\b)(?!;)'
      const regex = new RegExp(stringToFind, 'g')


      switch (source) {
        case 'timeline':
        case 'project':
        case 'proposal':
        case 'campus':
          try {
            replaceString = variable.replaceWith.name.split('.').reduce((prev, itm) => prev[itm], this.resolveOriginalData(source))
          } catch (error) {
            replaceString = ''
          }

          if (replaceString === '') {
            replaceString = `<span style="color:red">The field ${variable.value} is missing</span>`
          } else {
            switch (variable.replaceWith.type) {
              case 'Time':
                replaceString = DateTime.fromISO(replaceString).toLocaleString(DateTime.TIME_SIMPLE)
                break

              case 'Date':
                replaceString = DateTime.fromISO(replaceString).toFormat('MM/dd/yyyy')
                break

              case 'Image':
                replaceString = '<img src=' + replaceString + '>'
                break
              case 'Money':
                replaceString = parseFloat(replaceString).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD'
                })
                break
            }
          }

          body = body.replace(regex, replaceString)

          break
      }
    })

    body = this.cleanAfterMount(body)
    return {
      body: body
    }
  }

  /**
   * @param {body} string
   * @description function for deleting the interview tags in the html
   * @returns string
  */
  deleteIfInterviewTags(body) {
    // Delete de #ifinterviewscoring and #endifinterviewscoring
    let stringToFind = '#ifinterviewscoring'
    let regex = new RegExp(stringToFind, 'g')
    body = body.replace(regex, '')

    stringToFind = '#endifinterviewscoring'
    regex = new RegExp(stringToFind, 'g')
    body = body.replace(regex, '')

    return body
  }

  /**
   * @param {body} string
   * @description function for checking if there is an interview tags and delete tags
   * @returns string
  */
  checkForInterviewTags(body) {
    if (this.options.proposal.hasInterviewingScoring) {
      body = this.deleteIfInterviewTags(body)
    } else {
      // Delete everything between #ifinterviewscoring and #endifinterviewscoring
      const regex = new RegExp(/(?<=#ifinterviewscoring)([\S\s]*?)(?=#endifinterviewscoring)/, 'g')
      body = body.replace(regex, '')
      body = this.deleteIfInterviewTags(body)
    }
    return body
  }

  /**
   * @description function for getting the components to mount
   * @returns array
  */
  getComponentsToMount() {
    return this.componentsToMount
  }

  /**
   * @description function for getting the table of contents
   * @returns array
  */
  getTablesOfContents() {
    return this.tableOfContents
  }

  /**
   * @param {body} string
   * @description function for deleting the span
   * @returns string
  */
  cleanAfterMount(body) {
    const regex = /<\/?span[^>]*>/ig
    body = body.replace(regex, '')

    return body
  }
}

export default ProposalPreview
