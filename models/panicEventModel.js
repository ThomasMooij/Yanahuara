import mongoose from 'mongoose';
const { Schema } = mongoose;

const PanicEventSchema = new Schema({
  userId:{

  },
  location:{
    
  },
  type:{
    
  }


  }, {
    timestamps:true
  }
);

export default mongoose.model("PanicEvent", PanicEventSchema)