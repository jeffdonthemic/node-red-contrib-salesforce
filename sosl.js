module.exports = function(RED) {

  var nforce = require('nforce');

  function Query(config) {
    RED.nodes.createNode(this,config);
    this.connection = RED.nodes.getNode(config.connection);
    var node = this;
    this.on('input', function(msg) {

      // show initial status of progress
      node.status({fill:"green",shape:"ring",text:"connecting...."});

      // use msg query if node's query is blank
      if (msg.hasOwnProperty("query") && config.query === '') {
        config.query = msg.query;
      }

      // create connection object
      var org = nforce.createConnection({
        clientId: this.connection.consumerKey,
        clientSecret: this.connection.consumerSecret,
        redirectUri: this.connection.callbackUrl,
        environment: this.connection.environment,
        mode: 'single'
      });

      // auth and run query
      org.authenticate({ username: this.connection.username, password: this.connection.password }).then(function(){
        return org.search({ search: config.query })
      }).then(function(results) {
        msg.payload = {
          size: results.length,
          records: results
        }
        msg.payload = results;
        node.send(msg);
        node.status({});
      }).error(function(err) {
        node.status({fill:"red",shape:"dot",text:"Error!"});
        node.error(err);
      });

    });
  }
  RED.nodes.registerType("sosl",Query);
}
