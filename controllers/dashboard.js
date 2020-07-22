"use strict";
const uuid = require('uuid');
const accounts = require ('./accounts.js');

const logger = require("../utils/logger");
const playlistStore = require('../models/playlist-store');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: 'Playlist Dashboard',
      playlists: playlistStore.getUserPlaylists(loggedInUser.id),
    };
    logger.info('about to render', playlistStore.getAllPlaylists());
    response.render('dashboard', viewData);
  },
  
    addPlaylist(request, response) {
      const loggedInUser = accounts.getCurrentUser(request);
      const newPlayList = {
        id: uuid.v1(),
        userid: loggedInUser.id,
        title: request.body.title,
        songs: [],
      };
      playlistStore.addPlaylist(newPlayList);
      response.redirect('/dashboard');
  },
};

module.exports = dashboard;
