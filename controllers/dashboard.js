"use strict";
const uuid = require('uuid');

const logger = require("../utils/logger");
const playlistStore = require('../models/playlist-store');

const dashboard = {
  index(request, response) {
    logger.info('dashboard rendering');
    const viewData = {
      title: 'Playlist Dashboard',
      playlists: playlistStore.getAllPlaylists(),
    };
    logger.info('about to render', playlistStore.getAllPlaylists());
    response.render('dashboard', viewData);
  },
  
    addPlaylist(request, response) {
    const newPlayList = {
      id: uuid.v1(),
      title: request.body.title,
      songs: [],
    };
    playlistStore.addPlaylist(newPlayList);
    response.redirect('/dashboard');
  },
};

module.exports = dashboard;
