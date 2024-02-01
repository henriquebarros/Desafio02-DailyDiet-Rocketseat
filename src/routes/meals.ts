import { FastifyInstance } from "fastify"
import { z } from "zod"


export async function mealsRoutes(app:FastifyInstance){
    app.post('/', async (request, reply)=>{
        const createMealBodySchema = z.object({
            name: z.string(),
            date_meals: z.coerce.date().refine((data)=>{
                console.log(data > new Date())
                return data < new Date()
            }, {
                message: 'Invalid date'
            }),
            within_diet: z.boolean()
        })


        const { name, date_meals, within_diet } = createMealBodySchema.parse( request.body )

        console.log(name, date_meals, within_diet )
    })
}

/**
 *         table.uuid('id').primary()
        table.text('name').notNullable()
        table.timestamp('date_meals').defaultTo(knex.fn.now()).notNullable()
        table.boolean('within_diet').defaultTo(true).notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
        table.uuid('session_id').after('id').index()
 */