// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    meals: {
      id: string
      name: string
      description: string
      date_meals: number
      within_diet: boolean
      created_at: string
      updated_at: string
      user_id: string
    }
    users: {
      id: string
      session_id: string
      name: string
      email: string
      created_at: string
      updated_at: string
    }
  }
}
