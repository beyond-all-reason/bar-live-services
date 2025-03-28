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
                :items="items"
                item-text="username"
                item-value="username"
                auto-select-firstchips
                clearable
                deletable-chips
                multiple
                dense
                small-chips
                :search-input.sync="search"
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
        },
        search(this: PlayerFilter) {
            if (this.search) {
                this.searchedUsers = this.binarySearch(this.items, this.search);
            } else {
                this.searchedUsers = [];
            }
        }
    }
})
export default class PlayerFilter extends Vue {
    @Prop({ type: Array, required: false, default: () => [] }) readonly value!: string[];
    @Prop({ type: Boolean, required: false, default: true }) readonly enabled!: boolean;

    items: User[] = [];
    searchedUsers: User[] = [];
    selectedItems: string[] = [];
    isEnabled: boolean = this.enabled;
    search: string | null = null;

    beforeMount() {
        this.selectedItems = _.clone(this.value);
    }

    async fetch() {
        const players = await this.$axios.$get("cached-users") as Array<User>;
        this.items = players;
    }

    countryImage(countryCode: string) {
        try {
            return require(`~/node_modules/flag-icon-css/flags/4x3/${countryCode.toLowerCase()}.svg`);
        } catch (err) {
            return "";
        }
    }

    clear() {
        (this.$refs.vAutocomplete as any).lazySearch = ""; // temp fix for last text not clearing, fixed in latest vuetify
        this.$emit("input", this.selectedItems);
    }

    binarySearch(arr: User[], target: string): User[] {
        let left = 0;
        let right = arr.length - 1;
        const result: User[] = [];
        while (left <= right) {
            const mid = left + Math.floor((right - left) / 2);
            if (arr[mid].username === target) {
                result.push(arr[mid]);
                let i = mid - 1;
                while (i >= 0 && arr[i].username === target) {
                    result.push(arr[i]);
                    i--;
                }
                i = mid + 1;
                while (i < arr.length && arr[i].username === target) {
                    result.push(arr[i]);
                    i++;
                }
                break;
            } else if (arr[mid].username < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return result;
    }
}
</script>

<style lang="scss" scoped>
.text-filter {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
    border: solid 1px #4a4a4a;
}
.label {
    background: rgba(255, 255, 255, 0.05);
    text-align: center;
    padding: 2px 7px;
    border-bottom: solid 1px #4a4a4a;
}
.input {
    padding: 0 7px;
    input {
        color: #fff;
        outline: none;
    }
}
</style>
