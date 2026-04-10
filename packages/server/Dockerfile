FROM node:22 AS builder

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install without the schema present so @prisma/client postinstall cannot
# pre-generate and create /node_modules as a real directory
RUN npm install

# The Prisma schema output (../../../node_modules from /app/prisma/) resolves to
# /node_modules. Symlink it so generated types land in /app/node_modules/.prisma/client
# where @prisma/client can find them.
RUN ln -s /app/node_modules /node_modules

COPY . .

RUN npm run build

FROM node:22

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/migration ./migration

EXPOSE 3000

CMD npm run migrate:deploy && npm run start:prod;