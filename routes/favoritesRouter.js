const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authenticate = require('../authenticate')
const cors = require('./cors')

const Dishes = require('../models/dishes')

const Favorites = require('../models/favorites')

const favoritesRouter = express.Router()

favoritesRouter.use(bodyParser.json())

favoritesRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                let fav;
                if (favorites === null) {
                    fav = new Favorites({ user: req.user._id });
                }
                else {
                    fav = favorites;
                }
                for (let i = 0; i < req.body.length; i++) {
                    if (!fav.dishes.some(e => e._id.toString() === req.body[i]._id.toString())) {
                        fav.dishes.push(req.body[i]._id);
                    }
                }
                fav.save();
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(fav);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.remove({ user: req.user._id })
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

favoritesRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                let foundDish = false;
                if (favorites) {
                    for (let i = 0; i < favorites.dishes.length; i++) {
                        if (favorites.dishes[i]._id.toString() === req.params.dishId.toString()) {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorites.dishes[i]);
                            foundDish = true;
                            break;
                        }
                    }
                    if (!foundDish) {
                        err = new Error('Favorite dish ' + req.params.dishId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }
                else {
                    err = new Error('Favorite dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    Favorites.findOne({ user: req.user._id })
                    .populate('user')
                    .populate('dishes')
                    .then((favorites) => {
                        let fav;
                        if (favorites === null) {
                            fav = new Favorites({ user: req.user._id });
                        }
                        else {
                            fav = favorites;
                        }
                        if (!fav.dishes.some(e => e._id.toString() === req.params.dishId.toString())) {
                            fav.dishes.push(req.params.dishId);
                        }
                        fav.save();
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(fav);
                    }, (err) => next(err))
                    .catch((err) => next(err));
                }
                else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            })
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites/' + req.params.dishId);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
        .populate('user')
        .populate('dishes')
        .then((favorites) => {
            let foundDish = false;
            if (favorites) {
                for (let i = 0; i < favorites.dishes.length; i++) {
                    if (favorites.dishes[i]._id.toString() === req.params.dishId.toString()) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        favorites.dishes.splice(i, 1);
                        favorites.save();
                        res.json("Dish " + req.params.dishId + " removed from favorites");
                        foundDish = true;
                        break;
                    }
                }
                if (!foundDish) {
                    err = new Error('Favorite dish ' + req.params.dishId + ' not found... So it can\'t be deleted');
                    err.status = 404;
                    return next(err);
                }
            }
            else {
                err = new Error('Favorite dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
    })

module.exports = favoritesRouter;