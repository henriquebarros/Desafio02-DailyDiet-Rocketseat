import { randomUUID } from "node:crypto"
import { FastifyInstance } from "fastify"
import { knex } from "../database"
import { z } from "zod"


export async function mealsRoutes(app:FastifyInstance){
    app.post('/', async (request, reply)=>{
        const createMealBodySchema = z.object({
            name: z.string(),
            date_meals: z.coerce.date().refine((data)=>{
                //.refine: Refinement functions should not throw. Instead they should return a falsy value to signal failure.
                return data < new Date()
            }, {
                message: 'Invalid date'
            }),
            within_diet: z.boolean()
        })


        const { name, date_meals, within_diet } = createMealBodySchema.parse( request.body )

        let sessionId = request.cookies.sessionId

        if(!sessionId){
            sessionId = randomUUID()
            reply.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days
            })
        }
        
        const meal = await knex('meals').insert({
            id: randomUUID(),
            name,
            date_meals: date_meals.toISOString().slice(0, 19).replace("T", " "),
            within_diet,
            session_id: sessionId,
        })

        return reply.status(201).send()
    })
}
