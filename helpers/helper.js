const moment = require("moment");

module.exports= {
    formateDate: (date , format)=> moment(date).format(format),
}