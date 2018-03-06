const app = require("http")
.createServer((req, res) => res.send('oh hi there!'));

console.log(process.env.PORT)
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
})
