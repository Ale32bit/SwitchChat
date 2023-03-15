FROM node:18-alpine
WORKDIR /build
COPY ["package.json", "package-lock.json", "./"]
RUN npm install
ENV NODE_ENV=production
COPY . .
RUN mkdir docs out
RUN npm run docs
CMD cp -r docs/* out/
