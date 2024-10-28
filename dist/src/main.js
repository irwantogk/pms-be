"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cluster_1 = __importDefault(require("cluster"));
const express_server_1 = require("./express_server");
const os_1 = __importDefault(require("os"));
console.log(os_1.default.cpus().length);
console.log(cluster_1.default.isPrimary);
let numCpus = os_1.default.cpus().length;
if (cluster_1.default.isPrimary) {
    console.log(`Master process PID: ${process.pid}`);
    for (let i = 0; i < numCpus; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on("exit", (worker, code, signal) => {
        console.log(`Worker process ${worker.process.pid} exited with code ${code} and signal ${signal}`);
        setTimeout(() => {
            cluster_1.default.fork();
        }, 1000);
    });
}
else {
    const server = new express_server_1.ExpressServer();
    process.on("uncaughtException", (error) => {
        console.error(`Uncaught exception in worker process ${process.pid}:`, error);
        server.closeServer();
        setTimeout(() => {
            cluster_1.default.fork();
            cluster_1.default.worker?.disconnect();
        }, 1000);
    });
    process.on("SIGINT", () => {
        console.log("Received SIGINT signal");
        server.closeServer();
    });
    process.on("SIGTERM", () => {
        console.log("Received SIGTERM signal");
        server.closeServer();
    });
}
