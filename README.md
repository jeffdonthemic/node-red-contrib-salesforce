# node-red-contrib-salesforce

A set of [Node-RED](http://www.nodered.org) nodes to interact with Salesforce and Force.com.

## Install
-------

Run the following command in the root directory of your Node-RED install

```
npm install node-red-contrib-salesforce
```

## Usage

Each node uses a connection object to hold and share Salesforce connected app settings (consumer key, consumer secret, username, etc.). This determines the org that each node operates against.

### SOQL ###

<p>Executes a SOQL query.</p>
<pre>
select id, name
from contact
limit 2
</pre>
<p>The resulting message has the following properties:
<ul><li>msg.payload.size - the number of records returned from the query.</li>
<li>msg.payload.records - the array of records returned from the query.</li>
</ul></p>
<p>The query can be configured in the node, however if left blank, the query should be set in an incoming message on <code>msg.query</code>.</p>
<p>See the <a href="https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl">Salesforce SOQL documentation</a> for more information.</p>

### SOSL ###


<p>Executes a SOSL query.</p>
<pre>
FIND {united*} IN ALL FIELDS
RETURNING Account (Id, Name), Contact (Id, Name)
</pre>
<p>The resulting message has the following properties:
<ul><li>msg.payload.size - the number of records returned from the query.</li>
<li>msg.payload.records - the array of records returned from the query.</li>
</ul></p>
<p>The query can be configured in the node, however if left blank, the query should be set in an incoming message on <code>msg.query</code>.</p>
<p>See the <a href="https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_sosl.htm">Salesforce SOSL documentation</a> for more information.</p>

### DML ###


<p>Executes an insert, update, upsert or delete DML statement.</p>
<p>The action and object can be configured in the node, however if left blank, the following should be set in an incoming message:<ul><li><code>msg.action</code> - the DML action to perform</li><li><code>msg.object</code> - the sObject for the DML action</li></ul></p>
<p><b>Insert Action</b></p>
<p>This action inserts the contents of <code>msg.payload</code> and returns the newly created ID.</p>
<pre>{
firstname: "Nikola",
lastname: "Tesla"
}</pre>
<p><br/><b>Update Action</b></p>
<p>This action updates the specified record with the the contents of <code>msg.payload</code>. It assumes that the payload contains an <code>id</code> property with the id of the record to be updated.</p>
<pre>{
id: "00337000002uFbW",
firstname: "Nikola",
lastname: "Tesla"
}</pre>
<p><br/><b>Upsert Action</b></p>
<p>The upsert action matches contents of the <code>msg.payload</code> with existing records by comparing values of one field. If you don’t specify a field when calling this action, the operation uses the id value in the <code>msg.payload</code> to match with existing records to update. Alternatively, you can specify a field to use for matching in <code>msg.externalId</code>. This field must be marked as external ID. If a matching record is not found, a new records is inserted.</p>
<p>Sample <code>msg.payload</code> to be used with an external id.</p>
<pre>{
firstname: "Nikola",
lastname: "Tesla"
}</pre>
<p>Sample <code>msg.externalId</code> specifying the field and value to be used for matching.</p>
<pre>{
field: "Ext_ID_c",
value: "12345"
}</pre>
<p>If record(s) are updated, the resulting payload will resemble:</p>
<pre>{
"payload": {
"success": true,
"object": "contact",
"id": {
  "field": "Ext_ID__c",
  "value": "12345"
},
"action": "update"
}
}</pre>
<p>If a new record is inserted, the resulting payload will resemble the following containing the id of the newly created record:</p>
<pre>{
"payload": {
"success": true,
"object": "contact",
"id": "00337000002uwUVAAY",
"action": "insert"
}
}</pre>
<p><br/><b>Delete Action</b></p>
<p>This action deletes the record specified by the id property in <code>msg.payload</code>.</p>
<pre>{
"id": "00337000002uwUVAAY"
}</pre>
<p>See the <a href="https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_dml_section.htm#apex_dml_insert">Apex DML Operations</a> for more information.</p>

### Streaming ###


<p>Creates a client that subscribes to a PushTopic for the Streaming API.</p>
<p>When the client receives a message it sends `msg.payload` with the following:
<ul><li>msg.payload.event - the information on the event that was received.</li>
<li>msg.payload.sobject - the sobject information received.</li>
</ul></p>
<p>Assuming the PushTopic was created with the query <code>SELECT Id, Name FROM Contact</code>, then a resulting message would look like:</p>
<pre>{
"event": {
"type": "updated", "createdDate": "2015-07-31T18:38:21.000+0000"
},
"sobject": {
"Name": "Nikola Tesla", "Id": "a0037000001pplrZZZ"
}
}</pre>
<p>See the <a href="https://developer.salesforce.com/docs/atlas.en-us.api_streaming.meta/api_streaming/quick_start_workbench.htm">Quick Start Using Workbench</a> to get started or the <a href="https://developer.salesforce.com/docs/atlas.en-us.api_streaming.meta/api_streaming/">Streaming API documentation</a> for complete details.</p>

### OBM ###


<p>When used with an http in node, parses the XML from a Salesforce Outbound Message to a JSON object.</p>
<p>The resulting <code>msg.payload</code> should look something like:
<pre>{
"organizationId": "00D37000000PdLZAE1",
"actionId": "04k370000008OrqZZE",
"sobject": {
"type": "Contact",
"id": "a0037000001I1EvWWO",
"name": "Nikola Tesla",
"firstname": "Nikola",
"lastname": "Tesla"
},
"sessionId": "00D37000000PdLB!"
}</pre>
</p>
<p>Connect this node downstream from a POST http input node to parse the XML received from an Outbound Message call from Salesforce. Use the URL from the http in node for the Endpoint URL for your Outbound Message.</p>
<p>See the <a href="https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_om_outboundmessaging_setting_up.htm">Salesforce Setting Up Outbound Messaging documentation</a> for more information.</p>
