redis-failover
==============

マスター/スレーブによる自動フェイルオーバー機能を持つ Redis クライアントです。
npm の [redis](https://github.com/mranney/node_redis) クライアントをベースにフェイルオーバー機能を追加しています。

## Install

`npm` コマンドからインストールすることができます。

    npm install redis-failover
    
## Usage

はじめに、モジュールを読み込みます。

    var redis = require('redis-failover');

サーバーリストを定義します。配列の最初の要素はマスターサーバーにあたるポート番号とホスト名を含み、それ以降の要素はスレーブサーバーとして扱われます。

    var servers = [
        [ 6379, 'master.redis.domain.jp' ],
        [ 6379, 'slave.redis.domain.jp' ]
    ];
    
`createClient` メソッドにサーバーリスト `servers` を渡して、クライアントインスタンスを生成します。
`option` 引数も同時に渡すことができます。これは [redis](https://github.com/mranney/node_redis) のクライアントインスタンスにオプションとしてそのまま渡されます。

    var client = redis.createClient(servers, option);

クライアントインスタンスは [redis](https://github.com/mranney/node_redis) と同様に利用することができます。

    client.set("key", "value");
    client.quit();
   
ファイルオーバーの機能は `failover` というイベントとして提供されます。イベントハンドラを設定すれば、新しいクライアントインスタンス `new_client` を受け取ることができます。新しいクライアントインスタンスは、サーバーリストで定義した2番目以降のサーバーに接続した状態で提供されます。

    redis.on('failover', function(new_client) {
    	// Something to do...
    });

## License

**MIT License**

Copyright (c) 2012 Moto Ishizawa

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.