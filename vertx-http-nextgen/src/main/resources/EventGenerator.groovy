vertx.setPeriodic(60000) { timerId ->
    vertx.eventBus.publish('events',['type':'timer','data':['ts':System.currentTimeMillis()]])
}
