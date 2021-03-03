import { ActionTree, GetterTree, MutationTree } from "vuex";

export const state = () => ({
    embedded: true
});

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
    isEmbedded: state => state.embedded
};

export const mutations: MutationTree<RootState> = {
    setEmbedded: (state, isEmbedded: boolean) => state.embedded = isEmbedded
};

export const actions: ActionTree<RootState, RootState> = {

};
