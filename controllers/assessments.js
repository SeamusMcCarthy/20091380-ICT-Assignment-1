"use strict";

const logger = require('../utils/logger');
const uuid = require('uuid');

const accounts = require('./accounts');
const assessmentStore = require('../models/assessment-store');
const memberStore = require('../models/member-store');


const assessment = {

  addAssessment(request, response) {

    const loggedInMember = accounts.getCurrentMember(request);
    const latestWeight = assessmentStore.getLatestWeight(loggedInMember.id);
    const newWeight = Number(request.body.weight);

    const newAssessment = request.body;
    newAssessment.id = uuid.v1();
    newAssessment.memberid = loggedInMember.id;
    newAssessment.date = new Date().toUTCString();
    newAssessment.comment = '';
    newAssessment.weight = newWeight;
    newAssessment.chest = Number(request.body.chest);
    newAssessment.thigh = Number(request.body.thigh);
    newAssessment.upperarm = Number(request.body.upperarm);
    newAssessment.waist = Number(request.body.waist);
    newAssessment.hips = Number(request.body.hips);

    // Determine weight trend by comparing new assessment weight to previous assessment weight
    if (newWeight > latestWeight)
      newAssessment.trend = "Up";
    else if (newWeight < latestWeight)
      newAssessment.trend = "Down";
    else
      newAssessment.trend = "Equal";

    // Add assessment & update number of recorded assessments
    assessmentStore.addAssessment(newAssessment);
    memberStore.updateNumAssessments(loggedInMember.id, assessmentStore.getMemberAssessments(loggedInMember.id).length);
    response.redirect('/dashboard');

  },

  deleteAssessment(request, response) {

    const memberid = request.params.memberid;
    const assessmentId = request.params.id;
    logger.info(`Deleting Assessment ${memberid} ' + ' ${assessmentId}`);
    assessmentStore.removeAssessment(assessmentId);
    const assessments = assessmentStore.getMemberAssessments(memberid);

    // Update the number of assessments stored against this member
    memberStore.updateNumAssessments(memberid, assessments.length);

    // Removal of assessments can impact trending so re-evaluate all remaining entries and update trend indicators
    const member = memberStore.getMemberById(memberid);
    for (let x = 0; x < assessments.length; x++) {
      if (x === 0) {
        if (assessments[x].weight > member.startingweight)
          assessmentStore.updateTrend(assessments[x].id, "Up");
        if (assessments[x].weight < member.startingweight)
          assessmentStore.updateTrend(assessments[x].id, "Down");
        if (assessments[x].weight === member.startingweight)
          assessmentStore.updateTrend(assessments[x].id, "Equal");
      } else {
          if (assessments[x].weight > assessments[x - 1].weight)
            assessmentStore.updateTrend(assessments[x].id, "Up");
          if (assessments[x].weight < assessments[x - 1].weight)
            assessmentStore.updateTrend(assessments[x].id, "Down");
          if (assessments[x].weight === assessments[x - 1].weight)
            assessmentStore.updateTrend(assessments[x].id, "Equal");
      }
    }
    response.redirect('/dashboard');

  },

  editComment(request, response) {

    const comment = request.body;
    comment.id = request.params.id;
    assessmentStore.editComment(comment);
    response.redirect('/dashboard')

  },

};

module.exports = assessment;