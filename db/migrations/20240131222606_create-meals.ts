import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('meals',(table)=>{
        table.uuid('id').primary()
        table.text('name').notNullable()
        table.timestamp('date_meals').defaultTo(knex.fn.now()).notNullable()
        table.boolean('within_diet').defaultTo(true).notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
        table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
        table.uuid('session_id').after('id').index()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('meals')
}


