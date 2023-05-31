import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const sha1 = require('sha1');

exports.postNew = async (req, res) => {
  const { email, password } = req.body;
  if (!email) return res.status(400).send({ error: 'Missing email' });
  if (!password) return res.status(400).send({ error: 'Missing password' });
  const existingUser = await dbClient.usersCollection.findOne({ email });
  if (existingUser) return res.status(400).send({ error: 'Already exist' });
  const passwordHash = sha1(password);
  const insertResult = await dbClient.usersCollection.insertOne({
    email,
    password: passwordHash,
  });
  const userResponse = {
    id: insertResult.insertedId,
    email: insertResult.ops[0].email,
  };
  return res.status(201).send(userResponse);
};
exports.getMe = async (req, res) => {
  const token = req.headers['x-token'];
  const key = `auth_${token}`;
  const userId = await redisClient.get(key);

  if (!userId) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  const user = await dbClient
    .collection('users')
    .findOne({ _id: ObjectId(userId) });
  if (!user) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
  return res.send({ id: user._id, email: user.email });
};
