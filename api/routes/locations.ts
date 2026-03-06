import express, {NextFunction, Request, Response} from 'express';
import mysqlDb from '../mysqlDb';
import {Locations, LocationWithoutId} from '../types';
import {ResultSetHeader} from 'mysql2';

const locationsRouter = express.Router();

locationsRouter.get('/', async (req: Request, res: Response) => {
    const connection = mysqlDb.getConnection();

    const [result] = await connection.query<Locations[]>('SELECT * FROM locations');
    res.send(result);
});

locationsRouter.get('/:id', async (req: Request, res: Response) => {
   const id = req.params.id as string;
   const connection = mysqlDb.getConnection();
   const [result] = await connection.query<Locations[]>('SELECT * FROM locations WHERE id = ?', [id]);

   if (result.length === 0) {
       return res.status(404).send( 'Location not found');
   }

   res.send(result[0]);
});

locationsRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
   const id = req.params.id as string;
   const connection = mysqlDb.getConnection();

   try {
       const [result] = await connection.query<ResultSetHeader>('DELETE FROM locations WHERE id = ?', [id]);

       if (result.affectedRows === 0) {
           return res.status(404).send( 'Location not found');
       }

        res.send({message: 'Location deleted successfully'});

   } catch (e) {
       next(e);
   }
});

locationsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.title) {
        return res.status(400).send({error: 'Title is required'});
    }

    const connection = mysqlDb.getConnection();

    const newLocation: LocationWithoutId = {
        title: req.body.title,
        description: req.body.description,
    };

    try {
        const [result] = await connection.query<ResultSetHeader>(
            'INSERT INTO locations (title, description) VALUES (?, ?)',
            [newLocation.title, newLocation.description]);

        return res.send({
            id: result.insertId,
            ...newLocation,
        });

    } catch (e) {
        next(e);
    }
});

locationsRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.title || !req.body.description) {
        return res.status(400).send({error: 'Title is required'});
    }

    const id = req.params.id as string;
    const connection = mysqlDb.getConnection();

    try {
        const [result] = await connection.query<ResultSetHeader>(
            'UPDATE locations SET title = ?, description = ? WHERE id = ?',
            [req.body.title, req.body.description, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send({error: 'Location not found' });
        }

        const [currentData] = await connection.query<Locations[]>(
            'SELECT * FROM locations WHERE id = ?', [id]
        );

        res.send(currentData[0]);
    } catch (e) {
        next(e);
    }
});


export default locationsRouter;
