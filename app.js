import express from 'express';
import wrap from './utils/wrapAsync.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import usersRouter from './routes/users.js';
import postsRouter from './routes/posts.js';
import tagsRouter from './routes/tags.js';

app.get('/', wrap(async (req, res) => {
    res.send('Hey Dog!!');
}));

app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/tags', tagsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    const { status = 500, message = 'Internal Server Error' } = err;
    console.log("Chudling Pong - You got an error");
    res.status(status).json({ status, message });
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});