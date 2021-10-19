<template>
    <div :class="`flex-col range filter ${isEnabled ? 'enabled' : 'disabled'}`">
        <div class="name" @click="isEnabled = !isEnabled">
            <slot name="title" />
        </div>
        <div @mousedown="isEnabled = true">
            <v-range-slider :value="range" :min="min" :max="max" thumb-label="always" tick-size="1" hide-details="true" @change="update" />
        </div>
    </div>
</template>

<script lang="ts">
import _ from "lodash";
import { Component, Prop, Vue } from "nuxt-property-decorator";

@Component({
    watch: {
        isEnabled: function(this: RangeComponent) {
            this.$emit("input", this.isEnabled ? this.range : undefined);
        }
    }
})
export default class RangeComponent extends Vue {
    @Prop({ type: Array, required: false }) readonly value!: any;
    @Prop({ type: Number, required: true }) readonly min!: number;
    @Prop({ type: Number, required: true }) readonly max!: number;
    @Prop({ type: Boolean, required: false, default: true }) readonly enabled!: boolean;

    range?: [number, number] = this.value ?? [this.min, this.max];
    lastRange: [number, number] = this.value ?? [this.min, this.max];
    isEnabled: boolean = this.enabled;

    update(range: [number, number]) {
        const sameAsLastRange = range[0] === this.lastRange[0] && range[1] === this.lastRange[1];
        const isAtMinMax = range[0] === this.min && range[1] === this.max;

        if (sameAsLastRange) {
            return;
        }

        this.lastRange = _.cloneDeep(range);
        this.range = range;

        if (isAtMinMax) {
            this.$emit("input", undefined);
            return;
        }

        this.$emit("input", range);
    }
}
</script>

<style lang="scss" scoped>

</style>