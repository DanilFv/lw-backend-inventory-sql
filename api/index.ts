import express, {Request, Response} from 'express';
import cors from 'cors';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log("Server started on port " + port);
});

app.get('/', (req: Request, res: Response) => {
   res.send('Hello World!');
});
