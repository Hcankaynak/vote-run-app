const express = require("express");
const cors = require("cors");
const middleware = require("./middleware/index")

const app = express();
const PORT = 3001;

app.use(express.json(), cors());
app.use(middleware.middleware.decodeToken);

app.post('/', (req, res) => {
    const {name} = req.body;

    res.send(`Welcome ${name}`);
})

app.get("/api", (req, res) => {
    console.log(req.headers);
    const data = "data";
    res.send(`message received ${data}`)

})

app.get('/hello')

// @ts-ignore
app.listen(PORT, (error) => {
        if (!error)
            console.log("Server is Successfully Running," +
                "and App is listening on port " + PORT)
        else
            console.log("Error occurred, server can't start", error);
    }
);