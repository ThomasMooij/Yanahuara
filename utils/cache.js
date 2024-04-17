import mongoose from 'mongoose';
import redis from 'redis';

const client = redis.createClient({ url: "redis://127.0.0.1:6379" });
client.connect()
  .then(() => console.log("Connected to Redis"))
  .catch(err => console.error("Error connecting to Redis:", err));

const originalExec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function() {
  if (!this._mongooseOptions) {
    this._mongooseOptions = {};  
  }
  this._mongooseOptions.cache = true; 
  return this; 
};


mongoose.Query.prototype.exec = async function() {
  if (!this._mongooseOptions.cache) {
    return originalExec.apply(this, arguments);
  }

  const cacheKey = JSON.stringify({
    query: this.getQuery(),
    collection: this.mongooseCollection.name,
    options: this.getOptions(),
    populate: this._mongooseOptions.populate
  });

  const cachedResult = await client.get(cacheKey);

  if (cachedResult) {
    console.log("SERVING FROM CACHE");
    const docs = JSON.parse(cachedResult);

    if (this._mongooseOptions.populate) {
      const populateOptions = {
        path: this._mongooseOptions.populate.path,
        select: this._mongooseOptions.populate.select
      };

      try {
        if (Array.isArray(docs)) {
          return Promise.all(docs.map(doc => this.model.hydrate(doc).populate(populateOptions)));
        } else {
          return this.model.hydrate(docs).populate(populateOptions);
        }
      } catch (error) {
        console.error("Error populating documents:", error);
        throw error; 
      }
    } else {
      return Array.isArray(docs) ? docs.map(doc => this.model.hydrate(doc)) : this.model.hydrate(docs);
    }
  }

  const result = await originalExec.apply(this, arguments);
  if (result) {
    await client.set(cacheKey, JSON.stringify(result));
  }

  return result;
};

