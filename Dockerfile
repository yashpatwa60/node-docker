#Import nodejs from docker hub
FROM node:15

#Specifies the working directory
WORKDIR /app

#Copies the package.json file to /app or . or ./
COPY package.json .

#Intalls all the dependencies
# RUN npm install
ARG NODE_ENV 
RUN if [ "$NODE_ENV" = "development" ] \
        then npm install; \
        else npm install --only=production \
        fi

#Copy all the files from current directory to working directory
### Note: We have had copy json file earlier, Copying back for optimization.
COPY . ./

ENV PORT 3000

EXPOSE $PORT

CMD ["npm", "run", "dev"]
