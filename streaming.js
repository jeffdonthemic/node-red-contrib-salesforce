module.exports = function(RED) {

  var nforce = require('nforce');

  function Streaming(config) {
    RED.nodes.createNode(this,config);
    this.connection = RED.nodes.getNode(config.connection);
    var node = this;

    // create connection object
    var org = nforce.createConnection({
      clientId: this.connection.consumerKey,
      clientSecret: this.connection.consumerSecret,
      redirectUri: this.connection.callbackUrl,
      environment: this.connection.environment,
      mode: 'single'
    });

    org.authenticate({ username: this.connection.username, password: this.connection.password }, function(err, oauth) {

      if(err) node.err(err);

      var client = org.createStreamClient();
      var stream = client.subscribe({ topic: config.pushTopic });
      node.log("Subscribing to topic: " + config.pushTopic );

      stream.on('error', function(err) {
        node.log('Subscription error!!!');
        node.log(err);
        client.disconnect();
      });

      stream.on('data', function(data) {
        node.send({
          payload: data
        });
      });

    });

  }
  RED.nodes.registerType("streaming",Streaming);
}
