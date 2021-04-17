export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    //open connection to the database with version of 1
    const request = window.indexedDB.open('shop-shop', 1);

    //create variables to hold reference to the database, transaction, and object store
    let db, tx, store;

    //if version has changed or first time connecting run this to create object stores
    request.onupgradeneeded = function(e) {
      const db = request.result;
      //creat object store for each type of dta and set primary key index to be the _id of data
      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories', { keyPath: '_id' });
      db.createObjectStore('cart', { keyPath: '_id' });
    };

    //handle any errors with connecting
    request.onerror = function(e) {
      console.log('There was an error');
    };

    //on database open successs
    request.onsuccess = function(e) {
      //save a reference of the db to the db variable
      db = request.result;
      //open a transaction do whatever we pas into storeName
      tx = db.transaction(storeName, 'readwrite');
      //save a reference to that object store
      store = tx.objectStore(storeName);

      //if theres any errors, display
      db.onerror = function(e) {
        console.log('error', e);
      };

      switch (method) {
        case 'put':
          store.put(object);
          resolve(object);
          break;
        case 'get':
          const all = store.getAll();
          all.onsuccess = function() {
            resolve(all.result);
          };
          break;
        case 'delete':
          store.delete(object._id);
          break;
        default:
          console.log('No valid method');
          break;
      }
      //when transaction complete close connection
      tx.oncomplete = function() {
        db.close();
      };
    };
  });
}
