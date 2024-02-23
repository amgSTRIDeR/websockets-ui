import { httpServer } from "./src/http_server/index.ts";

const HTTP_PORT = 8181;
const NODE_PORT = 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);