'use strict';

const logger = require('../utils/logger');

const accounts = require ('./accounts');
const goalsCont = require('./goals');
const analytics = require('../utils/analytics');

const assessmentStore = require('../models/assessment-store');
const goalStore = require('../models/goal-store');
const memberStore = require('../models/member-store');

const dashboard = {

  checkIndex(request, response) {

      // Direct flow to the appropriate dashboard
      if (request.cookies.memberid !== '')
        response.redirect('memberindex');
      else if (request.cookies.trainerid !== '')
        response.redirect('trainerindex');

  },

  memberIndex(request, response) {

    const loggedInMember = accounts.getCurrentMember(request);
    const latestWeight = assessmentStore.getLatestWeight(loggedInMember.id);

    // Assess the user's open goals in case the status of any needs to be updated
    // This is done in case any goal target dates have passed since the user last logged in
    // or where statuses are affected by the most recent assessment entry
    goalsCont.assessGoalStatuses(loggedInMember.id);
    const goals = goalStore.getMemberGoals(loggedInMember.id).reverse();

    // Retrieve num of goals by status
    const numOpenGoals = goalStore.getMemberGoalsByStatus(loggedInMember.id, 'Open').length;
    const numMissedGoals = goalStore.getMemberGoalsByStatus(loggedInMember.id, 'Missed').length;
    const numAchievedGoals = goalStore.getMemberGoalsByStatus(loggedInMember.id, 'Achieved').length;

    // Check if open goals popup needs to be displayed after login, goal added or goal deleted
    const displayPopup = request.cookies.popup;

    // Set popup cookie to not display again until goal added or deleted
    response.cookie('popup','');

    // Build data for view
    const viewData = {
      title: 'Member Dashboard',
      assessments: assessmentStore.getMemberAssessments(loggedInMember.id).reverse(),
      goals: goals,
      name: loggedInMember.name,
      latestweight: latestWeight,
      BMI: analytics.calculateBMI(loggedInMember.id).toFixed(2),
      BMICategory: analytics.determineBMICategory(analytics.calculateBMI(loggedInMember.id).toFixed(2)),
      isidealbodyweight: analytics.isIdealBodyWeight(loggedInMember.id),
      numOpenGoals: numOpenGoals,
      numMissedGoals: numMissedGoals,
      numAchievedGoals: numAchievedGoals,
      displayPopup: displayPopup
    };
    response.render('dashboard', viewData);

  },

  trainerIndex(request, response) {

    logger.info('trainerdashboard rendering');
    const viewData = {
      title: 'Trainer Dashboard',
      members: memberStore.getAllMembers(),
    };
    response.render('trainerdashboard', viewData);

  },

  trainerAssessments(request, response) {

    const latestWeight = assessmentStore.getLatestWeight(request.params.id);
    const assessments = assessmentStore.getMemberAssessments(request.params.id).reverse();

    // Assess the member's open goals in case the status of any needs to be updated
    // This is done in case any goal target dates have passed since the user last logged in
    goalsCont.assessGoalStatuses(request.params.id);
    const goals = goalStore.getMemberGoals(request.params.id).reverse();

    const viewData = {
      title: 'Trainer Dashboard',
      assessments: assessments,
      goals: goals,
      memberid: request.params.id
    };
    response.render('trainerassessment', viewData);

  }
};

module.exports = dashboard;
