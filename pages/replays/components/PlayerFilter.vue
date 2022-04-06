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

    items: any[] = [];
    selectedItems: string[] = [];
    isEnabled: boolean = this.enabled;

    beforeMount() {
        this.selectedItems = _.clone(this.value);
    }

    async fetch() {
        const players = await this.$axios.$get("cached-users") as Array<{ id: number, username: string, countryCode: string }>;
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
