<template>
    <div :class="`change depth-${depth} ${data.changes ? '' : 'value-block'}`">
        <a v-if="depth === 0" class="property-name" :href="`https://www.beyondallreason.info/unit/${data.propertyId}`" target="_parent">
            <img class="unitpic3d" :src="`/unitpics3d/${data.propertyId}.png`" alt="">
        </a>
        <div class="property-title">
            <a v-if="depth === 0" class="property-name" :href="`https://www.beyondallreason.info/unit/${data.propertyId}`" target="_parent">
                <img v-if="depth === 0" class="unitpic" :src="`/unitpics/${data.propertyId}.png`">
                <img v-if="depth === 0" class="faction" :src="require(`~/assets/images/${data.propertyId.substr(0, 3) === 'cor' ? 'cortex' : 'armada'}_faction.png`)">
                <span>{{ data.propertyName }}</span>
            </a>
            <div v-else class="property-name">
                <template v-if="data.propertyName === 'Undefined'">
                    ?
                </template>
                <template v-else>
                    {{ data.propertyName }}
                </template>
            </div>
        </div>
        <div v-if="data.changes" class="changes">
            <PropertyChange v-for="(change, index) in data.changes" :key="index" :data="change" :depth="depth+1" />
        </div>
        <div v-else class="property-change">
            <div v-if="data.changeType !== 'Unknown'" :class="`badge badge--${data.changeType}`">
                {{ data.percentChange !== undefined ? `${data.percentChange > 0 ? '+' : ''}${Math.round(data.percentChange * 100)}%` : "" }} {{ data.changeType }}
            </div>

            <div v-if="data.prevValue && Array.isArray(data.prevValue)">
                <div v-for="(value, index) of data.prevValue" :key="index" class="badge">
                    {{ value }}
                </div>
            </div>
            <template v-else-if="data.prevValue">
                <div class="badge">
                    {{ data.prevValue }}
                </div>
            </template>

            <v-icon v-if="data.changeType !== 'Removed' && data.changeType !== 'Added'" color="#fff">
                mdi-arrow-right-thick
            </v-icon>

            <div v-if="data.newValue && Array.isArray(data.newValue)">
                <div v-for="(value, index) of data.newValue" :key="index" class="badge">
                    {{ value }}
                </div>
            </div>
            <template v-else-if="data.newValue">
                <div class="badge">
                    {{ data.newValue }}
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";
import { ObjectChanges, ValueChange } from "bar-balance-changes";

@Component
export default class PropertyChange extends Vue {
    @Prop({ type: Object, required: true }) readonly data!: ObjectChanges | ValueChange;
    @Prop({ type: Number, required: true }) readonly depth!: Number;
}
</script>

<style lang="scss" scoped>
.change {
    position: relative;
    &:last-child {
        .unitpic3d {
            margin-top: 5px;
        }
    }
}
.property-title {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 5px;
}
.property-name {
    color: #fff;
}
a.property-name {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    align-items: center;
}
.faction {
    height: 30px;
}
.unitpic {
    height: 30px;
    border-radius: 100%;
}
.unitpic3d {
    position: absolute;
    margin-top: -10px;
    right: 0;
    top: 50%;
    image-rendering: -webkit-optimize-contrast;
    height: 110px;
    transform: translateX(80%) translateY(-50%) scaleX(-1);
}
@for $i from 0 through 6 {
    .depth-#{$i} {
        .property-title {
            //font-size: 32px - ($i * 4);
            margin-left: 15px * $i;
            border-left: 3px solid rgba(255, 255, 255, 0.3);;
            padding-left: 7px;
        }
        .property-change {
            margin-left: 15px * $i;
            border-left: 3px solid rgba(255, 255, 255, 0.3);
            padding-left: 7px;
        }
    }
}
.depth-0 {
    & > .property-title {
        font-size: 24px;
        font-weight: 600;
        border-left: none;
        padding-left: 0;
    }
    & > .property-change {
        font-weight: 600;
        border-left: none;
        padding-left: 0;
    }
}
$buff: rgba(86, 167, 39, 0.7);
$nerf: rgba(172, 31, 31, 0.7);
$added: rgba(31, 52, 172, 0.7);
$removed: rgb(190, 92, 0);
.badge {
    display: inline-flex;
    font-weight: 300;
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    padding: 0 7px;
    align-self: center;
    font-size: 14px;
    &--Buff {
        background: $buff;
    }
    &--Nerf {
        background: $nerf;
    }
    &--Removed {
        background: $removed;
    }
    &--Added {
        background: $added;
    }
}
.value-block {
    display: flex;
    align-items: flex-start;
    padding: 2px 0;
    .property-title {
        align-self: normal;
    }
    .property-name {
        font-size: 16px;
        margin-right: 10px;
        display: flex;
        align-items: center;
    }
    .property-change {
        font-size: 16px;
        border-left: none;
        padding-left: 0;
        margin-left: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 3px;
    }
}
</style>
