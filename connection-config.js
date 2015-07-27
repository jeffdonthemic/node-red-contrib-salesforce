module.exports = function(RED) {
    function ConnectionConfig(n) {
        RED.nodes.createNode(this,n);
        this.consumerKey = n.consumerKey;
        this.consumerSecret = n.consumerSecret;
        this.callbackUrl = n.callbackUrl;
        this.environment = n.environment;
        this.username = n.username;
        this.password = n.password;
    }
    RED.nodes.registerType("connection-config",ConnectionConfig);
}
