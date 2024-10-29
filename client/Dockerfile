# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend source code to the container
COPY . .

# Expose the port on which your frontend server will listen (replace 3000 with your actual port)
EXPOSE 3000

# Command to start the frontend server using npm start
CMD ["npm", "start"]
