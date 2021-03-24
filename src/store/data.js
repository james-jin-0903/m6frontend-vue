//   const Convert = require("@/store/models/m6apps");

const RequestTab = () => import("@/components/RecordMode/RecordComponents/Tabs/RequestTab")
const TicketTab = () => import("@/components/RecordMode/RecordComponents/Tabs/TicketTab")
const ProjectSummary = () => import("@/components/RecordMode/RecordComponents/RecordType/Project/ProjectSummary")

const Description = () => import("@/components/RecordMode/RecordComponents/RecordType/ITApps/Tabs/Description")
const Contacts = () => import("@/components/RecordMode/RecordComponents/RecordType/ITApps/Tabs/Contacts")
const Contracts = () => import("@/components/RecordMode/RecordComponents/RecordType/ITApps/Tabs/Contracts")
const Notifications = () => import("@/components/RecordMode/RecordComponents/RecordType/ITApps/Tabs/Notifications")
const Licenses = () => import("@/components/RecordMode/RecordComponents/RecordType/ITApps/Tabs/Licenses")
const Dependencies = () => import("@/components/RecordMode/RecordComponents/RecordType/ITApps/Tabs/Dependencies")
const ITAppsSummary = () => import("@/components/RecordMode/RecordComponents/RecordType/ITApps/ITAppsSummary")

const CompanySummary = () => import("@/components/Companies/CompanySummary")

const Installation = () => import("@/components/RecordMode/RecordComponents/RecordType/ITApps/Installation")
const Rationalization = {
  Attributes: () => import("@/components/RecordMode/RecordComponents/RecordType/ITApps/Rationalization/Attributes"),
  Costs: () => import("@/components/RecordMode/RecordComponents/RecordType/ITApps/Rationalization/Costs"),
  FTE: () => import("@/components/RecordMode/RecordComponents/RecordType/ITApps/Rationalization/FTE"),
  Governance: () => import("@/components/RecordMode/RecordComponents/RecordType/ITApps/Rationalization/Governance"),
  License: () => import("@/components/RecordMode/RecordComponents/RecordType/ITApps/Rationalization/License"),
  Users: () => import("@/components/RecordMode/RecordComponents/RecordType/ITApps/Rationalization/Users")
}

// Dynamic App
const DynamicAppSummary = () => import("@/components/RecordMode/RecordComponents/RecordType/DynamicApp/DynamicAppSummary")
const DynamicAppPosts = () => import("@/components/RecordMode/RecordComponents/RecordType/DynamicApp/RecordPostListPreview.vue")
const PreviewTabsManager = () => import("@/components/RecordMode/RecordComponents/RecordType/DynamicApp/PreviewTabsBuilder.vue")

