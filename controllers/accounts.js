'use strict';

const logger = require('../utils/logger');
const uuid = require('uuid');

const memberStore = require('../models/member-store');
const trainerStore = require('../models/trainer-store');
const assessmentStore = require('../models/assessment-store');
const goalStore = require('../models/goal-store');


const accounts = {

  index(request, response) {

    logger.info('Rendering Index');

    // Clear cookies in case session was abandoned without logging out.
    response.cookie('memberid', '');
    response.cookie('trainerid','');
    response.cookie('popup','');

    const viewData = {
      title: 'Login or Signup',
    };
    response.render('index', viewData);

  },

  login(request, response) {

    const viewData = {
      title: 'Login to the Service',
    };
    response.render('login', viewData);

  },

  logout(request, response) {

    // Clear down cookies on exit
    response.cookie('memberid', '');
    response.cookie('trainerid','');
    response.cookie('popup','');
    response.redirect('/');

  },

  signup(request, response) {

    const viewData = {
      title: 'Login to the Service',
    };
    response.render('signup', viewData);

  },

  register(request, response) {

    // Create the member
    const member = request.body;
    member.id = uuid.v1();
    member.numassessments = 0;
    member.numgoals = 0;
    member.email = request.body.email.toLowerCase();
    member.height = Number(request.body.height);
    member.startingweight = Number(request.body.startingweight);

    // Ensure the email address is not already in use. If so, return to main page but record in logger
    if (memberStore.getMemberByEmail(member.email)) {
      logger.info('This email address is already in use - Please try again!');
    } else {
      memberStore.addMember(member);
      logger.info(`registering ${member.email}`);
    }
    response.redirect('/');

  },

  authenticate(request, response) {

    // Attempt to login a member. If not found, try trainer
    const member = memberStore.getMemberByEmail(request.body.email.toLowerCase());
    if (member && request.body.password === member.password) {
      logger.info(`logging in ${member.email}`);
      response.cookie('memberid', member.email);
      response.cookie('popup','Y');
      response.redirect('/dashboard');
    }
    else {
      const trainer = trainerStore.getTrainerByEmail(request.body.email.toLowerCase());
      if (trainer && request.body.password === trainer.password) {
        logger.info(`logging in ${trainer.email}`);
        response.cookie('trainerid', trainer.email);
        response.redirect('/dashboard');
      }
      else {
        response.redirect('/login');
      }
    }
  },

  getCurrentMember(request) {

    // Retrieve the email address cookie and use to find member
    const memberEmail = request.cookies.memberid;
    const member = memberStore.getMemberByEmail(memberEmail);
    return memberStore.getMemberByEmail(memberEmail);

  },

  deleteMember(request, response) {

    const memberid = request.params.id;

    // Remove assessment data
    const memberAssessments = assessmentStore.getMemberAssessments(memberid);
    for (let x = 0; x < memberAssessments.length; x++) {
      const assessmentID = memberAssessments[x].id;
      assessmentStore.removeAssessment(assessmentID);
    }

    // Remove goals data
    const memberGoals = goalStore.getMemberGoals(memberid);
    for (let x = 0; x < memberGoals.length; x++) {
      const goalID = memberGoals[x].id;
      goalStore.removeGoal(goalID);
    }

    // Remove member data
    memberStore.removeMember(memberid);
    response.redirect('/dashboard');

  },
};

module.exports = accounts;