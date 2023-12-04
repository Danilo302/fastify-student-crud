import { FastifyInstance } from "fastify";
import { prisma } from '../lib/prisma';
import { string, z } from "zod";

export async function StudentsRoutes(app: FastifyInstance) {

    //Questão 1: Cadastrar alunos
    app.post('/students', async (req, rep) => {
        const bodySchema = z.object({
            registration: z.string(),
            name: z.string(),
            phone: z.string(),
            PSWNote: z.string(),
        })

        const { registration, name, phone, PSWNote } = bodySchema.parse(req.body);

        const newStudent = await prisma.user.create({
            data: {
                registration,
                name,
                phone,
                PSWNote,
            },
        });
        return rep.code(201).send(newStudent);
    });

    //Questão 2: Listar alunos
    app.get('/students', async (req, rep) => {
        const students = await prisma.user.findMany();

        return rep.send(students);
    });

    //Questão 3: Deletar aluno
    app.delete('/students/:id', async (req, rep) => {
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = paramsSchema.parse(req.params)

        const student = await prisma.user.findUnique({
            where: { id },
        });

        if (!student) {
            console.log("Aluno não encontrado!")
        }

        await prisma.user.delete({
            where: { id },
        });
        return rep.code(204).send();

    })

    //Questão 4: Alterar dados de aluno
    app.put('/students/:id', async (req, rep) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        });

        const bodySchema = z.object({
            registration: z.string(),
            name: z.string(),
            phone: z.string(),
            PSWNote: z.string(),
        });

        const { id } = paramsSchema.parse(req.params)
        const { registration, name, phone, PSWNote } = bodySchema.parse(req.body);

        const student = await prisma.user.findUnique({
            where: { id },
        });

        if (!student) {
            console.log("Aluno não encontrado!")
        }

        await prisma.user.update({
            where: { id },
            data: {
                registration,
                name,
                phone,
                PSWNote,
            },
        });
        return rep.code(204).send()
    })

    //Questão 5: media das notas dos alunos
    app.get('/avgpswnote',async (req,rep) => {
        const avgNote = await prisma.user.aggregate({
            _avg: {
              PSWNote: true,
            },
          });
          return rep.send({ MedNotePSW: avgNote._avg.PSWNote });
    })
}