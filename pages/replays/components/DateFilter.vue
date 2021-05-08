<template>
    <div class="date-filter">
        <div class="label">
            Date
        </div>
        <div class="input">
            <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
            >
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        placeholder="Select Date Range"
                        :value="text"
                        readonly
                        prepend-icon="mdi-calendar"
                        v-bind="attrs"
                        clearable
                        v-on="on"
                        @click:clear="clear"
                    />
                </template>
                <v-date-picker v-model="date" no-title range color="#fff" @input="dispatch">
                    <v-spacer />
                    <v-btn text color="primary" @click="menu = false">
                        Cancel
                    </v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(date)">
                        OK
                    </v-btn>
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
    @Prop({ type: Array, required: true }) readonly value!: string[];

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

        // const dateBlockEl = this.$refs.txtDate as Vue;
        // if (dateBlockEl) {
        //     const el = dateBlockEl.$el.querySelector("input[type=text]") as HTMLElement;
        //     if (el) {
        //         if (this.date.length === 0) {
        //             el.style.width = "50px";
        //         } else if (this.date.length === 1) {
        //             el.style.width = "100px";
        //         } else if (this.date.length === 2) {
        //             el.style.width = "150px";
        //         }
        //     }
        // }

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
