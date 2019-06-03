const IncomingForm = require("formidable").IncomingForm;
const xlsx = require('node-xlsx').default;
const mongoose = require('mongoose')
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
  res.send("hey")
  form.on("file", (field, file) => {
  //  exports.converter(file)

  let myData =  xlsx.parse(file.path, file)
  let myArr = []
  myData[0].data.forEach((line) => {
    if(line.includes('gram' || 'ml')) {
      myArr.push(line.filter(function (el) { return el != null }))
    }
  })
  console.log(myArr)
  // console.log(myData[0].data[9])
  // console.log(myData[0].data[10])
  // console.log(myData[0].data[11])
  // console.log(myData[0].data[12])
  
  });
  form.on("end", () => {
    res.json();
  });
  form.parse(req);
  
};
