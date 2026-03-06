import express, {NextFunction, Request, Response} from 'express';
import mysqlDb from '../mysqlDb';
import {Product} from '../types';
import {ResultSetHeader} from 'mysql2';
import {imagesUpload} from '../multer';

const productsRouter = express.Router();

productsRouter.get('/', async (req: Request, res: Response) => {
    const connection = mysqlDb.getConnection();

    const [result] = await connection.query<Product[]>('SELECT id, title, category_id, location_id FROM products');
    res.send(result);
});

productsRouter.get('/:id', async (req: Request, res: Response) => {
   const id = req.params.id as string;
   const connection = mysqlDb.getConnection();
   const [result] = await connection.query<Product[]>('SELECT * FROM products WHERE id = ?', [id]);

   if (result.length === 0) {
       return res.status(404).send('Product not found!');
   }

   res.send(result[0]);
});

productsRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
   const id = req.params.id as string;
   const connection = mysqlDb.getConnection();

   try {
       const [result] = await connection.query<ResultSetHeader>('DELETE FROM products WHERE id = ?', [id]);

       if (result.affectedRows === 0) {
           return res.status(404).send('Product not found!');
       }

       res.send({message: 'Product deleted successfully'});
   } catch (e) {
       next(e);
   }
});

productsRouter.post('/', imagesUpload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
    const {category_id, location_id, title, description} = req.body;

    if (!category_id || !location_id || !title) {
        return res.status(400).send('Category ID, Location ID and Title are required!');
    }

    const connection = mysqlDb.getConnection();

    const newProduct = {
        category_id: parseInt(category_id),
        location_id: parseInt(location_id),
        title,
        description: description || null,
        image: req.file ? 'images/' + req.file.filename : null,
    }

    try {

        const [result] = await connection.query<ResultSetHeader>(
            'INSERT INTO products (category_id, location_id, title, description, image) VALUES (?, ?, ?, ?, ?)',
            [newProduct.category_id, newProduct.location_id, newProduct.title, newProduct.description, newProduct.image]
        );

        return res.send({
            id: result.insertId,
            ...newProduct,
        });

    } catch (e) {
        next(e);
    }
});

productsRouter.put('/:id', imagesUpload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
    const {category_id, location_id, title, description} = req.body;
    const id = req.params.id as string;

    if (!category_id || !location_id || !title) {
        return res.status(400).send({error: 'Category, location and Title are required'});
    }

    const connection = mysqlDb.getConnection();

    try {
        const imagePath = req.file ? 'images/' + req.file.filename : req.body.image;

        const [result] = await connection.query<ResultSetHeader>(
            'UPDATE products SET category_id = ?, location_id = ?, title = ?, description = ?, image = ? WHERE id = ?',
            [parseInt(category_id), parseInt(location_id), title, description || null, imagePath || null, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send({error: 'Product not found' });
        }

        const [currentData] = await connection.query<Product[]>(
            'SELECT * FROM products WHERE id = ?', [id]
        );

        res.send(currentData[0]);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

export default productsRouter;