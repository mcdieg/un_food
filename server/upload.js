const IncomingForm = require("formidable").IncomingForm;
var xlsx = require('node-xlsx').default;// exports.converter = (file) => {
//   let workbook = XLSX.readFile(file)
//   console.log(workbook)
// }

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
