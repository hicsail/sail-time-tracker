FROM node:18 as builder

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy over the source
COPY ../.. .

# Generate Prisma client
RUN npm run prisma:generate

# Build the app
RUN npm run build

############################################
FROM node:18 as runner

WORKDIR /usr/src/app

# Copy over the built app
COPY --from=builder /usr/src/app/dist ./dist

# Install app dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy over the Prisma client
# TODO: When we have a primsa client package, we can uncomment this
# COPY --from=builder /usr/src/app/node_modules/.prisma/client ./node_modules/.prisma/client

# Expose the default port
EXPOSE 3000

CMD ["npm", "run", "start:deploy"]