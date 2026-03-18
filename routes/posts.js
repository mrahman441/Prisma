import express from 'express';
const router = express.Router({ mergeParams: true });

import wrap from '../utils/wrapAsync.js';
import prisma from '../lib/prisma.js';

// create a post
router.post('/', wrap(async (req, res) => {
    const post = await prisma.post.create({
        data: req.body
    })
    res.json(post);
}));

// get all posts
router.get('/', wrap(async (req, res) => {
    const posts = await prisma.post.findMany({
        select: { id: true, title: true }, // select specific fields if needed

        include: { author: true, tags: true }, // include the author details if needed
        // take: 2, // how many posts to fetch
        // skip: 2, // how many posts to skip
    });
    res.json(posts);
}));

// update post - remove tags
router.put('/:id', wrap(async (req, res) => {
    const post = await prisma.post.update({
        where: { id: 1 },
        data: {
            tags: { disconnect: { id: 2 } }
        }
    });
    res.json(post);
}));

// search posts based on keyword in title
router.get('/search', wrap(async (req, res) => {
    const { q } = req.query;
    const posts = await prisma.post.findMany({
        where: {
            title: {
                // contains: q, , // title contains
                // startsWith: q,  // title start with
                endsWith: q, // title end with

                mode: 'insensitive' // case-insensitive search
            }
        },
        // we can also use AND, OR, NOT for more complex queries
        // also we can use gte, lt, gte, lte for numeric and date fields

        include: { author: true, tags: true }
    });
    res.json(posts);
}));

// prisma transaction example  - create a user and a post in a single transaction
// if any of the operations fail, the entire transaction will be rolled back
// this is useful to maintain data integrity and consistency

//  if query depends on each other, we have to use function-style transaction.
// so this will not work because post creation depends on user creation and we need the user id for post creation. it will work for independent queries.
// router.post('/create-with-user', wrap(async (req, res) => {
//     const { userData, postData } = req.body;

//     const [user, post] = await prisma.$transaction([
//         prisma.user.create({ data: userData }),
//         prisma.post.create({ data: { ...postData, authorId: userData.id } })
//     ]);

//     res.json({ user, post });
// }));

// so we have to use function-style transaction for the above case
router.post('/create-with-user', wrap(async (req, res) => {
    const { userData, postData } = req.body;
    const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({ data: userData });
        const post = await tx.post.create({ data: { ...postData, authorId: user.id } });
        return { user, post };
    });
    res.json(result);
}));

// postman json for transaction example
// {
//     "userData": {
//         "name": "John Doe",
//         "email": "john.doe@example.com"
//     },
//     "postData": {
//         "title": "My First Post",
//         "content": "This is the content of my first post."
//     }
// }

export default router;