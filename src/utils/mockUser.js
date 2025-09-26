const bcrypt = require("bcrypt");
const uuid = require("uuid");

async function run() {
    const user = {
        user_id: uuid.v4(),
        username: "test",
        password: await bcrypt.hash("123", 10),
    };

    console.log(user);
}

run();