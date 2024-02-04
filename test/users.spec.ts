import { beforeEach, describe, beforeAll, afterAll, it, expect } from 'vitest'
import request from 'supertest'
import { execSync } from 'node:child_process'
import { app } from '../src/app'
// createServer: cria uma servidor http node
describe('Users routes', () => {
  // Assegura que a aplicação já conclui o cadastro de todos os plugins do fastify
  beforeAll(async () => {
    await app.ready() // Aguarda até que o Fastify tenha concluído o registro dos plugins
  })

  afterAll(async () => {
    await app.close() // Fecha a aplicação, removendo-a da memória
  })

  // método é executado antes de cada teste no bloco de teste
  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Henrique Barros',
        email: 'henriquebarros2@live.com',
      })
      .expect(201)

    // expect(response.statusCode).toEqual(201)
  })

  it('should be able to check if user exists', async () => {
    await request(app.server).post('/users').send({
      name: 'Henrique Barros',
      email: 'henriquebarros@live.com',
    })

    const response = await request(app.server).post('/users').send({
      name: 'Paulo Barros',
      email: 'henriquebarros@live.com',
    })

    expect(response.statusCode).toEqual(400)
  })
})
