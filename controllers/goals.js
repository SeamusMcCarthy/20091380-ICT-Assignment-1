'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts');
const uuid = require('uuid');

const goalStore = require('../models/goal-store');
const memberStore = require('../models/member-store');
const assessmentStore = require('../models/assessment-store');

const goal = {

  addGoal(request, response) {

    const loggedInMember = accounts.getCurrentMember(request);
    const newGoal = request.body;
    newGoal.id = uuid.v1();
    newGoal.memberid = loggedInMember.id;
    newGoal.status = 'Open';
    newGoal.weight = Number(request.body.weight);
    goalStore.addGoal(newGoal);
    memberStore.incrementNumGoals(loggedInMember.id);
    // Set flag so that 'Open Goal' popup appears when dashboard is displayed
    response.cookie('popup','Y');
    response.redirect('/dashboard');

  },

  addGoalTrainer(request, response) {

    const member = memberStore.getMemberById(request.params.id);
    const newGoal = request.body;
    newGoal.id = uuid.v1();
    newGoal.memberid = member.id;
    newGoal.status = 'Open';
    goalStore.addGoal(newGoal);
    memberStore.incrementNumGoals(member.id);
    response.redirect('/dashboard');

  },

  deleteGoal(request, response) {

    const memberid = request.params.memberid;
    const goalId = request.params.id;
    logger.info(`Deleting Goal ${memberid} ' + ' ${goalId}`);
    goalStore.removeGoal(goalId);
    memberStore.decrementNumGoals(memberid);
    // Set flag so that 'Open Goal' popup appears when dashboard is displayed
    response.cookie('popup','Y');
    response.redirect('/dashboard');

  },

  assessGoalStatuses(memberid) {
    const goals = goalStore.getMemberGoalsByStatus(memberid, 'Open');
    const latestWeight = assessmentStore.getLatestWeight(memberid);

    // Establish current date and set time to 00:00:00:00 as we want the target date to have completely passed
    // before we set the status as 'Missed'
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    for (let i = 0; i < goals.length; i++) {
      const goal = goals[i];
      const goalDate = new Date(goal.date);
      if (Date.parse(date) > Date.parse(goalDate)) {
        goalStore.updateMissed(goal.id);
      }
      else {
        if (goal.status === 'Open') {
          if (latestWeight <= goal.weight) {
            goalStore.updateAchieved(goal.id);
          }
        }
      }
    }
  }
}

module.exports = goal;