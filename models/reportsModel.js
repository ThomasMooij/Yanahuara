import mongoose from 'mongoose';
const { Schema } = mongoose;

const ReportsSchema = new Schema({
    


  }, {
    timestamps:true
  }
);

export default mongoose.model("Reports", ReportsSchema)