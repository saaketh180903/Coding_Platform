# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Install necessary dependencies for compiling C/C++ code, Python, and Java
RUN apt-get update && apt-get install -y build-essential gcc g++ python3 default-jdk



# Copy the rest of the backend source code to the container
COPY . .

# Expose the port on which your backend server will listen (replace 3001 with your actual port)
EXPOSE 3001

# Command to start the backend server (replace "start" with the command to start your server)
CMD ["npm", "start"]
