import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysqlDb from './mysqlDb';
import productsRouter from './routes/products';


const app = express();
const port = 8000;

dotenv.config();
app.use(cors());
app.use(express.json());

app.use('/products', productsRouter);

app.get('/test', (req, res) => {
    res.send('Test works');
});

const run = async () => {
    await mysqlDb.init()

    app.listen(port, () => {
        console.log("Server started on port " + port);
    });
};

run().catch(err => console.error("Failed to start server", err));




