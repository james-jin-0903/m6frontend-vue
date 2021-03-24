export default {
  namespaced: true,
  state: {
    previewNavigationDrawer: false,
    info_data: {
      name: "",
      imageUrl: "",
      email: "",
      contactPhone: ""
    }
  },
  getters: {
    get_preview_navigation_drawer: (state) => () =>
      state.previewNavigationDrawer
  },
  mutations: {
    setPreviewNavigationDrawer(state, drawer_state) {
      state.previewNavigationDrawer = drawer_state;
    },
    setNewInfoData(state, newData) {
      state.info_data = newData;
    }
  },
  actions: {
    change_preview_navigation_drawer({ commit }, drawer_state) {
      commit("setPreviewNavigationDrawer", drawer_state);
    },
    set_info_data({ commit }, data) {
      commit("setNewInfoData", data);
    }
  }
};
