import type { Config } from "tailwindcss";

const config: Config = {
    // ... content 等配置
    plugins: [
        require("tailwindcss-animate"), // shadcn 用的
        require("@tailwindcss/typography"), // 新加的：文章排版神器
    ],
};
export default config;