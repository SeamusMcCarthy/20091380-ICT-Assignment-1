"use strict";

const uuid = require('uuid');
const accounts = require ('./accounts.js');
const logger = require("../utils/logger");
const analytics = require('../utils/analytics');
const assessmentStore = require('../models/assessment-store');
const goalStore = require('../models/goal-store');
const memberStore = require('../models/member-store');

const dashboard = {

  checkindex(request, response) {
    let value1 = request.cookies.memberid;
    let value2 = request.cookies.trainerid;
      if (request.cookies.memberid != '')
        response.redirect('memberindex');
      else if (request.cookies.trainerid != '')
        response.redirect('trainerindex');
  },

  memberindex(request, response) {
    const loggedInMember = accounts.getCurrentMember(request);
    const latestWeight = assessmentStore.getLatestWeight(loggedInMember.id);
    const goals = goalStore.getMemberGoals(loggedInMember.id);

    // As user has just logged in, assess their open goals
    // If current weight is less than target, mark as 'Achieved'
    // If date has passed, mark as 'Missed'
    // Otherwise, leave 'Open'
    for (let i = 0; i < goals.length; i++) {
      const goal = goals[i];
      if (goal.status === "Open") {
        if (Number(latestWeight) <= Number(goal.weight)) {
          logger.info("weights = " + latestWeight + " " + goal.weight);
          goalStore.updateAchieved(goal.id);
        }
        else {
          const date = new Date();
          const goalDate = new Date(goal.date);
          if (date > goalDate)
            goalStore.updateMissed(goal.id);
        }
      }
    }

    const numOpenGoals = goalStore.getMemberGoalsByStatus(loggedInMember.id, "Open").length;
    const numMissedGoals = goalStore.getMemberGoalsByStatus(loggedInMember.id, "Missed").length;
    const numAchievedGoals = goalStore.getMemberGoalsByStatus(loggedInMember.id, "Achieved").length;
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
      goalsArray: [numOpenGoals, numMissedGoals, numAchievedGoals]
    };
    response.render('dashboard', viewData);
  },

  trainerindex(request, response) {
    logger.info('trainerdashboard rendering');
    const viewData = {
      title: 'Trainer Dashboard',
      members: memberStore.getAllMembers(),
    };
    response.render('trainerdashboard', viewData);
  },

  trainerassessments(request, response) {
    const viewData = {
      title: 'Trainer Dashboard',
      assessments: assessmentStore.getMemberAssessments(request.params.id),
      goals: goalStore.getMemberGoals(request.params.id),
      memberid: request.params.id
    };
    response.render('trainerassessment', viewData);
  }
};

module.exports = dashboard;
