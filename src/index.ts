import  express  from "express";
import authRouter from "./routes/auth.routes";
import { authenticationMiddleware } from "./middlewares/authentication.middlewares";
import courseRouter from "./routes/courses.routes";
import purchaseRouter from "./routes/purchases.routes";
import lessonsRouter from "./routes/lessons.routes";

const PORT = process.env.PORT ?? 3000;
const app = express();

app.use(express.json());

app.use(authenticationMiddleware);

//healthcheck
app.get('/me', (req, res) => {
    res.status(200).json({id: req.user?.id, email: req.user?.email, role: req.user?.role});
})
    
app.use('/auth', authRouter);
app.use('/courses', courseRouter);
app.use('/lessons', lessonsRouter);
app.use('/purchases', purchaseRouter);
app.use('/users/:id/purchases', purchaseRouter);
 
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));