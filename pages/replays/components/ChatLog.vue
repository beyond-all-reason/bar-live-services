<template>
    <div class="chatlog">
        <div class="title">
            Chatlog
        </div>
        <div class="messages">
            <div v-for="(chat, index) in chatlog" :key="`chat-${index}`" class="chat">
                <div class="time">
                    {{ gameTimeString(chat.time) }}
                </div>
                <div class="message">
                    <span v-setPlayerColor="playerColors[chat.playerId]" class="name">{{ chat.name || "???" }}</span>
                    <span :class="`text type-${chat.type}`">{{ chat.message }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";
import { DemoModel } from "sdfz-demo-parser";

@Component({
    directives: {
        setPlayerColor (el, binding) {
            if (binding.value === undefined) { return; }
            const { r, g, b } = binding.value as { r: number, g: number, b: number };
            const lightness = 0.299 * r + 0.587 * g + 0.114 * b; // https://stackoverflow.com/a/596243/1864403
            el.style.color = `rgba(${r * 100}%, ${g * 100}%, ${b * 100}%, 1)`;
            el.style.textShadow = lightness < 0.1 ? "0 0 3px #fff" : "1px 1px #000";
        }
    }
})
export default class ChatLog extends Vue {
    @Prop({ type: Array, required: true }) readonly chatlog!: DemoModel.ChatMessage[];
    @Prop({ type: Object, required: true }) readonly playerColors!: { [playerId: number]: { r: number, g: number, b: number } };

    gameTimeString (gameTime: number) {
        return this.$moment.utc(this.$moment.duration(gameTime, "seconds").asMilliseconds()).format("mm:ss");
    }

    playerColorString (playerId: number) {
        const color = this.playerColors[playerId];
        if (color === undefined) { return "#fff"; }
        return `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
    }
}
</script>

<style lang="scss" scoped>
.chatlog {
    display: flex;
    flex-direction: column;
    margin-top: 16px;
    font-size: 14px;
    width: 100%;
}
.title {
    font-size: 18px;
    margin-bottom: 6px;
    font-weight: 500;
}
.messages {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    overflow-y: scroll;
    max-height: 270px;
}
.chat {
    display: flex;
    padding: 3px 0;
    &:nth-child(odd) {
        background: rgba(255, 255, 255, 0.05);
    }
}
.time {
    min-width: 50px;
}
.name {
    &:after {
        content: ":";
        margin-right: 5px;
    }
}
.message {

}
.type {
    &-ally { color: rgb(172, 226, 172); }
    &-spec { color: rgb(228, 228, 159); }
    &-global { color: white; }
}
</style>
