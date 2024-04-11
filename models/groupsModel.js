import mongoose from 'mongoose';
const { Schema } = mongoose;

const GroupsSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Users" 
    },
  }, {
    timestamps:true
  }
);

export default mongoose.model("Groups", GroupsSchema)