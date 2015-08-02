module.exports = function(RED) {

  var parser = require('xml2js').parseString;
  var _ = require('lodash');

  function ParseObm(config) {
    RED.nodes.createNode(this,config);
    var node = this;
    this.on('input', function(msg) {
      parser(msg.payload, function (err, result) {
        if (err) {
          node.error(err);
          node.status({fill:"red",shape:"dot",text:"Error parsing XML."});
        }
        if (!err) {
          try {
            // get rid of the stuff we don't need
            var root = result['soapenv:Envelope']['soapenv:Body'][0].notifications[0];
            var data = root['Notification'][0]['sObject'][0];
            // start building payload
            msg.payload = {
              organizationId: root['OrganizationId'][0],
              actionId: root['ActionId'][0],
              type: data['$']['xsi:type'].split(':')[1],
              sobject: {}
            }
            // check for a sessionId
            if (_.isArray(root['SessionId'])) {
              msg.payload.sessionId = root['SessionId'][0];
            }
            // look at each node and see if it contains an array with data
            _.forEach(data, function(val, key) {
              if (_.isArray(val)) {
                msg.payload.sobject[key.split(':')[1].toLowerCase()] = val[0];
              }
            });
            node.send(msg);
            node.status({});
          } catch (err) {
            node.status({fill:"red",shape:"dot",text:"Error!"});
            node.error(err);
          }
        }
      });
    });
  }
  RED.nodes.registerType("obm",ParseObm);
}
