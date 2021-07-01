import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import { createConnection } from "typeorm";
import * as dotenv from "dotenv";

import { confirmEmail } from "./routes/confirmEmail";
import { redis } from "./redis";
import { generateSchema } from "./utils/generateSchema";

dotenv.config();

export const startServer = async () => {
  const server = new GraphQLServer({
    schema: generateSchema(),
    context: ({ request }) => ({
      redis,
      url: request.protocol + "://" + request.get("host")
    })
  });

  server.express.get("/confirm/:id", confirmEmail);
  await createConnection();
  await server.start();
  console.log("Server is running on localhost:4000");
};

startServer();
