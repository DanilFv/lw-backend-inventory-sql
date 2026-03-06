import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysqlDb from './mysqlDb';
import productsRouter from './routes/products';
import categoriesRouter from './routes/categories';
import locationsRouter from './routes/locations';


const app = express();
const port = 8000;

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/locations', locationsRouter);


const run = async () => {
    await mysqlDb.init()

    app.listen(port, () => {
        console.log("Server started on port " + port);
    });
};

run().catch(err => console.error("Failed to start server", err));




