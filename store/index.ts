import { ActionTree, GetterTree, MutationTree } from "vuex";

export const state = () => ({
    pageTitle: "unset"
});

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
    pageTitle: state => state.pageTitle
};

export const mutations: MutationTree<RootState> = {
    setPageTitle: (state, pageTitle: string) => (state.pageTitle = pageTitle)
};

export const actions: ActionTree<RootState, RootState> = {
    // async fetchThings({ commit }) {
    //     const things = await this.$axios.$get('/things')
    //     console.log(things)
    //     commit('CHANGE_NAME', 'New name')
    // },
};
