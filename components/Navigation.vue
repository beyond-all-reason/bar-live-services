<template>
    <div class="nav">
        <nav class="links" role="navigation">
            <NuxtLink to="/replays">
                Replays
            </NuxtLink>
            <!-- <NuxtLink to="/maps">
                Maps
            </NuxtLink>
            <NuxtLink to="/players">
                Players
            </NuxtLink> -->
            <NuxtLink to="/battles">
                Battles
            </NuxtLink>
            <NuxtLink to="/leaderboards">
                Leaderboards
            </NuxtLink>
        </nav>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "nuxt-property-decorator";

@Component
export default class Navigation extends Vue {
}
</script>

<style lang="scss" scoped>
.nav{
    position: relative;
    background: #000;
    min-height: 90px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 10px 40px;
    .iframe & {
        display: none;
    }
    &:after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        transform: translateY(100%);
        width: 100%;
        height: 30px;
        background-image: url("~assets/images/navbottom.svg");
        background-position: top center;
    }
}
.links {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin: 0 auto;
    a{
        color: #b4b4b4;
        padding: 20px;
        transition: color .2s ease;
        text-transform: uppercase;
        font-weight: 400;
        font-size: 17px;
        letter-spacing: -1px;
        &:hover, .selected {
            color: #fff;
        }
        &.nuxt-link-active {
            color: #fff;
        }
    }
}
</style>
