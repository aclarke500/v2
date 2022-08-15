var Holidays = require('date-holidays')
var hd = new Holidays()
//console.log(hd.getStates('CA'))
hd = new Holidays('CA', 'on')
console.log(hd.isHoliday(new Date('2022-1-01')))

let x = hd.isHoliday(new Date('2022-1-01'))
if (x){
    
}



