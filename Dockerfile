FROM node:20-alpine

# Cài đặt Python 3 và các công cụ cần thiết
RUN apk add --no-cache \
    python3 \
    py3-pip \
    build-base

# Cài đặt yarn và pm2 toàn cục
RUN apk add --no-cache yarn && \
    yarn global add pm2

# Tạo thư mục ứng dụng
WORKDIR /usr/src/app

RUN npm install -g @nestjs/cli

# Cài đặt các phụ thuộc
RUN yarn install

# Sao chép package.json và yarn.lock (nếu có)
COPY package.json yarn.lock ./

# Sao chép mã nguồn ứng dụng
COPY . .

# Build ứng dụng NestJS
RUN yarn build

# Expose cổng mà ứng dụng sẽ chạy
EXPOSE 3000

# Chạy ứng dụng với PM2
# CMD ["pm2-runtime", "start", "dist/main.js"]