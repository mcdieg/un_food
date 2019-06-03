const IncomingForm = require("formidable").IncomingForm;
const xlsx = require('node-xlsx').default;
const mongoose = require('mongoose')
require('./models/Ingredient')
const Ingredient = mongoose.model('Ingredient')





exports.regEx = async (array) => {
  let recipeImpact = []

  async function asyncForEach(array, total, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  const start = async () => {
    let total = {
      Land_use: 0,
      GHG: 0,
      Acid: 0,
      Eutr: 0,
      Freshwater: 0
    }
    await asyncForEach(array, total, async (line)=> {

      let food = line[0].split(/\W/)[0]
      food = food.charAt(0).toUpperCase() + food.slice(1);
      let regexFood = new RegExp(`${food}\\w*`)
      let quantity = line[1] / 1000
      const loadedIngredient = await Ingredient.findOne( { 'Product': regexFood })
      if (loadedIngredient) {
        total.Land_use = total.Land_use + parseFloat(loadedIngredient.Land_use * quantity)
        total.GHG = total.GHG + parseFloat(loadedIngredient.GHG * quantity)
        total.Acid = total.Acid + parseFloat(loadedIngredient.Acid * quantity)
        total.Eutr = total.Eutr + parseFloat(loadedIngredient.Eutr * quantity)
        total.Freshwater = total.Freshwater + parseFloat(loadedIngredient.Freshwater * quantity)
        let weightedImpact = {
          _id: loadedIngredient._id,
          Product: loadedIngredient.Product,
          Land_use: loadedIngredient.Land_use * quantity,
          GHG: loadedIngredient.GHG * quantity,
          Acid: loadedIngredient.Acid * quantity,
          Eutr: loadedIngredient.Eutr * quantity,
          Freshwater: loadedIngredient.Freshwater * quantity
        }
        recipeImpact.push(weightedImpact) 
      }   
    })
    recipeImpact.push(total)
    return recipeImpact
  }
  start()
}

exports.upload = async (req, res) => {
  const form = new IncomingForm();
  let myArr = []

  form.on("file", async (field, file) => {
    let myData =  xlsx.parse(file.path, file)
      myData[0].data.forEach((line) => {
         if(line.includes('gram' || 'ml')) {
         myArr.push(line.filter(function (el) { return el != null }))
       }
    })

  

  });
  form.on("end", () => {
    
  });
  form.parse(req);
  res.json(exports.regEx(myArr))
};
