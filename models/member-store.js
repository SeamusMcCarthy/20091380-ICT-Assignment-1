'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

const memberStore = {

  store: new JsonStore('./models/member-store.json', { members: [] }),
  collection: 'members',

  getAllMembers() {
    return this.store.findAll(this.collection);
  },

  addMember(member) {
    this.store.add(this.collection, member);
    this.store.save();
  },

  getMemberById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getMemberByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },

  removeMember(id) {
    const member = this.getMemberById(id);
    this.store.remove(this.collection, member);
    this.store.save();
  },

  incrementNumAssessments(id) {
    const member = this.store.findOneBy(this.collection, {id: id});
    let num = member.numassessments;
    num += 1;
    member.numassessments = num;
    this.store.save();
  },

  incrementNumGoals(id) {
    const member = this.store.findOneBy(this.collection, {id: id});
    let num = member.numgoals;
    num += 1;
    member.numgoals = num;
    this.store.save();
  },

  decrementNumAssessments(id) {
    const member = this.store.findOneBy(this.collection, {id: id});
    let num = member.numassignments;
    num -= 1;
    member.numassignments = num;
    this.store.save();
  },

  decrementNumGoals(id) {
    const member = this.store.findOneBy(this.collection, {id: id});
    let num = member.numgoals;
    num -= 1;
    member.numgoals = num;
    this.store.save();
  },

  updateProfile(updmember) {
    const member = this.store.findOneBy(this.collection, {id: updmember.id});
    member.name = updmember.name;
    member.gender = updmember.gender;
    member.email = updmember.email.toLowerCase();
    member.password = updmember.password;
    member.address = updmember.address;
    member.height = updmember.height;
    member.startingweight = updmember.startingweight;
    this.store.save();
  }
};

module.exports = memberStore;