#!/usr/bin/env node
/* eslint-env node */

const env = process.env.VERCEL_ENV || process.env.NODE_ENV || "未设置";
const isProd = env === "production";
const isPreview = env === "preview";
const isDev = env === "development";

console.log("============== 构建环境探测 ==============");
console.log(`VERCEL_ENV: ${process.env.VERCEL_ENV ?? "未定义"}`);
console.log(`NODE_ENV  : ${process.env.NODE_ENV ?? "未定义"}`);
console.log(
  `判断结果  : ${isProd ? "生产构建" : isPreview ? "预览构建" : isDev ? "开发构建" : "未知/本地自定义"}`,
);
console.log("=========================================");