export default{
  // Home Data
    get_views_list: () => [
      { name: 'Request', iconName: "mdi-map-marker", route: "Hi" },
      { name: 'Tickets', iconName: "mdi-map-marker", route: "Hi" },
      { name: 'Projects', iconName: "mdi-map-marker", route: "Hi" },
      { name: 'Matrix', iconName: "mdi-map-marker", route: "Hi" },
      { name: 'Schedulez', iconName: "mdi-map-marker", route: "Hi" },
      { name: 'Teams', iconName: "mdi-map-marker", route: "Hi" },
      { name: 'By Company', iconName: "mdi-map-marker", route: "Hi" },
      { name: 'Meeting Notes', iconName: "mdi-map-marker", route: "Hi" },
      { name: "request", iconName: "mdi-map-marker", route: "Hi",},
      { name: "request", iconName: "mdi-map-marker", route: "Hi",},
      { name: "request", iconName: "mdi-map-marker", route: "Hi",},
      { name: "request", iconName: "mdi-map-marker", route: "Hi",},
      { name: "request", iconName: "mdi-map-marker", route: "Hi",},
      { name: "request", iconName: "mdi-map-marker", route: "Hi",},
      { name: "request", iconName: "mdi-map-marker", route: "Hi",},
    ],
  // Tabs Data
    get_tabs: () => [
      { tab: 'Request', content: RequestTab },
      { tab: 'Tickets', content: TicketTab },
      { tab: 'Projects', content: RequestTab },
      { tab: 'Matrix', content: RequestTab },
      { tab: 'Schedulez', content: RequestTab },
      { tab: 'Teams', content: RequestTab },
      { tab: 'By Company', content: RequestTab },
      { tab: 'Meeting Notes', content: RequestTab },
    ],
    get_request_table_header: () => [
      { text: 'Name', align: 'start', value: 'name'},
      { text: 'Description', value: 'description' },
      { text: 'Phase', value: 'phase' },
      { text: 'Actions', value: 'actions' }
    ],
    get_ticket_table_header: () => [
      { text: 'Ticket #', align: 'start', value: 'id'},
      { text: 'Project Name', value: 'project_name' },
      { text: 'Summary', value: 'summary' },
      { text: 'Description', value: 'description' },
      { text: 'Component', value: 'component' },
      { text: 'Fix Version', value: 'fix_version' },
      { text: 'Priority', value: 'priority' },
      { text: 'Labels', value: 'labels'},
      { text: 'Linked Issues', value: 'lincked_issues' },
      { text: 'Issues', value: 'isues' },
      { text: 'Affects Versions', value: 'affects_versions' },
      { text: 'Assignee', value: 'assignee' },
      { text: 'Epic Link', value: 'epic_link' },
      { text: 'Story Points', value: 'story_points'},
      { text: 'Ranck Project Issue', value: 'ranck_project_issue' },
      { text: 'Start Date', value: 'start_date' },
      { text: 'Actions', value: 'actions' },
    ],
    records_widgets: {
      itapps: [
        {
          icon: 'mdi-account-voice', 
          name:'ITApps Summary',
          component: ITAppsSummary
        },{
          icon: 'mdi-account-voice', 
          name:'Description',
          component: Description
        },{
          icon: 'mdi-account-voice', 
          name:'Contacts',
          component: Contacts
        },{
          icon: 'mdi-account-voice', 
          name:'Dependencies',
          component: Dependencies
        },{
          icon: 'mdi-account-voice', 
          name:'Notifications',
          component: Notifications
        },{
          icon: 'mdi-account-voice', 
          name:'Licenses',
          component: Licenses
        },{
          icon: 'mdi-account-voice', 
          name:'Contracts',
          component: Contracts
        },{
          icon: 'mdi-briefcase',
          name:'Installation',
          component: Installation
        },{
          icon: 'mdi-format-textbox',   
          name:'Rationalization Costs',
          component: Rationalization.Costs
        },{
          icon: 'mdi-format-textbox',   
          name:'Rationalization License',
          component: Rationalization.License
        },{
          icon: 'mdi-format-textbox',   
          name:'Rationalization FTE',
          component: Rationalization.FTE
        },{
          icon: 'mdi-format-textbox',   
          name:'Rationalization Users',
          component: Rationalization.Users
        },{
          icon: 'mdi-format-textbox',   
          name:'Rationalization Governance',
          component: Rationalization.Governance
        },{
          icon: 'mdi-format-textbox',   
          name:'Rationalization Attributes',
          component: Rationalization.Attributes
        }
      ],
      dynamic_app: [
        {
          icon: 'mdi-format-textbox', 
          name: 'summary',
          component: DynamicAppSummary
        },
        {
          icon:'mdi-account-group',
          name: 'social Network',
          component: DynamicAppPosts
        },
        {
          icon: 'mdi-table-row',
          name: 'Tabs Manager',
          component: PreviewTabsManager
        }
      ],
      project:[
        {
          icon: 'mdi-account-voice', 
          name:'Project Summary',
          component: ProjectSummary
        },{
          icon: 'mdi-account-voice', 
          name:'Request',
          component: RequestTab
        },{
          icon: 'mdi-ticket',   
          name:'Tickets',
          component: TicketTab
        },{
          icon: 'mdi-briefcase',
          name:'Projects',
          component: RequestTab
        },{
          icon: 'mdi-format-textbox',   
          name:'Matrix',
          component: RequestTab
        }
      ],
      rfp:[

      ]
    },
    companies_widgets: {
      company: [
        {
          icon: 'mdi-account-voice', 
          name:'CompanySummary',
          component: CompanySummary
        },{
          icon: 'mdi-account-voice', 
          name:'Description',
          component: Description
        },{
          icon: 'mdi-account-voice', 
          name:'Contacts',
          component: Contacts
        },{
          icon: 'mdi-account-voice', 
          name:'Dependencies',
          component: Dependencies
        },{
          icon: 'mdi-account-voice', 
          name:'Notifications',
          component: Notifications
        },{
          icon: 'mdi-account-voice', 
          name:'Licenses',
          component: Licenses
        },{
          icon: 'mdi-account-voice', 
          name:'Contracts',
          component: Contracts
        },{
          icon: 'mdi-briefcase',
          name:'Installation',
          component: Installation
        },{
          icon: 'mdi-format-textbox',   
          name:'Rationalization Costs',
          component: Rationalization.Costs
        },{
          icon: 'mdi-format-textbox',   
          name:'Rationalization License',
          component: Rationalization.License
        },{
          icon: 'mdi-format-textbox',   
          name:'Rationalization FTE',
          component: Rationalization.FTE
        },{
          icon: 'mdi-format-textbox',   
          name:'Rationalization Users',
          component: Rationalization.Users
        },{
          icon: 'mdi-format-textbox',   
          name:'Rationalization Governance',
          component: Rationalization.Governance
        },{
          icon: 'mdi-format-textbox',   
          name:'Rationalization Attributes',
          component: Rationalization.Attributes
        }
      ],
    },
    get_widgets: [
      {
        icon: 'mdi-format-bold', 
        name:'Schedulez',
        component: RequestTab
      },{
        icon: 'mdi-format-italic',   
        name:'Teams',
        component: RequestTab
      },{
        icon: 'mdi-format-underline',
        name:'By Company',
        component: TicketTab
      },{
        icon: 'mdi-format-italic',   
        name:'Meeting Notes',
        component: TicketTab
      }
    ]
}