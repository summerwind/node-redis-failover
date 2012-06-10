var events = require('events'),
    redis = require('redis');

// RedisFailover クラス
var RedisFailover = new events.EventEmitter();

// クライアント生成メソッド
RedisFailover.createClient = function(servers, option) {
    this.servers = servers;
    this.option  = option || option;
    this.current = 0;
    
    return this.getClient();
};

// 障害発生処理メソッド
RedisFailover.failover = function() {
    this.emit('failover', this.getClient());
};

// クライアント取得メソッド
RedisFailover.getClient = function() {
    // 次のサーバーを取得
    var server = this.nextServer();
    // クライアントを生成
    var client = redis.createClient(server[0], server[1], this.option);
    
    // failoverイベントを発生
    var rf = this;
    client.on('error', function(err) {
        // 再接続しない
        client.closing = true;
        client.failovered = true;
        rf.failover();
    });
    
    return client;
};

// クライアント取得メソッド
RedisFailover.nextServer = function() {
    var server = this.servers[this.current++]
    if(this.servers.length <= this.current) {
        this.current = 0;
    }
    
    return server;
};

module.exports = RedisFailover;