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
    const assessments = assessmentStore.getMemberAssessments(memberid);
    const member = memberStore.getMemberById(memberid);
    // Removal of assessments can impact trending so re-evaluate all remaining entries and update trend indicator
    for (let x = 0; x < assessments.length; x++) {
      if (x === 0) {
        if (assessments[x].weight > member.startingweight)
          assessmentStore.updatetrend(assessments[x].id, "Up");
        if (assessments[x].weight < member.startingweight)
          assessmentStore.updatetrend(assessments[x].id, "Down");
        if (assessments[x].weight === member.startingweight)
          assessmentStore.updatetrend(assessments[x].id, "Equal");
      } else {
          if (assessments[x].weight > assessments[x - 1].weight)
            assessmentStore.updatetrend(assessments[x].id, "Up");
          if (assessments[x].weight < assessments[x - 1].weight)
            assessmentStore.updatetrend(assessments[x].id, "Down");
          if (assessments[x].weight === assessments[x - 1].weight)
            assessmentStore.updatetrend(assessments[x].id, "Equal");
      }
    }
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