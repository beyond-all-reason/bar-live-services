<template>
    <div class="date-filter">
        <div class="label">
            Date
        </div>
        <div class="input">
            <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px" min-width="auto">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field :value="text" readonly label="Date" prepend-icon="mdi-calendar" v-bind="attrs" v-on="on" clearable @click:clear="date = []"></v-text-field>
                </template>
                <v-date-picker v-model="date" no-title range color="#fff">
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                </v-date-picker>
            </v-menu>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";

@Component
export default class DateFilterComponent extends Vue {
    menu: boolean = false;
    date: string[] = [];

    get text() {
        if (this.date.length === 0) {
            return "";
        } else if (this.date.length === 1) {
            return this.parseDate(this.date[0]);
        }
        return `${this.parseDate(this.date[0])} - ${this.parseDate(this.date[1])}`;
    }

    parseDate (date: string) {
        if (!date) return "";

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
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