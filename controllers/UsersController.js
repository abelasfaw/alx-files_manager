import dbClient from '../utils/db';

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
