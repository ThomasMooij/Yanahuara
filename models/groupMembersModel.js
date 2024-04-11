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
// create index so everytime the document is requested on the groupId it saves the query result.\
GroupMembersSchema.index({ groupId: 1 });


export default mongoose.model("GroupMembers", GroupMembersSchema)