var configValues = require('./config.json');


module.exports = {

    getDBConStr: function() {
        return 'mongodb+srv://' + configValues.uname + ':' + configValues.pwd + 
            '@clusterone.p2yvheb.mongodb.net/nodetodo';
    }

}