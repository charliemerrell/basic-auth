const app = require("./app");
const { sequelize, User } = require("./db");

app.listen(4000, () => {
    console.log("listening on", 4000);
});
