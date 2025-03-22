import { createProxyMiddleware } from "http-proxy-middleware";

export default createProxyMiddleware({
    target: "https://server4.beyondallreason.info",
    changeOrigin: true,
    pathRewrite: { "^/api/leaderboard": "/teiserver/api/public/leaderboard" }
});
