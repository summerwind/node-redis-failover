var events = require('events'),
    util   = require('util'),
    redis  = require('redis');

// RedisFailover クラス
var RedisFailover = new events.EventEmitter();

// クライアント生成メソッド
RedisFailover.createClient = function(servers, option) {
    this.servers = servers;
    this.option  = option || {};
    this.auto_promote = false;
    this.current = 0;
    
    // 自動昇格オプション
    if('auto_promote' in this.option) {
        if(this.option.auto_promote === true) {
            this.auto_promote = true;
        }
        delete this.option.auto_promote;
    }
    
    return this.getClient();
};

// エラーイベントハンドラ
RedisFailover.errorHandler = function() {
    var rf = this;
    return function(err) {
        // 再接続しない
        this.closing = true;
        // フェイルオーバーフラグを設定
        this.failovered = true;
        
        // 新しいクライアントを生成
        var client = rf.getClient();
        // 自動昇格の判定
        if(rf.auto_promote === true) {
            // マスターに昇格してからフェイルオーバー
            client.slaveof('NO', 'ONE', function(err, reply){
                rf.emit('failover', client);
            });
        } else {
            // フェイルオーバー処理
            rf.emit('failover', client);
        }
    }
};

// クライアント取得メソッド
RedisFailover.getClient = function() {
    // 次のサーバーを取得
    var server = this.nextServer();
    // クライアントを生成
    var client = redis.createClient(server[0], server[1], this.option);
    // イベントハンドラを設定
    client.on('error', this.errorHandler());
    
    return client;
};

// クライアント取得メソッド
RedisFailover.nextServer = function() {
    // 次のサーバーを取得
    var server = this.servers[this.current++]
    if(this.servers.length <= this.current) {
        this.current = 0;
    }
    
    return server;
};

module.exports = RedisFailover;