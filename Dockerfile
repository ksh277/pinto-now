# 베이스 이미지
FROM node:20-alpine AS base

# pnpm 설치
RUN npm install -g pnpm

# 의존성 설치를 위한 stage
FROM base AS deps
WORKDIR /app

# 패키지 파일 복사
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# 빌드를 위한 stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Prisma 클라이언트 생성
RUN pnpm prisma:generate

# Next.js 빌드
RUN pnpm build

# 런타임을 위한 stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 필요한 파일들만 복사
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma 관련 파일 복사
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]