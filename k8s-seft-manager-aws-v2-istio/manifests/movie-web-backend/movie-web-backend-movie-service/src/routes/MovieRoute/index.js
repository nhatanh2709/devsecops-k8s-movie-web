'use strict';

const express = require('express');
const router = express.Router();
const {
    uploadMovie,
    updateMovie,
    findMovieById,
    findMovieBySlug,
    randomMovie,
    getAllMovie,
    catalogMovie,
    popularMovie,
    getMovieInfo,
    getMovieMostView,
    postComment,
    getComment,
    searchDocuments
} = require('../../controller/MovieController');

router.post('/', uploadMovie);
router.put('/:id', updateMovie);
router.get('/find/:id', findMovieById);
router.get('/findName/:Slug', findMovieBySlug);
router.get('/random', randomMovie);
router.get('/', getAllMovie);
router.get('/query', catalogMovie);
router.post('/popular', popularMovie);
router.get('/getInfo', getMovieInfo);
router.get('/view/mostView', getMovieMostView);
router.post('/interactive/post/:id', postComment);
router.get('/interactive/get/:id', getComment);
router.get('/similar-movies', searchDocuments);

module.exports = router;
