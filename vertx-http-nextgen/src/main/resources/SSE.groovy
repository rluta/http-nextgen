import org.vertx.groovy.core.buffer.Buffer
import org.vertx.groovy.core.eventbus.Message
import org.vertx.groovy.core.http.HttpServerRequest
import org.vertx.groovy.core.http.HttpServerResponse
import org.vertx.groovy.core.http.RouteMatcher
import org.vertx.java.core.json.JsonArray
import org.vertx.java.core.json.JsonObject

def server = vertx.createHttpServer()
def rm = new RouteMatcher()
def clients = []

rm.get('/stream') { HttpServerRequest req ->
    clients << req.response

    req.response.closeHandler {
        clients.remove(req.response)
    }

    req.response.with {
        statusCode = 200; chunked = true
        putHeader('Content-Type','text/event-stream')
        putHeader('Access-Control-Allow-Origin','*')
        putHeader('Cache-Control','public, no-cache')
        write('retry: 1000\nevent: hello\ndata: {"type":"hello"}\n\n')
    }

    vertx.eventBus.send('twitter',[:]) { msg ->
        req.response.write("event: subscriptions\ndata: ${msg.body().join(',')}\n\n")
    }
}

rm.noMatch { HttpServerRequest req ->
    req.response.statusCode = 404
    req.response.statusMessage = "Not Found"
    req.response.end()
}

vertx.eventBus.registerHandler('events') { Message msg ->
    def jsonBody = new JsonObject((Map)msg.body().data)
    def dataString = "event: ${msg.body().type}\ndata: ${jsonBody.encode()}\n\n"

    clients.each { HttpServerResponse resp ->
        try {
            resp.write(dataString)
        } catch (Exception e) {
            container.logger.error(e)
        }
    }
}

server.requestHandler(rm.asClosure()).listen(7001)
