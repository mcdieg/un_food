const IncomingForm = require("formidable").IncomingForm;
const xlsx = require('node-xlsx').default;
const mongoose = require('mongoose')
require('./models/Ingredient')
const Ingredient = mongoose.model('Ingredient')





exports.regEx = async (lines) => {

  const start = async () => {
    const characteristics = {
      Land_use: 0,
      GHG: 0,
      Acid: 0,
      Eutr: 0,
      Freshwater: 0
    }

    let total = characteristics

    const results = lines.map(async (line) => {
      let food = line[0].split(/\W/)[0]
      food = food.charAt(0).toUpperCase() + food.slice(1);
      let regexFood = new RegExp(`${food}\\w*`)
      let quantity = line[1] / 1000

      return Ingredient.findOne( { 'Product': regexFood }).then((loadedIngredient) => {
        if (loadedIngredient) {
          Object.entries(characteristics).forEach((characteristic) => {
            loadedIngredient[characteristic[0]] *= quantity
          })
          return loadedIngredient
        } else {
          return null
        }
      })
    })

    let finalResult = await Promise.all(results)
    finalResult = finalResult.filter(e => e != null);
    console.log(total.Land_use)
    finalResult.forEach((element) => {
      total.Land_use += parseFloat(element.Land_use)
      total.Eutr += parseFloat(element.Eutr)
      total.Acid += parseFloat(element.Acid)
      total.GHG += parseFloat(element.GHG)
      total.Freshwater += parseFloat(element.Freshwater)
    })
    finalResult.push(total)
    console.log(total)
    return finalResult
  }
  return start();
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
  form.on("end", async () => {
    const finalData = await exports.regEx(myArr)
    res.send(finalData)
  });
  form.parse(req);

};
