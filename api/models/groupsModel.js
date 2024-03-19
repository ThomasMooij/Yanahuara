import mongoose from 'mongoose';
const { Schema } = mongoose;

const GroupsSchema = new Schema({
    


  }, {
    timestamps:true
  }
);

export default mongoose.model("Groups", GroupsSchema)