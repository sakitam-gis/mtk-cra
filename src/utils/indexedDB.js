import { openDB } from 'idb/with-async-ittr';

let db = null;

export async function createDB(name) {
  if (!db) {
    db = await openDB(name, 1, {
      upgrade(db) {
        createStore(db, 'idb');
      },
    });
  }
  return db;
}

function getObjectStore(dbSchema, store_name, mode) {
  try {
    const tx = dbSchema.transaction(store_name, mode);
    return tx.objectStore(store_name);
  } catch (e) {
    return false;
  }
}

export async function createStore (db, name, mode = 'readwrite') {
  let store = getObjectStore(db, name, mode);
  if (!store) {
    try {
      store = db.createObjectStore(name, {
        // The 'id' property of the object will be the key.
        // keyPath: 'id',
        // If it isn't explicitly set, create a value by auto incrementing.
        // autoIncrement: true,
      });
    } catch (e) {
      console.error(e);
    }
  }
  return store;
}
