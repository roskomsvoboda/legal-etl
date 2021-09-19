FROM node:14.17.6

# EXPOSE 3010

WORKDIR /usr/src/app
 
# COPY ./ /usr/src/app/


COPY ./src /usr/src/app/src
COPY ./index.js /usr/src/app/
COPY ./package.json /usr/src/app/

RUN apt update -y

RUN apt install libnspr4 libnss3 libnss3-dev libnss3-tools libatk-bridge2.0-0 libgtk-3.0 libasound2 -y

# COPY ./src/ETL /usr/src/app/dirETL

# COPY ./init-etl-dir.sh /usr/src/app/

# RUN source /usr/src/app/init-etl-dir.sh

# RUN chmod -R 777 /usr/src/app/src/ETL

# VOLUME /usr/src/app/src/ETL

# RUN npm install

# RUN npm install --global yarn

RUN yarn install