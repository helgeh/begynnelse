FROM node:lts-alpine3.18

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install --quiet

COPY . .

# RUN chown node ./uploads

RUN chown -R node ./public

EXPOSE 3001

RUN npm run build

# Install python/pip
# ENV PYTHONUNBUFFERED=1
# RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
# RUN python3 -m ensurepip
# RUN pip3 install --no-cache --upgrade pip setuptools
# RUN pip3 install --no-cache fonttools

USER node


CMD [ "npm", "start" ]