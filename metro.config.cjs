const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

// 添加自定義的別名
defaultConfig.resolver.alias = {
  "@": "./src", // 與 tsconfig.json 的配置保持一致
  "@assets": "./assets",
};

module.exports = defaultConfig;
