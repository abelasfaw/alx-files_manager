import { v4 as uuidV4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const sha1 = require('sha1');

exports.getConnect = async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
  const base64 = authorization.split(' ')[1];
  const decodedCredentials = Buffer.from(base64, 'base64').toString();
  const [email, password] = decodedCredentials.split(':');
  if (!email || !password) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
  const user = await dbClient.usersCollection.findOne({ email });

  if (!user || user.password !== sha1(password)) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
  const token = uuidV4();
  const idKey = `auth_${token}`;
  await redisClient.set(idKey, user._id, 3660 * 24);
  return res.json({ token });
};
exports.getDisconnect = async (req, res) => {
  const token = req.headers['x-token'];

  const key = `auth_${token}`;
  const user = await redisClient.get(key);
  if (!user) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
  await redisClient.del(key);
  return res.status(204).send();
};
