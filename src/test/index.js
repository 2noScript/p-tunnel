
import express from 'express'
const app = express();

app.get('/', (req, res) => {
    console.log(req.query)
    res.json({j:"lll"})
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
