'use strict';

const logger = require('../utils/logger.js');
const memberStore = require('../models/member-store.js');
const accounts = require('./accounts.js');

const profile = {
  index(request, response) {
    const loggedInMember = accounts.getCurrentMember(request);
    logger.info("Rendering Profile");
    const viewData = {
      member: loggedInMember,
      title: "Profile details",
    };
    response.render("profile", viewData);
  },

  updateprofile(request, response) {
    const updmember = request.body;
    const loggedInMember = accounts.getCurrentMember(request);
    updmember.id = loggedInMember.id;
    memberStore.updateProfile(updmember);
    response.cookie('memberid', updmember.email);
    response.redirect('/dashboard');
  }
};

module.exports = profile;