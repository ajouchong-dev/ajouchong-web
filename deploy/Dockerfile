FROM node:18.17.0 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
#RUN npm run build

FROM node:18.17.0
WORKDIR /app
COPY --from=builder /app /app
EXPOSE 3000
CMD ["npm", "start"]
