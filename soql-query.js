module.exports = function(RED) {

  var nforce = require('nforce');

  function Query(config) {
    RED.nodes.createNode(this,config);
    this.connection = RED.nodes.getNode(config.connection);
    var node = this;
    this.on('input', function(msg) {

      // show initial status of progress
      node.status({fill:"green",shape:"ring",text:"connecting...."});

      // use msg soql if node's soql is blank
      if (msg.hasOwnProperty("soql") && config.soql === '') {
        config.soql = msg.soql;
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
        return org.query({ query: config.soql })
      }).then(function(results) {
        msg.payload = {
          size: results.totalSize,
          records: results.records
        }
        node.send(msg);
        node.status({});
      }).error(function(err) {
        node.status({fill:"red",shape:"dot",text:"Error!"});
        node.error(err);
      });

    });
  }
  RED.nodes.registerType("soql-query",Query);
}
