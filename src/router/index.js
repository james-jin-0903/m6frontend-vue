import Vue from "vue";
import VueRouter from "vue-router";

const Home = () => import(/* webpackChunkName: 'Home' */ "@/views/Home");
const Tabs = () => import( /* webpackChunkName: 'Tabs' */ "@/views/Tabs");
const CompanyProfile = () => import( /* webpackChunkName: 'SignUp' */ "@/components/Profile");
const SignUp = () => import(/* webpackChunkName: 'SignUp' */ "@/views/Auth/SignUp");
const SignIn = () => import(/* webpackChunkName: 'SignIn' */ "@/views/Auth/SignIn");
const ForgotPassword = () => import(/* webpackChunkName: 'ForgotPassword' */ "@/views/Auth/ForgotPassword");
const ResetPassword = () => import(/* webpackChunkName: 'ResetPassword' */ "@/views/Auth/ResetPassword");
const UserSettings = () => import(/* webpackChunkName: 'UserSettings' */ "@/views/User/UserSettings")

const Companies = () => import(/* webpackChunkName: 'Companies' */ '@/components/Companies')
const Marketplace = () => import(/* webpackChunkName: 'Marketplace' */ '@/components/Marketplace')
const MarketplaceTest = () => import(/* webpackChunkName: 'Marketplace' */ '@/components/Marketplace/Test')
const Apps = () => import(/* webpackChunkName: 'Apps' */ '@/components/Apps')
const AppsBuilderList = () => import(/* webpackChunkName: 'Apps' */ '@/components/Apps/AppBuilder')
const CPM = () => import(/* webpackChunkName: 'Store' */ '@/components/CPM')
const RFPIndex = () => import(/* webpackChunkName: 'RFP' */ '@/modules/rfp/RFPIndex')
const Projects = () => import(/* webpackChunkName: 'Store' */ '@/views/Projects/index')
const ProjectPanel = () => import(/* webpackChunkName: 'Store' */ '@/views/ProjectPanel/index')
const Dev = () => import(/* webpackChunkName: 'Store' */ '@/views/Home/CreateCompanyPanel')
const AppBuilderShowBlank = () => import(/* webpackChunkName: "AppBuilderShow" */ '@/views/Home/AppBuilderShowBlank.vue')
const ImportTool = () => import(/* webpackChunkName: 'Store' */ '@/views/Import')
const CloneTool = () => import(/* webpackChunkName: 'Store' */ '@/views/Tools/CloneTool')
const RapidTable = () => import(/* webpackChunkName: 'RapidTable' */ '@/views/Rapid/RapidTable')
const ActionsTable = () => import(/* webpackChunkName: 'ActionsTable' */ '@/views/ActionCenter/ActionsTable')
const MarketPlaceAdmin = () => import(/* webpackChunkName: 'MarketPlaceAdmin' */ '@/views/Marketplace/Admin')
const Calendar = () => import(/* webpackChunkName: 'MarketPlaceAdmin' */ '@/views/Home/Calendar')
const MasterBuilder = () => import(/* webpackChunkName: "MasterBuilder" */ '@/views/Builder/MasterBuilder')

const Messenger = () => import(/* webpackChunkName: "Messenger" */ '@/views/Messenger/Messenger')
const ProfileSetting = () => import(/* webpackChunkName: "ProfileSetting" */ '@/views/User/ProfileSetting')

const VideoCallWindow = () => import(/* webpackChunkName: "VideoCallWindow" */ '@/components/Home/M6Chat/VideoCallWindow')

const UserProfileDetails = () => import(/* webpackChunkName: "UserProfileDetails" */ '@/views/User/UserProfileDetails')

