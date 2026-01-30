<template>
    <div :class="`text-filter filter ${isEnabled ? 'enabled' : 'disabled'}`">
        <div class="name" @click="isEnabled = !isEnabled">
            Players
            <v-icon class="small">
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
                @change="onChange"
            >
                <template v-slot:item="data">
                    <v-list-item-avatar>
                        <img :src="countryImage(data.item.countryCode)">
                    </v-list-item-avatar>
                    <v-list-item-content>
                        <v-list-item-title v-text="data.item.username"/>
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
        },
        selectedItems(this: PlayerFilter) {
            if (this.allItems.length > 0) {
                const currentFiltered = this.itemsForAutocomplete.filter(item =>
                    !this.selectedItems.includes(item.username)
                );
                this.updateItemsForAutocomplete(currentFiltered);
            }
        }
    }
})
export default class PlayerFilter extends Vue {
    @Prop({ type: Array, required: false, default: () => [] }) readonly value!: string[];
    @Prop({ type: Boolean, required: false, default: true }) readonly enabled!: boolean;

    allItems: User[] = [];
    itemsForAutocomplete: User[] = [];
    selectedItems: string[] = [];
    isEnabled: boolean = this.enabled;
    isSearching: boolean = false;

    private flagCache: { [code: string]: string } = {};

    private filterItemsDebounced = _.debounce(this.filterItems, 250);

    private filterItems(searchText: string) {
        this.isSearching = false;
        if (this.allItems.length === 0) {
            return;
        }

        let filteredItems: User[];
        if (!searchText || searchText.trim().length === 0) {
            filteredItems = this.allItems.slice(0, 50); // Show the first 50 items when no search
        } else {
            const search = searchText.toLowerCase().trim();
            const matchingItems = this.allItems.filter((item) => {
                return item.username.toLowerCase().includes(search);
            });

            matchingItems.sort((a, b) => {
                const aName = a.username.toLowerCase();
                const bName = b.username.toLowerCase();

                if (aName === search) {
                    return -1;
                }
                if (bName === search) {
                    return 1;
                }

                const isPrefixOfA = aName.startsWith(search);
                const isPrefixOfB = bName.startsWith(search);

                if (isPrefixOfA !== isPrefixOfB) {
                    return isPrefixOfA ? -1 : 1;
                }

                return aName.localeCompare(bName);
            });

            filteredItems = matchingItems.slice(0, 50); // Limit to 50 results for performance
        }

        this.updateItemsForAutocomplete(filteredItems);
    }

    private updateItemsForAutocomplete(filteredItems: User[]) {
        const selectedUsers = this.allItems.filter(user =>
            this.selectedItems.includes(user.username)
        );

        const selectedUsernames = new Set(selectedUsers.map(user => user.username));

        const combinedItems = [...selectedUsers];
        filteredItems.forEach((item) => {
            if (!selectedUsernames.has(item.username)) {
                combinedItems.push(item);
            }
        });

        this.itemsForAutocomplete = combinedItems;
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
        const initialItems = players.slice(0, 50);
        this.updateItemsForAutocomplete(initialItems);
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

    onChange() {
        (this.$refs.vAutocomplete as any).isMenuActive = false;
        this.$emit("input", this.selectedItems?.length ? this.selectedItems : undefined);
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
