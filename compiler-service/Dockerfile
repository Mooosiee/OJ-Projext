FROM node:18-alpine

WORKDIR /compiler-service-backend 
#This will create a folder which will store all my compiler-service code

RUN apk update && apk add --no-cache g++
#Install dependencies

COPY . .
#COPY <local_dir> <work_dir> = copying all the code into the container

RUN npm install 

EXPOSE 8000

CMD ["node","server.js"]
#cmd for starting the application