import store from '../store/';
Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/rfp",
      name: "rfp",
      component: RFPIndex,
    },
    {
      path: "/company/:id",
      name: "company_profile",
      component: CompanyProfile,
    },
    {
      path: "/tabs",
      name: "tabs",
      component: Tabs
    },
    {
      path: "/signup",
      name: "auth.SignUp",
      component: SignUp,
      meta: {
        public: true
      }
    },
    {
      path: '/signin',
      name: "auth.SignIn",
      component: SignIn,
      meta: {
        public: true
      }
    },
    {
      path: '/forgotPassword',
      name: 'auth.ForgotPassword',
      component: ForgotPassword,
      meta: {
        public: true
      }
    },
    {
      path: '/ResetPassword',
      name: 'auth.ResetPassword',
      component: ResetPassword,
      meta: {
        public: true
      }
    },
    {
      path: "/records",
      name: "records",
      component: Apps,
      meta: {
        public: false,
        page: 'records'
      }
    },
    {
      path: "/companies",
      name: "companies",
      component: Companies
    },
    {
      path: "/store",
      name: "marketplace-home",
      component: Marketplace
    },
    {
      path: "/store/app/:id/:section?",
      name: "marketplace-app",
      component: Marketplace,
      meta: {
        page: 'app'
      }
    },
    {
      path: "/store/cart",
      name: "marketplace-cart",
      component: Marketplace,
      meta: {
        page: 'cart'
      }
    },
    {
      path: "/store/test",
      name: "marketplace-test",
      component: MarketplaceTest
    },
    {
      path: "/calendar",
      name: "Calendar",
      component: Calendar,
      meta: {
        public: false,
        topNav: true
      }
    },
    {
      path: "/user/settings",
      name: "user.settings",
      component: UserSettings
    },
    {
      path: "/people/:profileID",
      name: "people.profile",
      component: ProfileSetting
    },
    {
      path: "/dev/:id",
      name: "dev",
      component: MasterBuilder,
      meta: {
        public: true,
        topNav: true
      }
    },
    {
      path: "/cpm/:id",
      name: "cpm",
      component: CPM,
    },
    {
      path: "/app/cpm",
      name: "app.cpm",
      component: Projects,
    },
    {
      path: "/app/cpm/:id",
      name: "app.cpm.project",
      component: ProjectPanel,
    },
    {
      path: "/cpm/import/tool",
      name: "cpm.import",
      component: ImportTool
    },
    {
      path: "/record/:id",
      name: "record.show",
      component: AppBuilderShowBlank
    },
    {
      path: "/apps/tools/cpm/clone",
      name: "tools.cpm.clone",
      component: CloneTool
    },
    {
      path: "/rapid/table",
      name: "rapid.index",
      component: RapidTable
    },
    {
      path: "/action-center",
      name: "actioncenter.index",
      component: ActionsTable
    },
    {
      path: "/marketplace/admin",
      name: "marketplace.admin",
      component: MarketPlaceAdmin
    },
    {
      path: "/messenger",
      name: "messenger",
      component: Messenger,
      meta: {
        public: false,
        topNav: true
      }
    },
    {
      path: "/video-call/:channel",
      name: "video-call",
      component: VideoCallWindow,
      meta: {
        rawTemplate: true
      }
    },
    {
      path: "/profile/:id",
      name: "user_profile_details",
      component: UserProfileDetails,
    }
  ],
});

Vue.config.devtools = true;

router.beforeEach(async (to, from, next) => {
  // Check if we have session in sessionStorage
  await store.dispatch('Auth/searchForToken')

  let loggedIn = store.getters["Auth/loggedIn"]
  if(loggedIn){
    let user = store.getters["Auth/getUser"]
    if(!user.id) {
      const { data: userLogged } = await store.dispatch('Auth/getUserData')
      // Start GSChat
      if(typeof userLogged.user == 'undefined'){
        userLogged.user = userLogged
      }
      await store.dispatch('GSChat/getGSToken', userLogged.user)
      const user = {
        id: userLogged.user.id,
        name: `${userLogged.user.firstName} ${userLogged.user.lastName}`,
        image: userLogged.user.avatar
      }
      await store.dispatch('GSChat/setUser', user)
      await store.dispatch('GSChat/retrieveChats', userLogged.user.id)

      // Start GSFeed
      await store.dispatch('GSFeed/getGSFeedToken', userLogged.user)
      await store.dispatch('GSFeed/setUser', user)
      await store.dispatch('GSFeed/setCompanyFeed', userLogged.user.id)
    }
  }

  // Verify if route is public
  if (to.meta.public) {
    // Is public Route
    if ( loggedIn ) {
      // Authenticated User on public route
      if( to.name.split('.')[0] === 'auth' ) {
        next({ name: 'home' })
      } else {
        next()
      }
    } else {
      // Anonymous User on public route
      next()
    }
  } else {
    // Check always if im logged in
    try {      

      if( loggedIn ) {
        next()
      } else {
        next({ name: 'auth.SignIn' })
      }

    } catch (e) {
      next({ name: 'auth.SignIn' })
      console.error(e)
    }
  }
})


const handleGS = async (userLogged, n = 1) => {
    try {
      await store.dispatch('GSChat/getGSToken', userLogged.user)
      const user = {
        id: userLogged.user.id,
        name: `${userLogged.user.firstName} ${userLogged.user.lastName}`,
        image: userLogged.user.avatar
      }
      await store.dispatch('GSChat/setUser', user)
      await store.dispatch('GSChat/retrieveChats', userLogged.user.id)

      // Start GSFeed
      await store.dispatch('GSFeed/getGSFeedToken', userLogged.user)
      await store.dispatch('GSFeed/setUser', user)
      return true
    } catch(err) {
        if (n === 1) throw err;
        return await handleGS(userLogged, n - 1);
    }
}

export default router;