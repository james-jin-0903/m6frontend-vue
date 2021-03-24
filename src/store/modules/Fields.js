const state = {
  requiredFieldsFilled: {},
  currentTab: 0,
  activeTab: {},
  tabs: [],
  lock: false,
};

const getters = {
  allValid: (state) => {
    return state.requiredFieldsFilled;
  },
  activeTab: (state) => state.activeTab,
  lock: (state) => state.lock,
};

const actions = {
  addRequiredField({ commit, dispatch }, payload) {
    commit("REQUIRED_FIELD", { ...payload });
    dispatch("setLock");
  },
  setActiveTab({ commit, dispatch }, tab) {
    //console.log("Active tab");
    //console.log(tab);
    commit("ACTIVE_TAB", tab);
    dispatch("setLock");
  },
  setLock({ commit, state }) {
    //console.log("set lock");
    const tabID = state.activeTab.id;
    var res = false;
    //console.log(tabID);
    //console.log(state.requiredFieldsFilled);
    //console.log(state.requiredFieldsFilled[tabID]);
    if (tabID && state.requiredFieldsFilled[tabID]) {
      const keys = Object.keys(state.requiredFieldsFilled[tabID]);
      //console.log(keys);
      if (keys.length > 0) {
        const values = Object.values(state.requiredFieldsFilled[tabID]);
        //console.log(values);
        res = values.includes(false);
      }
    }
    commit("LOCK", res);
  },
  storeTabs({ commit, dispatch, state }, tabs) {
    commit("TABS", { tabs });
    if (tabs.length && state.activeTab == {}) {
      dispatch("setActiveTab", tabs[0]);
    }
    dispatch("setLock");
  },
  setCurrentTab({ commit, dispatch }, tab) {
    commit("CURRENT_TAB", { tab });
    dispatch("setLock");
  },
};

const mutations = {
  ACTIVE_TAB(state, tab) {
    state.activeTab = tab;
  },
  CURRENT_TAB(state, { tab }) {
    state.currentTab = tab;
  },
  LOCK(state, lock) {
    state.lock = lock;
    //console.log(lock);
  },
  REQUIRED_FIELD(state, { tab, panelID, valid }) {
    if (!state.requiredFieldsFilled[tab]) {
      state.requiredFieldsFilled[tab] = {};
    }
    state.requiredFieldsFilled[tab][panelID] = valid;
  },
  TABS(state, { tabs }) {
    state.tabs = tabs;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
