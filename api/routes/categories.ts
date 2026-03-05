import express, {NextFunction, Request, Response} from 'express';
import mysqlDb from '../mysqlDb';
import {Categories, CategoryWithoutId} from '../types';
import {ResultSetHeader} from 'mysql2';

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (req: Request, res: Response) => {
    const connection = mysqlDb.getConnection();

    const [result] = await connection.query<Categories[]>('SELECT * FROM categories');
    res.send(result);
});

categoriesRouter.get('/:id', async (req: Request, res: Response) => {
   const id = req.params.id as string;
   const connection = mysqlDb.getConnection();
   const [result] = await connection.query<Categories[]>('SELECT * FROM categories WHERE id = ?', [id]);

   if (result.length === 0) {
       return res.status(404).send( 'Category not found');
   }

   res.send(result[0]);
});

categoriesRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
   const id = req.params.id as string;
   const connection = mysqlDb.getConnection();

   try {
       const [result] = await connection.query<ResultSetHeader>('DELETE FROM categories WHERE id = ?', [id]);

       if (result.affectedRows === 0) {
           return res.status(404).send( 'Category not found');
       }

        res.send({message: 'Category deleted successfully'});

   } catch (e) {
       next(e);
   }
});

categoriesRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.title) {
        return res.status(400).send({error: 'Title is required'});
    }

    const connection = mysqlDb.getConnection();

    const newCategories: CategoryWithoutId = {
        title: req.body.title,
        description: req.body.description,
    };

    try {
        const [result] = await connection.query<ResultSetHeader>(
            'INSERT INTO categories (title, description) VALUES (?, ?)',
            [newCategories.title, newCategories.description]);

        return res.send({
            id: result.insertId,
            ...newCategories,
        });

    } catch (e) {
        next(e);
    }
});

categoriesRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.title || !req.body.description) {
        return res.status(400).send({error: 'Title is required'});
    }

    const id = req.params.id as string;
    const connection = mysqlDb.getConnection();

    try {
        const [result] = await connection.query<ResultSetHeader>(
            'UPDATE categories SET title = ?, description = ? WHERE id = ?',
            [req.body.title, req.body.description, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send({error: 'Category not found' });
        }

        const [currentData] = await connection.query<Categories[]>(
            'SELECT * FROM categories WHERE id = ?', [id]
        );

        res.send(currentData[0]);
    } catch (e) {
        next(e);
    }
});


export default categoriesRouter;
