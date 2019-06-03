const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;


const IngredientSchema = new Schema ({
   Product: { type: String },
   Land_use: { type: String},
   GHG: { type: String },
   Acid: { type: String },
   Eutr: { type: String },
   Freshwater: { type: String }
})

module.exports = mongoose.model("Ingredient", IngredientSchema)