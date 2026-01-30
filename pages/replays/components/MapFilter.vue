<template>
    <div :class="`text-filter filter ${isEnabled ? 'enabled' : 'disabled'}`">
        <div class="label" @click="isEnabled = !isEnabled">
            Maps <v-icon class="small">mdi-image-filter-hdr</v-icon>
        </div>
        <div class="input" @click="isEnabled = true">
            <v-autocomplete ref="vAutocomplete" v-model="selectedItems" :items="items" item-text="scriptName" item-value="scriptName" auto-select-firstchips
                clearable deletable-chips multiple dense small-chips @change="onChange">
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

@Component({
    fetchOnServer: false,
    watch: {
        isEnabled: function(this: MapFilterComponent) {
            this.$emit("input", this.isEnabled ? this.selectedItems : undefined);
        }
    }
})
export default class MapFilterComponent extends Vue {
    @Prop({ type: Array, required: false, default: () => [] }) readonly value!: string[];
    @Prop({ type: Boolean, required: false, default: true }) readonly enabled!: boolean;

    items: any[] = [];
    selectedItems: string[] = [];
    isEnabled: boolean = this.enabled;

    beforeMount() {
        this.selectedItems = _.clone(this.value);
    }

    async fetch() {
        const players = await this.$axios.$get("cached-maps") as Array<{ id: number, scriptName: string }>;
        this.items = players;
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
