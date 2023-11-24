// Create web server

// Import Express
const express = require('express');

// Import Express Router
const router = express.Router();

// Import comment model
const Comment = require('../models/comment');

// Import auth middleware
const auth = require('../middleware/auth');

// Import admin middleware
const admin = require('../middleware/admin');

// Import error middleware
const error = require('../middleware/error');

// Import Joi validation
const Joi = require('joi');

// Import lodash
const _ = require('lodash');

// GET request
router.get('/', async (req, res, next) => {
    try {
        const comments = await Comment.find().sort({ date: -1 });
        res.send(comments);
    } catch (error) {
        next(error);
    }
});

// GET request by ID
router.get('/:id', async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).send('Comment with given ID was not found');
        res.send(comment);
    } catch (error) {
        next(error);
    }
});

// POST request
router.post('/', auth, async (req, res, next) => {
    try {
        const { error } = validateComment(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const comment = new Comment(_.pick(req.body, ['name', 'email', 'comment']));
        await comment.save();

        res.send(comment);
    } catch (error) {
        next(error);
    }
});

// PUT request
router.put('/:id', auth, async (req, res, next) => {
    try {
        const { error } = validateComment(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const comment = await Comment.findByIdAndUpdate(req.params.id, _.pick(req.body, ['name', 'email', 'comment']), { new: true });
        if (!comment) return res.status(404).send('Comment with given ID was not found');

        res.send(comment);
    } catch (error) {
        next(error);
    }
});

// DELETE request
router.delete('/:id', [auth, admin], async (req, res, next) => {
    try {
        const comment = await Comment.findByIdAndRemove(req.params.id);
        if (!comment) return res.status(404).send('Comment with given ID was not found');
        res.send(comment);
    } catch (error) {
        next(error);
    }
// Closing bracket for the router.delete() route handler
});
