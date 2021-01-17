import { Server } from "server";
import Vue from "vue";
import { createRenderer } from "vue-server-renderer";

import config from "../../config.json";

declare const __IS_DEV__: boolean;

(async () => {
    const server = new Server({ isDev: __IS_DEV__, port: config.port });

    const renderer = createRenderer();

    server.app.get("/test", (req, res) => {
        res.send("test fish");
    });

    server.app.get("/bob", (req, res) => {
        res.send("bob");
    });

    // server.app.get("/test", async (req, res) => {
    //     const test = await import("test");
    //     res.send(test.test.str);
    //     // const indexStr = await fs.readFile("./src/server/views/index.vue");
    //     // const vueIndex = new Vue(indexStr);
    //     // const html = await renderer.renderToString(vueIndex);
    //     // res.end(html);

    // });

    await server.start();
    // const template = await fs.readFile("./dist/client/bar.html", "utf-8");

    // const renderer = createRenderer({ template });

    // server.app.get('/bar', async (req, res) => {
    //     const context = { url: req.url };
    //     const { app } = await createApp();

    //     renderer.renderToString(app, (err, html) => {
    //         res.end(html);
    //     });

    //     server.app.get("/test", (req, res) => {
    //         res.send("Test");
    //     });
    // });
})();

import index from "views/index.vue";

function test() {
    return Promise.resolve(
        new Vue({
            render: h => h(index)
        })
    );
}

// function createApp(context: any) {
//     return new Vue({
//         data: {
//             url: context.url
//         },
//         template: `<div>123 The visited URL is: {{ url }}</div>`
//     })
// }


// import home from "components/home.vue";
// export async function createApp() {

//     let home: VueConstructor<Vue>;
//     if (__IS_DEV__){
//         home = await (await import("views/bar.vue")).default;
//     } else {
//        // home =
//     }

//     const app = new Vue({
//         // the root instance simply renders the App component.
//         render: h => h(home)
//     })
//     return { app };
// }