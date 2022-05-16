import { getConnection } from 'typeorm';

export async function clearDB(entities) {
  for (const entity of entities) {
    const repository = await getConnection().query(`DELETE FROM ${entity} `);
  }
}
