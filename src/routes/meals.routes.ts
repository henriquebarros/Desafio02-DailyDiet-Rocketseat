import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const meals = await knex('meals')
        .where({
          user_id: request.user?.id,
        })
        .orderBy('date_meals', 'desc')

      return reply.send({ meals })
    },
  )
  app.get(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealsParamsSchema.parse(request.params)

      const meal = await knex('meals')
        .where({
          id,
        })
        .first()

      if (!meal) {
        return reply.status(404).send({ error: 'Meal not found' })
      }

      return reply.send({ meal })
    },
  )
  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        date_meals: z.coerce.date().refine(
          (data) => {
            // .refine: Refinement functions should not throw. Instead they should return a falsy value to signal failure.
            return data < new Date()
          },
          {
            message: 'Invalid date',
          },
        ),
        within_diet: z.boolean(),
        description: z.string(),
      })

      const { name, date_meals, within_diet, description } =
        createMealBodySchema.parse(request.body)

      await knex('meals').insert({
        id: randomUUID(),
        name,
        date_meals: date_meals.toISOString().slice(0, 19).replace('T', ' '),
        within_diet,
        description,
        user_id: request.user?.id,
      })

      return reply.status(201).send()
    },
  )
}
