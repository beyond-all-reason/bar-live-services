import { createProxyMiddleware } from "http-proxy-middleware";

export default createProxyMiddleware({
    target: "https://server5.beyondallreason.info",
    changeOrigin: true,
    pathRewrite: { "^/api/leaderboard": "/teiserver/api/public/leaderboard" }
});
