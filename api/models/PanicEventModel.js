import mongoose from 'mongoose';
const { Schema } = mongoose;

const PanicEventSchema = new Schema({
    


  }, {
    timestamps:true
  }
);

export default mongoose.model("PanicEvent", PanicEventSchema)