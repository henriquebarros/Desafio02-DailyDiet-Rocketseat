import { randomUUID } from "node:crypto"
import { FastifyInstance } from "fastify"
import { knex } from "../database"
import { z } from "zod"


export async function mealsRoutes(app:FastifyInstance){

    app.post('/', async (request, reply)=>{
        const createMealBodySchema = z.object({
            name: z.string(),
            email: z.string().email()
        })


        const { name, email } = createMealBodySchema.parse( request.body )

        let sessionId = request.cookies.sessionId

        if(!sessionId){
            sessionId = randomUUID()
            reply.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days
            })
        }
        
        const findEmail = await knex('users').where({email}).first()

        if(findEmail){
            return reply.status(400).send({message:'User already exist!'})
        }

        await knex('users').insert({
            id: randomUUID(),
            name,
            email,
            session_id: sessionId,
        })

        return reply.status(201).send()
    })
}
