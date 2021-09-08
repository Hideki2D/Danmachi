module.exports.run = async (bot, msg, args) =>{
    var google = require('google')
    let str = msg.content.slice(msg.content.indexOf(' '), msg.content.length);
    google.resultsPerPage = 25
    var nextCounter = 0
    console.log(str);
    google(str, function (err, res) {
        res.links.forEach(function(link) {
            msg.channel.send(link.title + ' - ' + link.href);
            msg.channel.send(link.description);
            console.log(link.title + ' - ' + link.href)
            console.log(link.description + "\n")
        })
        if (res.next) res.next()
      })
}