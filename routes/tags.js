import express from 'express';
const router = express.Router({ mergeParams: true });

import wrap from '../utils/wrapAsync.js';
import prisma from '../lib/prisma.js';

router.post('/', wrap(async (req, res) => { // create a tag
    const tag = await prisma.tag.create({
        data: req.body
    })
    res.json(tag);
}));

// postman json
// {
//     "title": "Prisma Guide",
//         "content": "Learning Prisma",
//             "authorId": "355d40dd-aef1-4de4-892f-836871e34954",
//              "tags": {
//                 "connect": [
//                     { "name": "backend" },
//                     { "name": "database" }
//                 ]
//              }
// }

router.get('/', wrap(async (req, res) => { // get all tags
    const tags = await prisma.tag.findMany({
        include: { posts: true } // include the posts of the tag if needed
    });
    res.json(tags);
}));

export default router;