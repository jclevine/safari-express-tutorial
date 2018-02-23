var express = require('express');
var router = express.Router();
var Deezer = new require('../../real-deezer-api/lib/src/Deezer').Deezer;
var dz = new Deezer('nyh26a8w7cLdcl7YbIVIeor9j2GzGOdOs5cVpv5ZwOZ5HRebOQ');

router.get('/', async function(req, res, next) {
  var playlistIds = await dz.getAllPlaylistIds('relax')
  var trackIds = await dz.getAllTrackIds(playlistIds)
   

  res.render('playlists', { trackIds: trackIds.join(', ') });
});

module.exports = router;
