import { Server } from "server";
import Vue, { VueConstructor } from "vue";
import { createRenderer } from "vue-server-renderer";
import config from "../../config.json";
import { promises as fs } from "fs";

declare const __IS_DEV__: boolean;

(async () => {
    const server = new Server({ isDev: __IS_DEV__, port: config.port });

    await server.start();

    const template = await fs.readFile("./dist/client/index.html", "utf-8");

    const renderer = createRenderer({ template });

    server.app.get('/bar', async (req, res) => {
        const context = { url: req.url };
        const { app } = await createApp();

        renderer.renderToString(app, (err, html) => {
            res.end(html);
        });

        server.app.get("/test", (req, res) => {
            res.send("Test");
        });
    });
})();

// function createApp(context: any) {
//     return new Vue({
//         data: {
//             url: context.url
//         },
//         template: `<div>123 The visited URL is: {{ url }}</div>`
//     })
// }

// import home from "components/home.vue";
export async function createApp() {

    let home: VueConstructor<Vue>;
    if (__IS_DEV__){
        home = await (await import("components/home.vue")).default;
    } else {
       // home = 
    }

    const app = new Vue({
        // the root instance simply renders the App component.
        render: h => h(home)
    })
    return { app };
}