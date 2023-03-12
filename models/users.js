
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({


    name: {
        type: String,
        default:null

        },

    phoneNumber:{
        type:Number,
        unique:true
    },

    password: {
        type: String,
        required: true

    },
    donor_id: {
        type: String,
        default:null
    },
})

module.exports = mongoose.model('user',userSchema)