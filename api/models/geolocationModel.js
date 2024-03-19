import mongoose from 'mongoose';
const { Schema } = mongoose;

const GeolocationSchema = new Schema({
    
    

  }, {
    timestamps:true
  }
);

export default mongoose.model("Geolocation", GeolocationSchema)