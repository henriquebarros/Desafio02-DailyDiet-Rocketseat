import { describe, beforeAll, afterAll, it, beforeEach } from 'vitest'
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
})
