"use strict";

const memberstore = require('../models/member-store.js');
const trainerstore = require('../models/trainer-store.js');
const logger = require('../utils/logger.js');
const uuid = require('uuid');

const accounts = {
  index(request, response) {
    // Clear cookies in case session was abandoned without logging out.
    response.cookie('memberid', '');
    response.cookie('trainerid','');
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
    response.cookie('memberid', '');
    response.cookie('trainerid','');
    response.redirect('/');
  },

  signup(request, response) {
    const viewData = {
      title: 'Login to the Service',
    };
    response.render('signup', viewData);
  },

  register(request, response) {
    const member = request.body;
    member.id = uuid.v1();
    member.numassignments = 0;
    member.numgoals = 0;
    member.email = request.body.email.toLowerCase();

    if (memberstore.getMemberByEmail(member.email)) {
      logger.info("This email address is already in use - Please try again!");
    } else {
      memberstore.addMember(member);
      logger.info(`registering ${member.email}`);
    }
    response.redirect('/');
  },

  authenticate(request, response) {
    const member = memberstore.getMemberByEmail(request.body.email.toLowerCase());
    if (member && request.body.password === member.password) {
      logger.info(`logging in ${member.email}`);
      response.cookie('memberid', member.email);
      response.redirect('/dashboard');
    }
    else {
      const trainer = trainerstore.getTrainerByEmail(request.body.email.toLowerCase());
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
    const memberEmail = request.cookies.memberid;
    const member = memberstore.getMemberByEmail(memberEmail);
    return memberstore.getMemberByEmail(memberEmail);
  },

  deleteMember(request, response) {
    const memberid = request.params.id;
    // Remove assessment data
    const memberAssessments = assessmentStore.getMemberAssessments(memberid);
    for (let x = 0; x < memberAssessments.length; x++) {
      const assessmentID = memberAssessments[x].id;
      logger.info("Assessment id = " + assessmentID);
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