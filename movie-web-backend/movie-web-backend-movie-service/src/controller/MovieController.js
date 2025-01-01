'use strict';

const {
    CREATED, OK
} = require('../ResponseStruct/SuccessReponse');

const {
    uploadMovie,
    updateMovie,
    findMovieById,
    findMovieBySlug,
    deleteMovie,
    randomMovie,
    getAllMovie,
    catalogMovie,
    popularMovie,
    getInfoMovie,
    getMovieMostView,
    postComment,
    getComment,
    searchDocuments
} = require('../services/MovieServices');

var that = module.exports = {
    uploadMovie: async(req, res , next) => {
        try {
            const response = await uploadMovie({
                isAdmin: req.user.isAdmin,
                movieData: req.body
            })
            return new CREATED({
                message: 'Create new Movie Successfully',
                result: response
            }).send(res);

        } catch(err) {
            console.log(err);
            next(err);
        }
    },
    updateMovie: async(req, res, next) => {
        try {
            const response = await updateMovie({
                id: req.params.id,
                movieData: req.body
            })
            return new OK({
                message: 'Update movie successfully',
                result: response
            }).send(res);
        } catch(err) {
            console.log(err);
            next(err);
        }
    },
    findMovieById: async(req, res, next) => {
        try {
            console.log(1111);
            const response = await findMovieById({
                id: req.params.id
            })
            return new OK({
                message: 'Find movie Successfully',
                result: response
            }).send(res);
        } catch(err) {
            next(err);
        }
    },
    deleteMovie : async(req, res, next) => {
        try {
            const response = await deleteMovie({
                isAdmin : req.user.isAdmin,
                id : req.params.id
            }) 
            return new OK({
                message: 'Delete movie successfully',
                result: response
            }).send(res);
        } catch(err) {
            next(err);
        }
    },
    
    findMovieBySlug: async(req, res, next) => {
        try {
            const response = await findMovieBySlug({
                Slug: req.params.Slug
            })
            return new OK({
                message: 'Find movie Successfully',
                result: response
            }).send(res);
        } catch(err) {
            next(err);
        }
    },

    randomMovie: async(req, res, next) => {
        try {
            const response = await randomMovie({
                type: req.query.type
            });
            return new OK({
                message: 'Get random movie successfully',
                result: response
            }).send(res);
        } catch(err) {
            next(err);
        }
    },

    getAllMovie: async(req, res, next) => {
        try {
            const response = await getAllMovie();
            return new OK({
                message: 'Get all movie successfully',
                result: response
            }).send(res);
        } catch(err) {
            next(err);
        }
    },
    
    catalogMovie: async(req, res, next) => {
        try {
            const response = await catalogMovie({
                isSeriesQuery : req.query.isSeries,
                genreQuery : req.query.genre
            })
            return new OK({
                message: 'Get catalog movie successfully',
                result: response
            }).send(res)
        } catch(err) {
            next(err);
        }
    },

    popularMovie : async(req, res, next) => {
        try {
            const response = await popularMovie({
                ratings: req.body.ratings,
                movies: req.body.movies
            })
            return new OK({
                message: 'Get Popular Movies Successfully',
                result: response
            }).send(res);
        } catch(err) {
            next(err);
        }
    },

    getMovieInfo : async(req, res, next) => {
        try {
            const response = await getInfoMovie();
            return new OK({
                message: 'Get Info Movie Successfully',
                result: response
            }).send(res);
        } catch(err) {
            next(err);
        }
    },

    getMovieMostView: async(req, res, next) => {
        try {
            const response = await getMovieMostView();
            return new OK({
                message: 'Get movie most view successfully',
                result: response
            }).send(res);
        } catch(err) {
            next(err);
        }
    },
    postComment: async(req, res, next) => {
        try {   
            const response = await postComment(
                {
                    movieID: req.params.id,
                    comment: req.body.comment,
                    email: req.body.email
                }
            )
            return new OK({
                message: 'Post new Comment successfully',
                result: response
            }).send(res);
        } catch(err){
            next(err);
        }
    },

    getComment: async(req, res, next) => {
        try {   
            const response = await getComment(
                {
                    movieID: req.params.id
                }
            )
            return new OK({
                message: 'Get Comment successfully',
                result: response
            }).send(res);
        } catch(err){
            next(err);
        }
    },

    searchDocuments: async(req, res, next) => {
        try {
            console.log(req.query);
            const response = await searchDocuments({
                movie_title: req.query.movie_title
            })
            return new OK({
                message: 'Find Document Successfully',
                result: response
            }).send(res);
        } catch(err) {
            next(err);
        }
    }

    

    
}