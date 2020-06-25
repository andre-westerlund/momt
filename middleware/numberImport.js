const Number = require('../models/NumberModel');

exports.import = async (numbers, user, date) => {
var unsuccessful = 0;
var success = 0;
var errors = [];
for(const num of numbers){
    var digiNum = num[0];
    if(digiNum.startsWith("685")){
        digiNum = digiNum.replace(/685[\s]*/g,"");
    }
    var number = new Number({
        number: digiNum,
        submittedBy: user,
        dateAdded: date
    });
    await number.save().then(()=>{
        success++;
    }).catch(err => {
        unsuccessful++;
        errors.push(err.toString());  
    });
};
return {
    message: `${success} out of ${numbers.length} Successfully Submitted`,
    errorNum: unsuccessful,
    errors: errors
}

}