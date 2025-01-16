const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const employeeSchema = new SchemaType({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Employee',employeeSchema);