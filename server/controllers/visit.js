const Visit = require('../models/Visit');
const User = require('../models/User');

exports.postVisit = async (req, res, next) => {
  try {
    const visiter_id = req.user.user_id;
    const visited_login = req.params.visited_login;
    const visited = await User.getUserByLogin(visited_login);
    if (!visited || !visited.rows.length)
      throw `Utilisateur introuvable lors de l'ajout de visit`;
    const visited_id = visited.rows[0].user_id;
    const visited_score = parseInt(visited.rows[0].user_score) + 1;
    const visit = await Visit.addVisit(visiter_id, visited_id);
    if (!visit)
      throw `Erreur lors de l'ajout du visit pour ${visited_login}`;
    const increaseScore = User.updateScore(visited_id, visited_score);
    if (!increaseScore)
      throw `Erreur lors de l'augmentation du score`;
    return res.status(200).json("OK");
  } catch (e) {
    console.error(e);
    return res.status(403).json("Erreur lors de l'ajout de visite");
  }
};

exports.getVisits = async (req, res, next) => {
  try {
    const visited_id = req.user.user_id;
    const visiters = await Visit.getAllVisits(visited_id);
    let result = [];
    for (const visiter of visiters.rows)
      result.push(visiter.user_login);
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(403).json("Erreur lors de .");
  }
};
