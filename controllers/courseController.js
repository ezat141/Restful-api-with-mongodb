const {validationResult} = require('express-validator');
const Course = require('../models/courseModel');
const httpStatusText = require('../utils/httpStatusText');
const asyncWrapper = require('../middleware/asyncWrapper');
const appError = require('../utils/appError');

// Controller methods
const courseController = {
    getAllCourses: asyncWrapper( async (req, res) => {
        const query = req.query;
        const limit = query.limit || 10;
        const page = query.page || 1;
        const skip = (page -1) * limit;


        const courses = await Course.find({}, {"__v": false}).limit(limit).skip(skip);
        res.json({status: httpStatusText.SUCCESS, data: {courses}});
            
        //  catch (error) {
        //     res.status(500).json({message: error.message});
            
        // }
    }),

    getCourse: asyncWrapper( async (req, res, next) => {
        const id = req.params.id;
        const course = await Course.findById(id);
        if(!course){
            const error = appError.create('course not found', 404, httpStatusText.FAIL);
            return next(error);
        }
        return res.json({status: httpStatusText.SUCCESS, data:{course}});


    }),
    
    addCourse: asyncWrapper(async(req, res, next) =>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
            return next(error);
        }
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).json({status: httpStatusText.SUCCESS, data: {course: newCourse}});

    }),

    updateCourse: asyncWrapper(async(req, res) =>{
        const courseId = req.params.id;
        const  updatedCourse = await Course.updateOne({__id: courseId},{$set : {...req.body}});
        return res.status(200).json({status: httpStatusText.SUCCESS, data:{course:  updatedCourse}});
    }),

    deleteCourse: asyncWrapper(async(req, res) =>{
        const courseId = req.params.id;
        const deletedCourse = await Course.deleteOne({__id: courseId});
        return res.status(200).json({status: httpStatusText.SUCCESS, data: null});
    }),
};

module.exports = courseController;