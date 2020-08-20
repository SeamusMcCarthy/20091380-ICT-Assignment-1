'use strict';

const logger = require('../utils/logger');

const accounts = require ('./accounts');
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
    const goals = goalStore.getMemberGoals(loggedInMember.id);

    // As user has just logged in, assess their open goals in case the status of any needs to be updated
    // This is done in case any goal target dates have passed since the user last logged in
    for (let i = 0; i < goals.length; i++) {
      const goal = goals[i];
      if (goal.status === 'Open') {
        if (latestWeight <= goal.weight) {
          goalStore.updateAchieved(goal.id);
        } else {
          const date = new Date();
          // Set time to 00:00:00:00 as we want the target date to have completely passed before we set as 'Missed'
          date.setHours(0, 0, 0, 0);
          const goalDate = new Date(goal.date);
          if (Date.parse(date) > Date.parse(goalDate))
            goalStore.updateMissed(goal.id);
        }
      }
    }

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
      goals: goalStore.getMemberGoals(loggedInMember.id).reverse(),
      name: loggedInMember.name,
      latestweight: assessmentStore.getLatestWeight(loggedInMember.id),
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
    const goals = goalStore.getMemberGoals(request.params.id).reverse();
    const assessments = assessmentStore.getMemberAssessments(request.params.id).reverse();

    // As trainer has just selected the member, assess their open goals in case the status needs to be updated
    for (let i = 0; i < goals.length; i++) {
      const goal = goals[i];
      if (goal.status === 'Open') {
        if (Number(latestWeight) <= Number(goal.weight)) {
          logger.info('weights = ' + latestWeight + ' ' + goal.weight);
          goalStore.updateAchieved(goal.id);
        }
        else {
          const date = new Date();
          // Set time to 00:00:00:00 as we want the target date to have completely passed before we set as 'Missed'
          date.setHours(0, 0, 0, 0);
          const goalDate = new Date(goal.date);
          if (Date.parse(date) > Date.parse(goalDate))
            goalStore.updateMissed(goal.id);
        }
      }
    }
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
