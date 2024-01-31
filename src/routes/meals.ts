import { FastifyInstance } from "fastify"

export async function mealsRoutes(app:FastifyInstance){
    app.get('/', async (request, reply)=>{
        reply.status(200).send('Ok')
    })
}