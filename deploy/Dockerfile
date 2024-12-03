FROM node:18.17.0

WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy project files
COPY . .

## Step 6: Build the project (if applicable)
#RUN npm run build

# Step 7: Expose the application port
EXPOSE 3000

# Step 8: Start the application
CMD ["npm", "start"]

