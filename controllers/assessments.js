"use strict";

const logger = require('../utils/logger');
const assessmentStore = require('../models/assessment-store.js');
const memberStore = require('../models/member-store.js');
const accounts = require('./accounts.js');
const uuid = require('uuid');

const assessment = {
  index(request, response) {
    const assessmentId = request.params.id;
    logger.info('Assessment id = ' + assessmentId);
    const viewData = {
      title: 'Assessments',
      assessment: assessmentStore.getAssessment(assessmentId),
    };
    response.render('assessment', viewData);
  },

  addAssessment(request, response) {
    const loggedInMember = accounts.getCurrentMember(request);
    const newAssessment = request.body;
    newAssessment.id = uuid.v1();
    newAssessment.memberid = loggedInMember.id;
    newAssessment.date = new Date().toUTCString();
    newAssessment.comment = '';
    const latestWeight = assessmentStore.getLatestWeight(loggedInMember.id);
    const newWeight = request.body.weight;
    if (newWeight > latestWeight)
      newAssessment.trend = "Up";
    else if (newWeight < latestWeight)
      newAssessment.trend = "Down";
    else
      newAssessment.trend = "Equal";
    assessmentStore.addAssessment(newAssessment);
    memberStore.incrementNumAssessments(loggedInMember.id);
    response.redirect('/dashboard');
  },

  deleteAssessment(request, response) {
    const memberid = request.params.memberid;
    const assessmentId = request.params.id;
    logger.info(`Deleting Assessment ${memberid} ' + ' ${assessmentId}`);
    assessmentStore.removeAssessment(assessmentId);
    memberStore.decrementNumAssessments(memberid);
    response.redirect('/dashboard');
  },

  editcomment(request, response) {
    const comment = request.body;
    comment.id = request.params.id;
    assessmentStore.editcomment(comment);
    response.redirect('/dashboard')
  },

};

module.exports = assessment;