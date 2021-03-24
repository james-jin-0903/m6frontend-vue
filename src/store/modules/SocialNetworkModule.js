import MockData from "../MockData";
import axios from "axios";

export default{
    namespaced: true,
    state: {
        posts_data: [],
        filter_data: [],
        companies_data: []
    },
    getters: {
        get_posts_data: (state) => () => state.posts_data,
        get_filter_data: (state) => () => state.filter_data
    },
    mutations: {
        set_posts_info_data(state, data){
            state.posts_data = data;
            state.filter_data = data;
        },
        set_filter_data(state, data){
            state.filter_data = data;
        },
        set_companies_info_data(state, data){
            state.companies_data = data;
        },
    },
    actions: {
        get_url_description({}, data){
            return new Promise(async resolve => {
                const res = await axios.post(`${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/get_url_data`, {
                    ...data
                });
                resolve(res['data']['description'] ? res['data']['description'] : '');
            });
        },
        set_posts_data({commit}){
            let data = MockData.fake_posts;
            commit('set_posts_info_data', data);
        },
        filter_posts(context, [filter, value]){
            let data = [];
            switch (filter) {
                case "author":
                    data = context.getters.get_posts_data().filter(post => post.author === value);
                    break;
                case "company":
                    data = context.getters.get_posts_data().filter(post => post.company === value);
                    break;
                case "teams":
                    data = context.getters.get_posts_data().filter(post => post.teams === value);
                    break;
                default:
                    data = context.getters.get_posts_data()
            }
            context.commit("set_filter_data", data)
        },
        set_companies_data({commit}){
            let data = MockData.fake_companies;
            commit('set_companies_info_data', data);
        },
    }
}