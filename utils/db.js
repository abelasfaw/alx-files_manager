import { MongoClient } from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

/**
 * Helper class for database connection and basic info
 */
class DBClient {
  constructor() {
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        console.log(err.message);
        this.db = false;
      } else {
        console.log('Database connection succesfull');
        this.db = client.db(DB_DATABASE);
        this.usersCollection = this.db.collection('users');
        this.filesCollection = this.db.collection('files');
      }
    });
  }

  /**
   * returns true when the connection to MongoDB is a success otherwise,
   * false
   */
  isAlive() {
    return Boolean(this.db);
  }

  /**
   * Returns the number of documents in the collection users
   */
  async nbUsers() {
    return this.usersCollection.countDocuments();
  }

  /**
   * returns the number of documents in the collection files
   */
  async nbFiles() {
    return this.filesCollection.countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
