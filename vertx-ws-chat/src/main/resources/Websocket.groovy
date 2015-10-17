import org.vertx.groovy.core.buffer.Buffer
import org.vertx.groovy.core.http.WebSocket

container.deployModule('io.vertx~mod-web-server~2.0.0-final', [
    web_root: 'web',
    port: 80,
    ssl: false,
    host: '0.0.0.0'
])

def clients = []

def server = vertx.createHttpServer(
    SSL: true,
    keyStorePath: "keystore.jks",
    keyStorePassword: "changeit"
)

server.websocketHandler { WebSocket socket ->
    clients << socket
    socket.dataHandler { Buffer buffer ->
        def msg = buffer.toString()
        clients.each {
            if (it != socket) {
                it.writeTextFrame(msg)
            }
        }
    }
    socket.closeHandler {
        clients.remove(socket)
    }
}

server.listen(443)
