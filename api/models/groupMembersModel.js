import mongoose from 'mongoose';
const { Schema } = mongoose;

const GroupMembersSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Users"
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Groups" 
    },
    role: {
        type: String,
        enum: ['Member','Coordinator']
    },
  }, {
    timestamps:true
  }
);

export default mongoose.model("GroupMembers", GroupMembersSchema)