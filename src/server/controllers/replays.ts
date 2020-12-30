import { Router } from "express";

export const router = Router();

router.get("/replays", (req, res) => {
    res.send("replays");
});