import fs from 'fs';
import path from 'path';
import { ObjectId } from 'mongodb';
import { v4 as uuidV4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

exports.postUpload = async (req, res) => {
  const supportedTypes = ['folder', 'file', 'image'];
  const key = `auth_${req.headers['x-token']}`;
  const userId = await redisClient.get(key);
  if (!userId) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
  const {
    name, type, parentId, isPublic, data,
  } = req.body;
  if (!name) {
    return res.status(400).send({ error: 'Missing name' });
  }
  if (!supportedTypes.includes(type)) {
    return res.status(400).send({ error: 'Missing type' });
  }
  if (!data && type !== 'folder') {
    return res.status(400).send({ error: 'Missing data' });
  }
  if (parentId) {
    const parentFile = await dbClient.filesCollection
      .findOne({ _id: ObjectId(parentId) });
    if (!parentFile) {
      return res.status(400).send({ error: 'Parent not found' });
    }

    if (parentFile.type !== 'folder') {
      return res.status(400).send({ error: 'Parent is not a folder' });
    }
  }
  if (type === 'folder') {
    const insertStatus = await dbClient.filesCollection.insertOne({
      userId: ObjectId(userId),
      name,
      type,
      isPublic: isPublic || false,
      parentId: parentId ? ObjectId(parentId) : 0,
    });
    const file = insertStatus.ops[0];
    return res.status(201).send({
      id: file._id,
      userId: file.userId,
      name: file.name,
      type: file.type,
      isPublic: file.isPublic,
      parentId: file.parentId,
    });
  }
  const destPath = process.env.FOLDER_PATH || '/tmp/files_manager';
  const localPath = path.join(destPath, uuidV4());
  try {
    await fs.promises.mkdir(destPath, { recursive: true });
  } catch (error) {
    console.log('Error creating dir: ', error);
  }
  try {
    await fs.promises.writeFile(localPath, data, {
      encoding: 'base64',
    });
  } catch (error) {
    return res.status(400).send({ error: 'unable to create file' });
  }

  const insertDetails2 = await dbClient.filesCollection.insertOne({
    userId: ObjectId(userId),
    name,
    type,
    isPublic: isPublic || false,
    parentId: parentId ? ObjectId(parentId) : 0,
    localPath,
  });
  const file = insertDetails2.ops[0];
  return res.status(201).send({
    id: file._id,
    userId: file.userId,
    name: file.name,
    type: file.type,
    isPublic: file.isPublic,
    parentId: file.parentId,
  });
};
