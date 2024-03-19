import mongoose from 'mongoose';
const { Schema } = mongoose;

const GeolocationSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref:'Users'
    },
    coordinates:{

    }
  }, {
    timestamps:true
  }
);

export default mongoose.model("Geolocation", GeolocationSchema)