# 1. Use official Node.js image as the base image
FROM node:19-alpine AS build
# 2. Set the working directory in the container
WORKDIR /app

# 3. Copy the package.json, package-lock.json and installing dependencies
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# 4. Copy the rest of the application codes and build it
COPY . .
RUN npm run build && ls -l /app/dist

# 5. Use Nginx to serve the built React app
FROM nginx:latest

# 6. Set the working directory
WORKDIR /usr/share/nginx/html

# 7. Remove the default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# 8. Copy the built files to Nginx's default public directory
COPY --from=build /app/dist /usr/share/nginx/html

RUN ls -l /usr/share/nginx/html
# 9. Copy the Nginx configuration file
#COPY nginx.conf /etc/nginx/nginx.conf

# 10. Expose port 3000
EXPOSE 80

# 11. Start Nginx
CMD ["nginx", "-g", "daemon off;"]

LABEL authors="aungtuntun"