# DumoDB
My attempt at a scalable database.<br /><br />
```js
const Database = require('dumodb');
const hash = require('some-hashing-library');

const db = new Database('./my-database/');

db.store('users').set('a-user', {
    password: hash('password123')
});
```