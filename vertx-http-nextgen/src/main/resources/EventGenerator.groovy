vertx.setPeriodic(60000) { timerId ->
    vertx.eventBus.publish('events',['type':'timer','time':System.currentTimeMillis()])
}
