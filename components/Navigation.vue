<template>
    <div class="nav">
        <NuxtLink to="/" class="logo">
            <img src="~/assets/images/logo.png">
            <div class="alpha">
                Alpha
            </div>
        </NuxtLink>
        <nav class="links" role="navigation">
            <NuxtLink to="/">
                Home
            </NuxtLink>
            <NuxtLink to="/maps">
                Maps
            </NuxtLink>
            <NuxtLink to="/replays">
                Replays
            </NuxtLink>
            <NuxtLink to="/battles">
                Battles
            </NuxtLink>
            <NuxtLink to="/leaderboards">
                Leaderboards
            </NuxtLink>
            <NuxtLink to="/players">
                Players
            </NuxtLink>
        </nav>
    </div>
</template>

<style lang="scss" scoped>
.nav{
    position: relative;
    background: #000;
    height: 90px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 10px 40px;
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
.logo {
    display: flex;
    align-items: center;
    height: 50px;
    &:hover img {
        opacity: 1;
        filter: brightness(130%);
    }
    img {
        transition: all .2s ease;
        will-change: filter;
        filter: brightness(100%);
        max-height: 100%;
        opacity: 0.9;
    }
    .alpha {
        text-transform: uppercase;
        align-self: flex-start;
    }
}
.links {
    display: flex;
    justify-content: center;
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
    }
}
</style>
