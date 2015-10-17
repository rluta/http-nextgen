FROM java8
MAINTAINER raphael.luta@gmail.com

RUN cd / && (curl -sL http://dl.bintray.com/vertx/downloads/vert.x-2.1.5.tar.gz | tar zxvf -) && ln -sf vert.x* vertx
RUN chmod 755 /vertx/bin/*
ENV PATH $PATH:/vertx/bin
WORKDIR /vertx

ADD build/mods /vertx/mods

CMD vertx runmod com.aptiwan~vertx-ws-chat~1.0.0
