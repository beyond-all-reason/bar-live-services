<template>
    <div class="date-filter">
        <div class="label">
            Date <v-icon class="small">mdi-calendar</v-icon>
        </div>
        <div class="input">
            <v-text-field id="txtDate" placeholder="Select Date Range" :value="text" readonly prepend-icon="mdi-calendar" clearable @click:clear="clear" />
            <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" activator="#txtDate">
                <v-date-picker v-model="date" no-title range color="#fff" @input="dispatch">
                    <v-spacer />
                    <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                </v-date-picker>
            </v-menu>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";
import { cloneDeep } from "lodash";

@Component
export default class DateFilterComponent extends Vue {
    @Prop({ type: Array, required: false, default: () => [] }) readonly value!: string[];

    menu: boolean = false;
    date: string[] = [];

    mounted() {
        this.date = cloneDeep(this.value);
    }

    get text() {
        let text = "";

        if (this.date.length === 1) {
            text = this.parseDate(this.date[0]);
        } else if (this.date.length > 1) {
            text = `${this.parseDate(this.date[0])} - ${this.parseDate(this.date[1])}`;
        }

        return text;
    }

    parseDate(date: string) {
        if (!date) { return ""; }

        const [year, month, day] = date.split("-");
        return `${day}/${month}/${year}`;
    }

    dispatch() {
        this.$emit("input", this.date);
    }

    clear() {
        this.date = [];
        this.$emit("input", this.date);
    }
}
</script>

<style lang="scss" scoped>
.date-filter {
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
    height: 34px;
    max-height: 34px;
    padding: 0 7px;
    input {
        color: #fff;
        outline: none;
    }
}
</style>
