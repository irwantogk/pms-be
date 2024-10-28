import cluster from "cluster";
import { ExpressServer } from "./express_server";
import os from "os";

console.log(os.cpus().length);
console.log(cluster.isPrimary);

let numCpus = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master process PID: ${process.pid}`);

  for (let i = 0; i < numCpus; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker process ${worker.process.pid} exited with code ${code} and signal ${signal}`,
    );
    setTimeout(() => {
      cluster.fork();
    }, 1000);
  });
} else {
  // connect to the server
  const server = new ExpressServer();
  process.on("uncaughtException", (error: Error) => {
    console.error(
      `Uncaught exception in worker process ${process.pid}:`,
      error,
    );

    server.closeServer();

    setTimeout(() => {
      cluster.fork();

      cluster.worker?.disconnect();
    }, 1000);
  });

  // Gracefully handle termination signals
  process.on("SIGINT", () => {
    console.log("Received SIGINT signal");

    // Close any open connections or resources
    server.closeServer();
  });

  process.on("SIGTERM", () => {
    console.log("Received SIGTERM signal");

    // Close any open connections or resources
    server.closeServer();
  });
}
