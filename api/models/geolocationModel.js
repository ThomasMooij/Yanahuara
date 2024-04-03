const GeolocationSchema = new Schema({
  userId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Users'
  },
  coordinates: {
      type: { type: String, default: 'Point' },
      coordinates: [Number], // [longitude, latitude]
  },
}, {
  timestamps: true
});

GeolocationSchema.index({ coordinates: '2dsphere' });

export default mongoose.model("Geolocation", GeolocationSchema);
