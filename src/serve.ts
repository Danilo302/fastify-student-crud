import fastify from "fastify";

import { StudentsRoutes } from "./routes/students";

const app = fastify();

app.register(StudentsRoutes);

app.listen({port: 3000,}).then(() => {
    console.log('Conectado na porta 3000')
})