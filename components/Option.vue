<template>
    <div :class="`option ${isSelected() ? 'selected' : ''}`" :style="`--bgColor: ${bgColor}; --textColor: ${textColor}`" @click="optionSelected">
        <slot />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";
import OptionsComponent from "~/components/Options.vue";

@Component
export default class OptionComponent extends Vue {
    @Prop({ required: true }) readonly value!: any;
    @Prop({ type: String, required: false, default: "#eee" }) readonly bgColor!: string;
    @Prop({ type: String, required: false, default: "#000" }) readonly textColor!: string;

    optionSelected() {
        this.$parent?.$emit("optionSelected", this.value);
    }

    isSelected() : boolean {
        const currentValue = (this.$parent as OptionsComponent).selectedValue;
        return (this.value === currentValue || (Array.isArray(currentValue) && currentValue.includes(this.value)));
    }
}
</script>

<style lang="scss" scoped>
.option {
    width: 100%;
    padding: 5px 8px;
    display: flex;
    justify-content: center;
    cursor: pointer;
    font-weight: 500;
    &.selected {
        background: var(--bgColor);
        color: var(--textColor);
        & > i.v-icon {
            color: var(--textColor) !important;
            caret-color: #000 !important;
        }
        .v-icon {
            color: #000 !important;
            caret-color: #000 !important;
        }
    }
    &:not(:last-child) {
        border-right: solid 1px #4a4a4a;
    }
    &:first-child {
        border-bottom-left-radius: 2px;
    }
    &:last-child {
        border-bottom-right-radius: 2px;
    }
}
 .v-icon {
    transition: none !important;
}
</style>
