
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
        required: true

    },

    location: {
        type: String,
        required: true
    },

    pincode: {
        type: Number,
        required: false
    },
    
    district: {
        type: String,
        required: true
    },

    state: {
        type: String,
        required: true
    },

    isAvailable: {
        type: Boolean,
        default: true
    }

  
})

module.exports = mongoose.model('donor',donorSchema)