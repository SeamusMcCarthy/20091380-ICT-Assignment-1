'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const goalStore = {

  store: new JsonStore('./models/goal-store.json', { goalCollection: [] }),
  collection: 'goalCollection',

  getAllGoals() {
    return this.store.findAll(this.collection);
  },

  getMemberGoalsByStatus(memberid, status) {
    return this.store.findBy(this.collection, {memberid: memberid, status: status});
  },

  getGoal(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  addGoal(goal) {
    this.store.add(this.collection, goal);
    this.store.save();
  },

  removeGoal(id) {
    const goal = this.getGoal(id);
    this.store.remove(this.collection, goal);
    this.store.save();
  },

  updateAchieved(id) {
    const goal = this.getGoal(id);
    goal.status = "Achieved";
    this.store.save();
  },

  updateMissed(id) {
    const updGoal = this.getGoal(id);
    updGoal.status = "Missed";
    this.store.save();
  },

  removeAllGoals() {
    this.store.removeAll(this.collection);
    this.store.save();
  },

  getMemberGoals(memberid) {
    return this.store.findBy(this.collection, { memberid: memberid });
  },
};

module.exports = goalStore;