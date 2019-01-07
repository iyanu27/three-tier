# Build node modules with node image
FROM node AS frontend
ADD frontend /app
RUN cd /app && npm install && npm i -g webpack webpack-cli && \
    NODE_ENV=production webpack --mode production

# Use an ubuntu-based image for running the app
FROM phusion/baseimage

RUN mkdir /app

# Install pip
RUN curl https://bootstrap.pypa.io/get-pip.py -o /tmp/get-pip.py && \
    python3 /tmp/get-pip.py

# Install pip dependencies
ADD backend /app

# Copy file build by node module
COPY --from=frontend /app/dist/bundle.js /app/static/bundle.js

RUN cd /app && pip3 install -r requirements.txt && \
    python3 local.py && \
    python3 -m test -v
    # Testing is incorporated into the build process

# Create backend service
RUN mkdir /etc/service/app && \
    echo "#!/usr/bin/env bash\ncd /app && python3 app.py" > /etc/service/app/run && \
    chmod +x /etc/service/app/run

# Create the runtime init for the database
RUN echo "#!/usr/bin/env bash\ncd /app && python3 local.py" > /etc/my_init.d/engine.sh && \
    chmod +x /etc/my_init.d/engine.sh

ENV APP_MODE production

RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
