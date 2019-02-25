 var mosca = require('mosca');

  var server = new mosca.Server({
    url: 'localhost',
    port:1883
  });

  server.on('clientConnected', function(client) {
    console.log('client connected', client.id);
  });

  server.on('clientDisconnected', function(client) {
    console.log('client disconnected', client.id);
  });

  server.on('published', function(packet, client) {
    console.log(packet);
  });

  server.on('subscribed', function(topic, client) {
    console.log('subscribed: ' + client.id);
  });

  server.on('unsubscribed', function(topic, client) {
    console.log('unsubscribed: ' + client.id);    
  });

  server.on('ready', function() {
    console.log('Mosca server is up and running');
  });
