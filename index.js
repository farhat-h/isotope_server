
const Parser = require("./src/Parser");

const p = new Parser();

p.initialize()
    .then(async majors => console.log(majors)) 