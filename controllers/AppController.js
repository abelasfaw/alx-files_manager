import redisClient from '../utils/redis';
import dbClient from '../utils/db';

exports.getStatus = async (req, res) => {
  const response = {
    redis: redisClient.isAlive(),
    db: dbClient.isAlive(),
  };
  return res.json(response);
};
exports.getStats = async (req, res) => {
  const response = {
    users: await dbClient.nbUsers(),
    files: await dbClient.nbFiles(),
  };
  return res.json(response);
};
