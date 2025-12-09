import nextConfig from "eslint-config-next";

const config = [
  ...nextConfig,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      ".npm-cache/**",
      ".config/**",
      "scripts/**",
    ],
  },
];

export default config;
