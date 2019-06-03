const IncomingForm = require("formidable").IncomingForm;
const xlsx = require('node-xlsx').default;
const mongoose = require('mongoose')
require('./models/Ingredient')
const Ingredient = mongoose.model('Ingredient')


// exports.converter = (file) => {
//   let workbook = XLSX.readFile(file)
//   console.log(workbook)
// }
exports.computeCarbonFootprint = (array) => {
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var query = { address: "Park Lane 38" };
    dbo.collection("customers").find(query).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
  });
}

exports.upload = async (req, res) => {
  var form = new IncomingForm();

  form.on("file", (field, file) => {
    let myData =  xlsx.parse(file.path, file)
    let myArr = []
      myData[0].data.forEach((line) => {
         if(line.includes('gram' || 'ml')) {
         myArr.push(line.filter(function (el) { return el != null }))
       }
    })

    let recipeImpact = []

  myArr.forEach((line)=> {
      let food = line[0].split(/\W/)[0]
      food = food.charAt(0).toUpperCase() + food.slice(1);
      let regexFood = new RegExp(`${food}\\w*`)
      let quantity = line [1]
      Ingredient.findOne( { 'Product': regexFood }, function (err, ingredient){
        (ingredient ? recipeImpact.push(ingredient) : "")
      })
  })
  
  async function Impact() {
    const finalRecipe = await recipeImpact
    console.log(finalRecipe)
  }
  Impact()
  });
  form.on("end", () => {
    res.json();
  });
  form.parse(req);
  
};
