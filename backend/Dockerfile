FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY wait-for-db.sh .
RUN chmod +x wait-for-db.sh
EXPOSE 5000
CMD ["./wait-for-db.sh", "db", "npm", "start"]
