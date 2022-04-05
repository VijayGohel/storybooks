const moment = require("moment");

module.exports= {
    formateDate: (date , format)=> moment(date).format(format),

    stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, '')
    },

    truncate: function (str, len) {
        if (str.length > len && str.length > 0) {
          let new_str = str + ' '
          new_str = str.substr(0, len)
          new_str = str.substr(0, new_str.lastIndexOf(' '))
          new_str = new_str.length > 0 ? new_str : str.substr(0, len)
          return new_str + '...'
        }
        return str
      },

      editIcon: function (storyUserId, loggedUserId, storyId, floating = true) {
        if (storyUserId.toString() == loggedUserId.toString()) {
          if (floating) {
            return `<a href="/stories/edit/${storyId}" class="btn btn-floating btn-icon bg-primary text-white "><i class="fa-solid fa-pen-to-square"></i></a>`
          } else {
            return `<a href="/stories/edit/${storyId}" class="btn btn-icon bg-primary text-white"><i class="fa-solid fa-pen-to-square"></i></a>`
          }
        } else {
          return ''
        }
      }
}