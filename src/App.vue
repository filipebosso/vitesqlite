<script setup>
import { onMounted, ref } from 'vue';
import { connect, iniciar, db, sqlite } from './services/connect';

var dbName = "usuarios";
const tableName = "items";

const items = ref([]);
const newItem = ref('');

const createTable = async () => {
  await connect(dbName)

  const query = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL
        );
        `
  const res = await db.execute(query);
  console.log(`res: ${JSON.stringify(res)}`);

  if (res.changes && res.changes.changes && res.changes.changes < 0) {
    throw new Error(`Error: execute failed`);
  }
  await sqlite.closeConnection(`${dbName}`, false);

};

const loadItems = async () => {
  await connect(dbName)

  const result = await db.query(`SELECT * FROM ${tableName};`);
  items.value = result.values;
  console.log(`selected: ${JSON.stringify(result)}`);
  await sqlite.closeConnection(`${dbName}`, false);
};

const addItem = async (name) => {
  await connect(dbName)
  try {
    const sql = `INSERT INTO ${tableName} (id, name) VALUES (?,?);`;
    await db.query(sql, [Date.now(), name]);
    console.log(sql, 'sql')
    await sqlite.closeConnection(`${dbName}`, false);
    loadItems();
  } catch (err) {
    console.error('Error adding item:', err);
  }
};

const deleteItem = async (id) => {
  await connect(dbName)

  try {
    await db.query(`DELETE FROM ${tableName} WHERE id = ?;`, [id]);
    await sqlite.closeConnection(`${dbName}`, false);
    loadItems();
  } catch (err) {
    console.error('Error deleting item:', err);
  }
};

onMounted(async () => {
  await iniciar()
  await createTable()
  await loadItems()
})


</script>

<template>
  <v-container>
    <v-text-field v-model="newItem" label="Add Item"></v-text-field>
    <v-btn @click="addItem(newItem)">Add</v-btn>

    <v-list>
      <v-list-item v-for="item in items" :key="item.id">
        <v-text-field v-model="item.name"></v-text-field>
        <v-btn @click="updateItem(item.id, item.name)">Update</v-btn>
        <v-btn @click="deleteItem(item.id)">Delete</v-btn>
      </v-list-item>
    </v-list>
  </v-container>
</template>
