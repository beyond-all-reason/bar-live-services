<template>
    <div class="selection">
        <div class="name">
            <slot name="title" />
        </div>
        <div class="options">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";
import { cloneDeep } from "lodash";

@Component
export default class OptionsComponent extends Vue {
    @Prop({ required: false, default: () => [] }) readonly value!: any;
    @Prop({ type: Boolean, required: false, default: false }) readonly multiple!: boolean;
    @Prop({ type: Boolean, required: false, default: false }) readonly required!: boolean;

    selectedValue: any;

    beforeMount() {
        this.selectedValue = cloneDeep(this.value);

        if (this.multiple && this.required && this.selectedValue.length === 0) {
            throw new Error("Multiple option picker is required but has no value");
        }

        this.$on("optionSelected", (value: any) => {
            if (this.multiple) {
                if (this.selectedValue.includes(value)) {
                    if (!this.required || (this.required && this.selectedValue.length > 1)) {
                        this.selectedValue = this.selectedValue.filter((val: any) => val !== value);
                        this.selectedValue.sort();
                    }
                } else {
                    this.selectedValue = [...this.selectedValue, value];
                    this.selectedValue.sort();
                }
            } else {
                this.selectedValue = value;
            }

            this.$emit("input", this.selectedValue);
        });
    }
}
</script>

<style lang="scss" scoped>
.selection {
    display: inline-flex;
    flex-direction: column;
    border: 1px solid #4a4a4a;
    border-radius: 3px;
    user-select: none;
    background: rgba(255, 255, 255, 0.05);
}
.name {
    text-align: center;
    padding: 2px 7px;
    background: rgba(255, 255, 255, 0.05);
    border-bottom: solid 1px #4a4a4a;
}
.options {
    display: flex;
    flex-direction: row;
}
</style>
