FROM node:13.2.0-stretch-slim

LABEL Name=BitAgro Version=1.0.0

EXPOSE 5000
#Adjust localtime to your needs
#Set locale
ENV DEBIAN_FRONTEND=noninteractive

RUN mkdir /home/node/app && chown -R node:node /home/node/app

USER node

WORKDIR /home/node/app

COPY . ./

RUN npm install --no-optional && npm cache clean --force

CMD ["npm", "start"]
