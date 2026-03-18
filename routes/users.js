import express from 'express';
const router = express.Router({ mergeParams: true });

import wrap from '../utils/wrapAsync.js';
import prisma from '../lib/prisma.js';

// get all users
router.get("/", wrap(async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
}));

// create a user
router.post("/", wrap(async (req, res) => {
    const user = await prisma.user.create({
        data: req.body
    })
    res.json(user);
}))

// get a single user
router.get('/:id', wrap(async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.params.id },
        include: { posts: true } // include the posts of the user if needed
    });
    res.json(user);
}))

// update a user
router.put('/:id', wrap(async (req, res) => {
    const user = await prisma.user.update({
        where: { id: req.params.id },
        data: req.body
    });
    res.json(user);
}));

// delete a user
router.delete('/:id', wrap(async (req, res) => {
    const user = await prisma.user.delete({
        where: { id: req.params.id }
    });
    res.json(`User with username '${user.name}' deleted successfully.`);
}))

// we can use createMany, updateMany, deleteMany for bulk operations

export default router;

