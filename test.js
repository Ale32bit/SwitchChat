const {Client} = require("./");

const client = new Client();
client.connect()
    .then(() => {
        console.log("Client connected successfully!");
        client.destroy();
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
