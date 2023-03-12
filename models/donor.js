
const mongoose = require('mongoose')

const donorSchema = new mongoose.Schema({


    name: {
        type: String,
        default:null

        },

    phoneNumber:{
        type:Number,
        unique:true
    },
    
    bloodGroup: {
        type: String,
        required: false

    },

    location: {
        type: String,
        required: false
    },

    pincode: {
        type: Number,
        required: false
    },
    
    district: {
        type: String,
        required: false
    },

    state: {
        type: String,
        required: false
    },

    isAvailable: {
        type: Boolean,
        default: true
    },
    isVisible: {
        type: Boolean,
        default: false
    }

  
})

module.exports = mongoose.model('donor',donorSchema)