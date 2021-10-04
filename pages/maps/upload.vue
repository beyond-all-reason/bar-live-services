<template>
    <div>
        <h1>Upload Maps</h1>
        <div class="form-group">
            <v-file-input name="map" multiple show-size small-chips accept=".sdz,.sd7" label="Upload your .sdz or .sd7 map files here" v-model="files"></v-file-input>
            <!-- <v-progress-linear v-model="value" :buffer-value="bufferValue"></v-progress-linear> -->
        </div>

        <button v-on:click="uploadMap">Upload</button>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";

@Component
export default class MapUpload extends Vue {
    files: File[] = [];

    onFileChange() {
        console.log("Yerp");
    }

    async uploadMap(){
        console.log("upload");

        console.log(this.files);
        //const test = await this.$http.post("map-upload", );
        try {
            for (const file of this.files) {
                const formData = new FormData();
                formData.append("file", file);
                const response = await this.$http.post("map-upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
                console.log(response);
            }
        } catch (err) {
            console.error(`Error uploading file`);
        }
    }
}
</script>

<style lang="scss" scoped>

</style>