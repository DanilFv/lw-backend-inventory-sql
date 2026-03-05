import express, {Request, Response} from 'express';
import mysqlDb from '../mysqlDb';
import {Product} from '../types';

const productsRouter = express.Router();

productsRouter.get('/', async (req: Request, res: Response) => {
    const connection = mysqlDb.getConnection();

    const [result] = await connection.query('SELECT * FROM products');
    const products = result as Product[];
    res.send(products);
});

export default productsRouter;