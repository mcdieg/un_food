const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


const IngredientSchema = new Schema ({
   Product: { type: String },
})

module.exports = mongoose.model("Ingredient", IngredientSchema)