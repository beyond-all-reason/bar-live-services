<template>
    <div :class="`text-filter filter ${isEnabled ? 'enabled' : 'disabled'}`">
        <div class="name" @click="isEnabled = !isEnabled">
            Players <v-icon class="small">
            mdi-account-group
        </v-icon>
        </div>
        <div class="input" @click="isEnabled = true">
            <v-autocomplete
                ref="vAutocomplete"
                v-model="selectedItems"
                :items="itemsForAutocomplete"
                item-text="username"
                item-value="username"
                auto-select-firstchips
                clearable
                deletable-chips
                multiple
                dense
                small-chips
                :no-data-text="isSearching ? 'Searching...' : 'No players found'"
                @update:search-input="onSearchInput"
                @change="clear"
            >
                <template v-slot:item="data">
                    <v-list-item-avatar>
                        <img :src="countryImage(data.item.countryCode)">
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title v-text="data.item.username" />
                    </v-list-item-content>
                </template>
            </v-autocomplete>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";
import _ from "lodash";

type User = { id: number, username: string, countryCode: string };

@Component({
    fetchOnServer: false,
    watch: {
        isEnabled(this: PlayerFilter) {
            this.$emit("input", this.isEnabled ? this.selectedItems : undefined);
        }
    }
})
export default class PlayerFilter extends Vue {
    @Prop({ type: Array, required: false, default: () => [] }) readonly value!: string[];
    @Prop({ type: Boolean, required: false, default: true }) readonly enabled!: boolean;

    allItems: User[] = [];
    filteredItems: User[] = [];
    selectedItems: string[] = [];
    isEnabled: boolean = this.enabled;
    isSearching: boolean = false;

    private flagCache: { [code: string]: string } = {};

    private filterItemsDebounced = _.debounce(this.filterItems, 250);

    // Computed property that ensures selected items are always available for chips
    get itemsForAutocomplete(): User[] {
        if (this.allItems.length === 0) {
            return [];
        }

        // Get selected users from allItems
        const selectedUsers = this.allItems.filter(user =>
            this.selectedItems.includes(user.username)
        );

        // Create a Set of selected usernames for faster lookup
        const selectedUsernames = new Set(selectedUsers.map(user => user.username));

        // Combine selected users with filtered items, avoiding duplicates
        const combinedItems = [...selectedUsers];
        this.filteredItems.forEach(item => {
            if (!selectedUsernames.has(item.username)) {
                combinedItems.push(item);
            }
        });

        return combinedItems;
    }

    private filterItems(searchText: string) {
        this.isSearching = false;
        // Don't search if data hasn't loaded yet
        if (this.allItems.length === 0) {
            return;
        }

        if (!searchText || searchText.trim().length === 0) {
            this.filteredItems = this.allItems.slice(0, 50); // Show first 50 items when no search
        } else {
            const search = searchText.toLowerCase().trim();
            const matchingItems = this.allItems.filter((item) => {
                return item.username.toLowerCase().includes(search);
            });
            this.filteredItems = matchingItems.slice(0, 50); // Limit to 50 results for performance
        }
    }

    onSearchInput(val: string) {
        this.isSearching = true;
        this.filterItemsDebounced(val || "");
    }

    beforeMount() {
        this.selectedItems = _.clone(this.value);
    }

    async fetch() {
        const players = await this.$axios.$get("cached-users") as Array<User>;
        this.allItems = players;
        this.filteredItems = players.slice(0, 50); // Initialize with first 50 items
    }

    countryImage(countryCode: string) {
        if (!countryCode) {
            return "";
        }
        const key = countryCode.toLowerCase();
        const cached = this.flagCache[key];
        if (cached !== undefined) {
            return cached;
        }
        try {
            const src = require(`~/node_modules/flag-icon-css/flags/4x3/${key}.svg`);
            this.flagCache[key] = src;
            return src;
        } catch (err) {
            this.flagCache[key] = "";
            return "";
        }
    }

    clear() {
        (this.$refs.vAutocomplete as any).lazySearch = ""; // temp fix for last text not clearing, fixed in latest vuetify
        this.$emit("input", this.selectedItems);
    }
}
</script>

<style lang="scss" scoped>
.text-filter {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
    border: solid 1px #4a4a4a;
}
.input {
    padding: 0 7px;
    input {
        color: #fff;
        outline: none;
    }
}
</style>
