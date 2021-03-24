import Data from "../data";

export default{
    namespaced: true,
    state: {
        request_table_header: Data.get_request_table_header(),
        ticket_table_header: Data.get_ticket_table_header(),
    },
    getters: {
        get_request_table_header: (state) => () => state.request_table_header,
        get_ticket_table_header: (state) => () => state.ticket_table_header,
    },
    mutations: {
    },
    actions: {
    }
}