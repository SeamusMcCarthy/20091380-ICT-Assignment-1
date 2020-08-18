'use strict';

const _ = require('lodash');

const JsonStore = require('./json-store');
const memberStore = require('./member-store');
const assessmentStore = {

  store: new JsonStore('./models/assessment-store.json', { assessmentCollection: [] }),
  collection: 'assessmentCollection',

  getAllAssessments() {
    return this.store.findAll(this.collection);
  },

  getAssessment(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  addAssessment(assessment) {
    this.store.add(this.collection, assessment);
    this.store.save();
  },

  removeAssessment(id) {
    const assessment = this.getAssessment(id);
    this.store.remove(this.collection, assessment);
    this.store.save();
  },

  removeAllAssessments() {
    this.store.removeAll(this.collection);
    this.store.save();
  },

  getMemberAssessments(memberid) {
    return this.store.findBy(this.collection, { memberid: memberid });
  },

  // Return the weight recorded in the most recent assessment or starting weight if no assessments recorded
  getLatestWeight(memberid) {
    let latestWeight = 0;
    const memberAssessments = this.store.findBy(this.collection, { memberid: memberid});
    for (let assessment of memberAssessments) {
      latestWeight = assessment.weight;
    }
    if (latestWeight === 0) {
      latestWeight = memberStore.getMemberById(memberid).startingweight;
    }
    return Number(latestWeight);
  },

  editComment(comment) {
    const assessment = this.store.findOneBy(this.collection, {id: comment.id});
    assessment.comment = comment.comment;
    this.store.save();
  },

  updateTrend(assessmentid, trend) {
    const assessment = this.store.findOneBy(this.collection, {id: assessmentid});
    assessment.trend = trend;
    this.store.save();
  }
};

module.exports = assessmentStore;