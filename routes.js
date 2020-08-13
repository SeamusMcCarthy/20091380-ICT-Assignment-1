"use strict";

const express = require("express");
const router = express.Router();

const accounts = require('./controllers/accounts.js');
const assessments = require('./controllers/assessments.js');
const goals = require('./controllers/goals.js');
const dashboard = require("./controllers/dashboard.js");
const about = require("./controllers/about.js");
const profile = require("./controllers/profile.js");

router.get('/', accounts.index);
router.get("/about", about.index);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);
router.get('/profile', profile.index);

router.get("/dashboard", dashboard.checkIndex);
router.get('/memberindex', dashboard.memberIndex);
router.get('/trainerindex', dashboard.trainerIndex);


router.get('/member/:id', dashboard.trainerAssessments);
router.get('/deletemember/:id', accounts.deleteMember);
router.get('/deleteassessment/:memberid/:id', assessments.deleteAssessment);
router.get('/deletegoal/:memberid/:id', goals.deleteGoal);

router.post('/dashboard/addassessment', assessments.addAssessment);
router.post('/dashboard/addgoal', goals.addGoal);
router.post('/dashboard/addgoal/:id', goals.addGoalTrainer);
router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);
router.post('/updatemember', profile.updateProfile);
router.post('/editcomment/:id', assessments.editComment);

module.exports = router;
