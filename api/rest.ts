import { ServerMiddleware } from '@nuxt/types';
import bodyParser from 'body-parser'
import express from "express";
import { delay } from 'jaz-ts-utils';

const app = express();

console.log("express app created");

app.use(bodyParser.json())
app.all('/getJSON', (req, res) => {
    res.json({ data: 'data' })
})

const myServerMiddleware: ServerMiddleware = function (req, res, next) {
    // Use req, res, next
    console.log("bob");
    next();
  }
  
  export default myServerMiddleware