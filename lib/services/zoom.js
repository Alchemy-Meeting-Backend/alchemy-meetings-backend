const request = require('superagent');
const { sign } = require('jsonwebtoken');

const createToken = () => {
  return sign({
    iss: process.env.ZOOM_API_KEY,
  }, process.env.ZOOM_API_SECRET, {
    expiresIn: '1h'
  });
};
  
const zoomRequest = (path, method = 'get') => {
  return request[method](`https://api.zoom.us/v2${path}`)
    .set('Authorization', `Bearer ${createToken()}`)
    .set('User-Agent', 'Zoom-Jwt-Request')
    .then(({ body }) => body);
};

const getParticipants = meetingId => {
  return zoomRequest(`/metrics/meetings/${meetingId}/participants?page_size=300`)
    .then(({ participants }) => participants
      .filter(({ leave_time }) => !leave_time)
      .map(({ id, user_name: name, join_time: joinedAt }) => ({
        id,
        name,
        joinedAt
      })));
};

module.exports = { getParticipants };
