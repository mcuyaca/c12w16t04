// Objetivo: Crear una REST API que maneje operaciones CRUD de una o más
// tablas y que utilice PostgreSQL como capa de persistencia de datos.
// (podrían reutilizar la api de notas de la semana pasada)
// El reto aquí es ser capaces de ejecutar sentencias SQL desde un proyecto
//  de Node.js y obtener de vuelta los resultados  para enviarselos como respuesta
//   al cliente (editado)

import * as http from "node:http";
import * as url from "url";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import { Client, ClientConfig } from "pg";
import dontenv from "dotenv";
dontenv.config();
console.log(process.env);
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ConfigData {
  host: string;
  port: string;
  database: string;
  user: string;
  password: string;
}

class MyExpress {
  constructor() {}

  /**
   * name
   */
  public start(port: number): void {
    const server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });
    server.listen(port, () => {
      console.log(`El servidor esta escuchandose en el puerto ${port}`);
    });
  }
  /**
   * name
   */
  private async handleRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): Promise<void> {
    const { url, method } = req;

    if (method === "GET") {
      console.log(`-- GET : ${new Date(Date.now()).toLocaleString()} -- `);
      const msg = await this.DBConnection();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(msg);
    }
  }

  private async DBConnection() {
    const data: ClientConfig = {
      host: process.env["HOST"],
      port: parseInt(process.env["PORT"]!),
      database: process.env["DATABASE"],
      user: process.env["USER"],
      password: process.env["PASSWORD"],
    };

    const client = new Client(data);
    await client.connect();
    const query = {
      name: "Select",
      text: "SELECT g.name, COUNT(gm.movie_id) FROM genres_movies as gm JOIN genres as g ON gm.genre_id = g.id GROUP BY g.name ORDER BY g.name; ",
      rowMode: "string",
    };

    const DBResponse = await client.query(query);
    const responseBody = JSON.stringify(DBResponse.rows, null, 2);
    await client.end();
    return responseBody;
  }
}

const app = new MyExpress();
app.start(3000);
