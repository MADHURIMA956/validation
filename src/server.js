const app = require('./index.js')

const connect = require('./configs/db');

app.listen(2555 , async function() {
    await connect();
    console.log('listening on port 2555');
});

