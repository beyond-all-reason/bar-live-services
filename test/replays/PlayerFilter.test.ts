import { mount, createLocalVue } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vue from "vue";
// @ts-ignore
import PlayerFilter from "@/pages/replays/components/PlayerFilter.vue";

Vue.use(Vuetify);

const localVue = createLocalVue();

describe("PlayerFilter.vue", () => {
    let vuetify: Vuetify;

    beforeEach(() => {
        vuetify = new Vuetify();
    });

    const mockPlayers = [
        { id: 1, username: "alice" },
        { id: 2, username: "Alix" },
        { id: 3, username: "bob" },
        { id: 4, username: "bobby" },
        { id: 5, username: "carol" },
        { id: 6, username: "ally" },
        { id: 7, username: "xalicex" },
        { id: 8, username: "  spaced  " } // included to show trim is on search text, not usernames
    ];

    const factory = (propsData = {}, mocks = {}) => {
        return mount(PlayerFilter, {
            localVue,
            vuetify,
            propsData: {
                ...propsData
            },
            mocks: {
                $axios: {
                    $get: jest.fn().mockResolvedValue(mockPlayers)
                },
                ...mocks
            },
            stubs: {
                "v-autocomplete": true,
                "v-icon": true,
                "v-list-item-avatar": true,
                "v-list-item-content": true,
                "v-list-item-title": true
            }
        });
    };

    it("should initialize with default props", () => {
        const wrapper = factory();
        expect(wrapper.props().value).toEqual([]);
        expect(wrapper.props().enabled).toBe(true);
    });

    it("should toggle isEnabled when clicking on the name", async() => {
        const wrapper = factory();
        const nameDiv = wrapper.find(".name");

        expect(wrapper.vm.$data.isEnabled).toBe(true);
        await nameDiv.trigger("click");
        expect(wrapper.vm.$data.isEnabled).toBe(false);
        await nameDiv.trigger("click");
        expect(wrapper.vm.$data.isEnabled).toBe(true);
    });

    it("should fetch players on fetch call", async() => {
        const wrapper = factory();
        const vm = wrapper.vm as any;

        await vm.$options.fetch.call(vm);

        expect(vm.allItems).toEqual(mockPlayers);
        expect(vm.itemsForAutocomplete).toHaveLength(mockPlayers.length);
    });

    it("should emit input event when isEnabled changes", async() => {
        const wrapper = factory();
        const vm = wrapper.vm as any;

        vm.isEnabled = false;
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted().input).toBeTruthy();
        expect(wrapper.emitted().input![0]).toEqual([undefined]);

        vm.isEnabled = true;
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted().input![1]).toEqual([[]]);
    });

    it("should filter items based on search text", async() => {
        const wrapper = factory();
        const vm = wrapper.vm as any;
        vm.allItems = mockPlayers;

        // Directly call filterItems to avoid debounce in this test or use jest.useFakeTimers()
        vm.filterItems("al");

        expect(vm.itemsForAutocomplete.map((i: any) => i.username)).toEqual<Array<string>>(["alice", "Alix", "ally", "xalicex"]);
    });

    it("should handle countryImage with dynamic require mock", () => {
        const wrapper = factory();
        const vm = wrapper.vm as any;

        const img = vm.countryImage("us");
        expect(typeof img).toBe("string");
    });

    it("should clear search input and emit change on clear", async() => {
        const wrapper = factory();
        const vm = wrapper.vm as any;

        // Mock the ref
        vm.$refs.vAutocomplete = { lazySearch: "some text" };

        vm.clear();

        expect(vm.$refs.vAutocomplete.lazySearch).toBe("");
        expect(wrapper.emitted().input).toBeTruthy();
    });

    it("should have exact match first", async() => {
        const wrapper = factory();
        const vm = wrapper.vm as any;

        vm.allItems = mockPlayers;
        // Should include only usernames containing "alice", with exact match first
        vm.filterItems("alice");
        // Remaining results should be ordered: prefix vs infix then lexicographic
        expect(vm.itemsForAutocomplete.map((i: any) => i.username)).toEqual<Array<string>>(["alice", "xalicex"]);
    });

    it("should do case-insensitive search and trim search whitespace", async() => {
        const wrapper = factory();
        const vm = wrapper.vm as any;

        vm.allItems = mockPlayers;
        vm.filterItems(" AL ");
        // Same as searching for 'al'
        expect(vm.itemsForAutocomplete.map((i: any) => i.username)).toEqual<Array<string>>(["alice", "Alix", "ally", "xalicex"]);
    });

    it("should preserve lexicographic order within same class (no exact, both prefixes)", async() => {
        const wrapper = factory();
        const vm = wrapper.vm as any;

        vm.allItems = mockPlayers;
        vm.filterItems("bo");
        // Prefixes: bob, bobby -> compare lower case names lexicographically
        expect(vm.itemsForAutocomplete.map((i: any) => i.username)).toEqual<Array<string>>(["bob", "bobby"]);
    });

    it("should preserve duplicates and remain stable within same username", async() => {
        const wrapper = factory();
        const vm = wrapper.vm as any;

        // Extend the base fixture with a duplicate username 'bob' (different id)
        vm.allItems = [...mockPlayers, {id: 9, username: "bob"}];
        vm.filterItems("bo");
        // Expect: both "bob" entries (prefix matches) come before "bobby", and
        // among identical usernames the original relative order is preserved (stable sort).
        expect(vm.itemsForAutocomplete.map((i: any) => i.username)).toEqual<Array<string>>(["bob", "bob", "bobby"]);

        // Additionally verify stability for identical usernames by checking ids order
        expect(vm.itemsForAutocomplete.map((i: any) => i.id)).toEqual<Array<Number>>([3, 9, 4]);
    });
});
