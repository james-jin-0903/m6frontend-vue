export default{
    namespaced: true,
    state: {
        hidden1: false,
        hidden2: false
    },
    getters: {
        getHiddenState1: (state) => () => state.hidden1,
        getHiddenState2: (state) => () => state.hidden2
    },
    mutations: {
        hiddenActiveRecord(state, index){
            index == 0 ? state.hidden1 = true : state.hidden2 = true;
        },
    },
    actions: {
        hiddenRecord({commit}, index){
            commit("hiddenActiveRecord", index);
        },
    }
}