const Match = require('../models/Match');

exports.match = async (req, res, next) => {
  try {
    const search = req.body;
    const user_id = req.user.user_id;
    const users = await Match.getMatchingUsers(user_id, search);
    const result = [];
    while (users.length > 0)
      result.push(users.splice(0, 5));
    return res.status(200).json(result);
  } catch (e) {
    console.error("Erreur de matching: " + e);
  }
};
