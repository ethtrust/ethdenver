#
# ---- Base Node ----
FROM node:16-alpine3.14 AS base
# install node
RUN apk update && \
  apk add --no-cache git

ENV TINI_VERSION v0.19.0
#Sets an environment variable
ENV PORT 3000

ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini-static /usr/bin/tini

RUN chmod +x /usr/bin/tini
# set working directory
RUN mkdir -p "/usr/src/app"
WORKDIR /usr/src/app
# Set tini as entrypoint
ENTRYPOINT ["/usr/bin/tini", "--"]
# copy project file
COPY package.json .

#
# ---- Dependencies ----
FROM base AS dependencies
# install node packages
RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production
# copy production node_modules aside
RUN cp -R node_modules prod_node_modules
# install ALL node_modules, including 'devDependencies'
# RUN npm install

# ---- Release ----
FROM base AS release
# copy production node_modules
COPY --from=dependencies /usr/src/app/prod_node_modules ./node_modules
# copy app sources
COPY . /usr/src/app
# expose port and define CMD
EXPOSE 3000

RUN npm run build

CMD ["/usr/local/bin/npm", "run", "start"]
