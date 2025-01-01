'use strict';

const MovieModel = require('../models/MovieModels');
const dotenv = require('dotenv');
dotenv.config();
const axios = require('axios');
const {
    errors
} = require('../ResponseStruct/ErrorCode');

var that = module.exports = {
    uploadMovie : async({
        isAdmin = null,
        movieData = null
    }) => {
        if(isAdmin)  {
            try {
                const newMovie = MovieModel(movieData);
                const movieSlug = movieData.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9 -]/g, '').trim().replace(/\s+/g, '-').toLowerCase(); 
                newMovie.Slug = movieSlug;
                await newMovie.save();
                return 1;
            } catch(err) {
                throw errors.CREATE_MOVIE_FAILED.getError();
            }
        } else {
            throw errors.FORBIDDEN.getError();
        }
    },
    updateMovie : async({
        id = null,
        movieData = null
    }) => {
        try {
            const updateMovie = await MovieModel.findByIdAndUpdate(
                id,
                { $set : movieData }, 
                { new : true}
            )
            return updateMovie;
        } catch(err) {
            throw errors.UPDATE_MOVIE_FAILED.getError();
        }
    },
    findMovieById: async({
        id = null
    }) => {
        try {
            const movie = await MovieModel.findById(id);
            return movie;
        } catch(err) {
            throw errors.MOVIE_NOT_FOUND.getError();
        }
    },
    deleteMovie: async({
        isAdmin = null,
        id = null
    }) => {
        if(isAdmin) {
            try {
                const movie = await MovieModel.findByIdAndDelete(id);
                return 1;
            } catch(err) {
                throw errors.MOVIE_NOT_FOUND.getError();
            }
        } else {
            throw errors.FORBIDDEN.getError();
        }
    },
    findMovieBySlug: async({
        Slug = null
    }) => {
        try {
            const movie = await MovieModel.findOne({
                Slug: Slug
            })
            return movie
        } catch(err) {
            throw errors.MOVIE_NOT_FOUND.getError();
        }
    },

    randomMovie: async({
        type = null
    }) => {
        try {
            let movie;
            if (type === "series") {
                movie = await MovieModel.aggregate([
                    { $match: { isSeries: true } },
                    { $sample: { size: 3 } },
                ]);
            } else {
                movie = await MovieModel.aggregate([
                    { $match: { isSeries: false } },
                    { $sample: { size: 3 } },
                ]);
            }
            return movie;
        } catch(err) {
            throw errors.RANDOM_MOVIE_FAILED.getError();
        }   
    },

    getAllMovie: async() => {
        try {
            const movie = await MovieModel.find();
            return movie.reverse();
        } catch(err) {
            throw errors.GET_ALL_MOVIE_FAILED.getError();
        }
    },

    catalogMovie: async({
        isSeriesQuery = null,
        genreQuery = null
    }) => {
        let list = [];
        try {
            if (isSeriesQuery === "true") {
                if (genreQuery) {
                    list = await MovieModel.aggregate([
                        {
                            $match: {
                                isSeries: true,
                                genre: genreQuery,
                            }
                        },
                    ]);
                }
                else {
                    list = await MovieModel.aggregate([
                        {
                            $match: {
                                isSeries: true,
                            }
                        },
                    ])
                }
            }
            else {
                if (genreQuery) {
                    list = await MovieModel.aggregate([
                        {
                            $match: {
                                isSeries: false,
                                genre: genreQuery,
                            }
                        }
                    ])
                }
                else {
                    list = await MovieModel.aggregate([
    
                        { $match: { isSeries: false } },
                    ]);
                }
            }
            return list;
        } catch(err) {
            console.error(err);
            throw errors.GET_CATALOG_MOVIE_FAILED.getError();
        }
    },
    
    

    popularMovie: async({
        ratings = null,
        movies = null
    }) => {
        
       try {
            const movieStats = {};
            ratings.forEach(({ movieId, rating }) => {
            if (!movieStats[movieId]) {
                movieStats[movieId] = { totalRatings: 0, sumRatings: 0 };
            }
            movieStats[movieId].totalRatings++;
            movieStats[movieId].sumRatings += rating;
            });
            
            const movieInfo = movies.map((movie) => {
            const stats = movieStats[movie.movieId] || { totalRatings: 0, sumRatings: 0 };
            const averageRating = stats.totalRatings > 0 ? (stats.sumRatings / stats.totalRatings).toFixed(1) : 0;
            return movie._id;
            });
            
            const Movies = movieInfo
            .sort((a, b) => b.totalRatings - a.totalRatings)
            .slice(0, 10);
            return Movies;
 
       } catch(err) {
            throw errors.GET_POPULAR_MOVIE_FAILED.getError();
       }
    },

    getInfoMovie : async() => {
        try {
            const movies = await MovieModel.aggregate([
                {
                    $project: {
                        movieId: "$_id",
                        title: "$title",
                        genre: "$genre"
                    }
                }
            ])
            return movies;
        } catch(err) {
            throw errors.GET_MOVIES_INGO_FAILED.getError();
        }
    },

    getMovieMostView: async() => {
        try {
            const movies = await MovieModel.find().sort({
                View: -1
            }).limit(10);
            return movies;
        } catch(err) {
            throw errors.GET_MOST_VIEW_MOVIE_FAILED.getError();
        }
    },

    postComment: async({
        movieID = null,
        email = null,
        comment = null
    }) => {
        try {
            const beforeComment = await MovieModel.findById(movieID);
            const newComment = {
                email: email,
                comment: comment,
                timestamp: new Date()
            }
            const afterComment = [...beforeComment.Comment, newComment]
            const comments = await MovieModel.findByIdAndUpdate(
                movieID,
                {Comment : afterComment},
                {new: true}
            )
            console.log(comment);
            return comments
        } catch(err) {
            throw errors.POST_COMMENT_FAILED.getError();
        }
    },

    getComment: async({
        movieID = null
    }) => {
        try {
            
            const Movies = await MovieModel.findById(movieID);
            return Movies.Comment;
        } catch(err) {
            throw errors.GET_COMMENT_FAILED.getError();
        }
    },

    searchDocuments : async({
        movie_title = null
    }) => {
        try {
            console.log(movie_title);
            const query = {
                query: {
                  multi_match: {
                    query: movie_title,
                    fields: ["title", "description"],
                    type: "phrase_prefix"
                  }
                },
                sort: [
                  {
                    createdAt: {
                      order: "desc"
                    }
                  }
                ],
                _source: {
                  includes: ["mongo_id"]
                },
                size: 3
              };
              const result = await axios.post(
                `http://${process.env.ELASTIC_SEARCH_HOST}:${process.env.ELASTIC_SEARCH_PORT}/movies/_doc/_search`,query
              )
              return result.data.hits
        } catch(err) {
            throw errors.ELASTIC_SEARCH_FIND_FAILED.getError();
        }
    }


    
}