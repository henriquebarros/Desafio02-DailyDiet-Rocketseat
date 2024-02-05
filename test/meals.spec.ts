import { describe, beforeAll, afterAll, it, beforeEach, expect } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })
  it('should be able to create a meal with existing user', async () => {
    const createUser = await request(app.server).post('/users').send({
      name: 'Henrique Barros',
      email: 'henriquebarros@live.com',
    })

    const cookies = createUser.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Creme de Camarão',
        description: 'Risoto cremoso com camarões suculentos',
        date_meals: '2024-01-25T20:32:10.279Z',
        within_diet: false,
      })
      .expect(201)
  })

  it('should be able to list all of user is meals', async () => {
    const createUser = await request(app.server)
      .post('/users')
      .send({
        name: 'Henrique Barros',
        email: 'henriquebarros@live.com',
      })
      .expect(201)

    const cookies = createUser.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Café da manhã',
        description: 'Pão de Queijo Vegano',
        date_meals: '2024-01-25T20:32:10.279Z',
        within_diet: true,
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Creme de Camarão',
        description: 'Risoto cremoso com camarões suculentos',
        date_meals: '2024-01-25T20:32:10.279Z',
        within_diet: false,
      })
      .expect(201)

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)
    console.log(listMealsResponse.body.meals)
    expect(listMealsResponse.body.meals[0].name).toBe('Café da manhã')
    expect(listMealsResponse.body.meals[1].name).toBe('Creme de Camarão')
  })
})
