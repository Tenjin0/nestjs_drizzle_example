FROM node:24-alpine

# replace this with your application's default port
EXPOSE 3100


COPY ./src /src
COPY ./generate_keys.sh generate_keys.sh
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json 
COPY .env .env

RUN npm install
# RUN npm install -g @nestjs/cli
# RUN nest build
RUN apk add --update openssl
RUN ./generate_keys.sh
# RUN ls -l
CMD ["npm", "run" "start:prod"]
