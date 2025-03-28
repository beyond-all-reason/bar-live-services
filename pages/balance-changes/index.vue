<template>
    <div>
        <h1 class="page-title">
            Balance Changes
        </h1>

        <div class="balance-changes">
            <div class="full-width flex-row">
                <a class="json-api flex-right" target="_blank" :href="`${$axios.defaults.baseURL}/balance-changes`">
                    <v-icon size="22">mdi-code-braces</v-icon>
                </a>
            </div>

            <v-pagination v-model="filters.page" :length="Math.ceil(totalResults / filters.limit)" :total-visible="10" @input="changePage" />

            <div v-for="(change, index1) in balanceChanges" :key="index1" class="balance-change">
                <div class="meta">
                    <div class="flex-row flex-space-between flex-wrap">
                        <div class="date">
                            {{ $moment(change.date).format("dddd, MMMM Do YYYY") }}
                        </div>
                        <div class="flex-row flex-center">
                            <div class="sha">
                                <a :href="change.url" target="_parent">{{ change.sha.substr(0, 7) }}</a>
                            </div>
                            <a class="author" :href="change.author.url" target="_parent">
                                {{ change.author.name }}
                                <img class="author__avatar" :src="change.author.img">
                            </a>
                        </div>
                    </div>
                    <div>
                        <div v-for="(message, index2) in change.message.split('\n')" :key="index2" class="message">
                            {{ message }}
                        </div>
                    </div>
                </div>
                <div class="changes">
                    <PropertyChange v-for="(change2, index) in change.changes" :key="index" :data="change2.unit" :depth="0" />
                </div>
            </div>

            <v-pagination v-model="filters.page" :length="Math.ceil(totalResults / filters.limit)" :total-visible="10" @input="changePage" />
        </div>
    </div>
</template>

<script lang="ts">
import { DBSchema } from "bar-db/dist/model/db";
import { Component, Vue } from "nuxt-property-decorator";
import { paginationQuerySchema } from "bar-db/dist/model/rest-api/pagination";
import { coerceObjectFactory } from "~/utils/coerce-object";
import { stringifyQuery } from "~/utils/stringify-query";

const coerceObject = coerceObjectFactory(paginationQuerySchema);

@Component({
    head: { title: "BAR - Balance Changes" },
    watch: {
        filters: {
            handler(this: BalanceChangesPage) {
                if (!this.ready) {
                    return;
                }
                this.fetchBalanceChanges();
            },
            deep: true
        }
    }
})
export default class BalanceChangesPage extends Vue {
    totalResults = 10;
    balanceChanges: DBSchema.BalanceChange.Schema[] = [];
    ready = false;
    filters: {
        [key: string]: any;
        page: number;
        limit: number;
    } = {
        page: 1,
        limit: 10
    };

    async fetchBalanceChanges(): Promise<any> {
        const query = stringifyQuery(this.filters);
        this.$router.push({ path: this.$route.path, query: this.filters });

        const { totalResults, page, limit, data } = await this.$axios.$get(`balance-changes${query}`) as any;
        this.totalResults = totalResults;
        this.filters.limit = limit;
        this.balanceChanges = data;
    }

    beforeMount() {
        const obj = coerceObject(this.$route.query);
        Object.assign(this.filters, obj);
    }

    mounted() {
        this.ready = true;
        this.fetchBalanceChanges();
    }

    async changePage(page: number) {
        window.scrollTo(0, 0);
    }
}
</script>

<style lang="scss" scoped>
.balance-changes {
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.balance-change {
    position: relative;
    background: hsla(0,0%,100%,.05);
    width: 100%;
}
.sha {
    margin-right: 10px;
    padding-right: 10px;
    border-right: 1px solid rgba(255, 255, 255, 0.5);;
}
.meta {
    padding: 15px 40px;
    padding-bottom: 18px;
    background: #98989852;
    box-shadow: 0 1px 3px rgb(0 0 0 / 60%);
}
.date {
    font-size: 28px;
    font-weight: 600;
}
.author {
    display: flex;
    flex-direction: row;
    align-items: center;
    &__avatar {
        width: 25px;
        height: 25px;
        border-radius: 100%;
        margin-left: 10px;
    }
}
.message {
    font-size: 13px;
}
.changes {
    padding: 20px 40px;
    & > div:not(:last-child) {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding-bottom: 15px;
        margin-bottom: 15px;
    }
}
a, .v-application a {
    color: #fff;
}
</style>
