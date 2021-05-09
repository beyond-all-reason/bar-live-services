<template>
    <div class="text-filter">
        <div class="label">
            Maps <v-icon class="small">mdi-image-filter-hdr</v-icon>
        </div>
        <div class="input">
            <v-autocomplete
                ref="vAutocomplete"
                v-model="selectedItems"
                :items="items"
                item-text="scriptName"
                item-value="scriptName"
                auto-select-firstchips
                clearable
                deletable-chips
                multiple
                dense
                small-chips
                @change="clear"
            >
                <template v-slot:item="data">
                    <v-list-item-content>
                        <v-list-item-title v-text="data.item.scriptName" />
                    </v-list-item-content>
                </template>
            </v-autocomplete>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";
import _ from "lodash";

@Component({ fetchOnServer: false })
export default class MapFilterComponent extends Vue {
    @Prop({ type: Array, required: true }) readonly value!: string[];

    items: any[] = [];
    selectedItems: string[] = [];

    beforeMount() {
        this.selectedItems = _.clone(this.value);
    }

    async fetch() {
        const players = await this.$http.$get("cached-maps") as Array<{ id: number, scriptName: string }>;
        this.items = players;
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
