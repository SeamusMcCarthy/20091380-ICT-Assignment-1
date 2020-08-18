'use strict';

const logger = require('../utils/logger');

const about = {

  index(request, response) {

    logger.info('Rendering About');

    // Used to determine which menu to display - member or trainer
    let member = '';
    if (request.cookies.memberid !== '')
      member = true;
    const viewData = {
      title: 'About Play Gym',
      member: member
    };
    response.render('about', viewData);
  }
};

module.exports = about;
