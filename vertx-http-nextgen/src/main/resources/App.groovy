// bootstrap verticle handling configuration and instanciation of
// main verticles

def adminWebConf = [
    web_root: 'web',
    port: 4242,
    host: '127.0.0.1',
    ssl: false,
    bridge: true,
    inbound_permitted: [
        [:]
    ],
    outbound_permitted: [
        [:]
    ]
]

container.with {
    deployModule('io.vertx~mod-web-server~2.0.0-final', [
        web_root: 'web',
        port: 8888,
        ssl: false,
        host: '0.0.0.0'
    ])
    deployModule('io.vertx~mod-web-server~2.0.0-final', adminWebConf)

    deployVerticle('SSE.groovy')
    deployVerticle('EventGenerator.groovy')
    deployVerticle('TwitterGenerator.groovy')
}
