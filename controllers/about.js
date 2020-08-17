'use strict';

const logger = require('../utils/logger');

const about = {

  index(request, response) {

    logger.info('Rendering About');
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
