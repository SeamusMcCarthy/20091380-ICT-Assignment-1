'use strict';

const logger = require('../utils/logger');
const accounts = require('./accounts');

const memberStore = require('../models/member-store');

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

  updateProfile(request, response) {

    const updmember = request.body;
    const loggedInMember = accounts.getCurrentMember(request);
    updmember.id = loggedInMember.id;
    updmember.height = Number(request.body.height);
    updmember.startingweight = Number(request.body.startingweight);
    memberStore.updateProfile(updmember);
    response.cookie('memberid', updmember.email);
    response.redirect('/dashboard');

  }
};

module.exports = profile;