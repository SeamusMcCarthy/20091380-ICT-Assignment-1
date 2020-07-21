"use strict";

const _ = require('lodash');
const playlistStore = {

  playlistCollection: require('./playlist-store.json').playlistCollection,

  getAllPlaylists() {
    return this.playlistCollection;
  },

  getPlaylist(id) {
    return _.find(this.playlistCollection, { id: id });
  },
  
  removeSong(id, songId) {
    const playlist = this.getPlaylist(id);
    _.remove(playlist.songs, { id: songId });
  },
  
  removePlaylist(id) {
    const playlist = this.getPlaylist(id);
    _.remove(this.playlistCollection, { id: id });
  },
  
  addSong(id, song) {
    const playlist = this.getPlaylist(id);
    playlist.songs.push(song);
  },
};

module.exports = playlistStore;
