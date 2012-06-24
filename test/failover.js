var chai    = require('chai'),
    fs      = require('fs'),
    should  = chai.should();
    
var redis = require('../lib/failover');

var servers = [
    [ 6379, 'master.redis.summerwind.jp' ],
    [ 6380, 'slave1.redis.summerwind.jp' ],
    [ 6381, 'slave2.redis.summerwind.jp' ]
];

describe('RedisFailover', function() {
    it('サーバー情報の取得', function() {
        redis.servers = servers;
        redis.current = 0;
        
        var server = redis.nextServer();
        server.should.have.length(2);
        server[0].should.equal(servers[0][0]);
        server[1].should.equal(servers[0][1]);
        
        var server = redis.nextServer();
        server.should.have.length(2);
        server[0].should.equal(servers[1][0]);
        server[1].should.equal(servers[1][1]);
        
        var server = redis.nextServer();
        server.should.have.length(2);
        server[0].should.equal(servers[2][0]);
        server[1].should.equal(servers[2][1]);
        
        var server = redis.nextServer();
        server.should.have.length(2);
        server[0].should.equal(servers[0][0]);
        server[1].should.equal(servers[0][1]);
    });
    
    it('クライアントの取得', function() { 
        redis.servers = servers;     
        redis.current = 0;
        
        var client = null;
        
        client = redis.getClient();
        client.port.should.equal(servers[0][0]);
        client.host.should.equal(servers[0][1]);
        client.listeners.should.have.length(1);
        
        client = redis.getClient();
        client.port.should.equal(servers[1][0]);
        client.host.should.equal(servers[1][1]);
        client.listeners.should.have.length(1);
    });
    
    it('クライアントの生成', function() { 
        var servers = [
            [ 6379, 'master.redis.summerwind.com' ],
            [ 6380, 'slave1.redis.summerwind.com' ]
        ];
        
        var option = {
            socket_nodelay: true
        };
        
        var client = redis.createClient(servers, option);
        client.port.should.equal(servers[0][0]);
        client.host.should.equal(servers[0][1]);
        
        redis.servers.should.equal(servers);
        redis.option.should.equal(option);
        redis.current.should.equal(1);
    });
});