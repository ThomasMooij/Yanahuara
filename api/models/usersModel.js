import mongoose from 'mongoose';
const { Schema } = mongoose;

const UsersSchema = new Schema({
    
    firstName:{
        type: String,
        required:true,
    },
    lastName:{
      type: String,
      required:true,
  },
    email: {
        type:String,
        required:true,
    },
    password: {
        type:String,
        required:true
    },
    bloodType: {
        type: Array,
        required: false,
    },
    phoneNumber: {
      type:String,
      required:true,
    },
    isVerified: {
      type:Boolean,
      default:false,
    },
    groups:  [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Groups" 
    }],
    panicEvents:[{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "PanicEvents" 
    }],
    reports:[{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Reports" 
    }],
    geolocation:[{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Geolocation" 
    }],
    geolocation:[{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Geolocation" 
    }],
    userTypes:{
      type:String,
      enum: ['#']
    },
    isAdmin:{
        type:Boolean,
        default:false
    }

  }, {
    timestamps:true
  });

  UserSchema.pre('save' , async function(next) {
    if (this.isModified("password")){
      this.password = await hash(this.password, 10)
    }
    next()
  })
  
UserSchema.methods.comparePassword = async function(password){
    const result = await compare(password, this.password)
    return result
  }

export default mongoose.model("Users", UsersSchema)