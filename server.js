import cluster from "cluster";
import os from "os";
import app from "./app.js";
import connectToDatabase from "./connections/connections.js";

const PORT = process.env.PORT || 8000;
const USE_CLUSTER = process.env.USE_CLUSTER === "true";

const startServer = async () => {
  try {
    await connectToDatabase();
    console.log(`Process ${process.pid} connected to MongoDB`);

    const server = app.listen(PORT, () => {
      console.log(`Process ${process.pid} listening on port ${PORT}`);
    });

    process.on("SIGINT", () => {
      server.close(() => {
        console.log(`Process ${process.pid} shutting down...`);
        process.exit(0);
      });
    });
  } catch (error) {
    console.error(`Process ${process.pid} failed to start:`, error);
    process.exit(1);
  }
};

if (USE_CLUSTER && cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(
    `Primary ${process.pid} is running. Forking ${numCPUs} workers...`
  );

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  // Single-process mode (default)
  startServer();
}
