/// <reference types="vitest" />

import { defineConfig } from "vite";

export default defineConfig({
    "server": {
        "open": "index.html"
    },
    "build": {
        "outDir": "docs",
        "target": "esnext",
        "modulePreload": {
            "polyfill": false
        },
        "rollupOptions": { //ファイル出力設定
            "output": {
                "assetFileNames": (assetInfo) =>
                {
                    let extType: string = assetInfo?.name?.split(".")[1] as string;

                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                        extType = "img";
                    }

                    if (extType === "css") {
                        return "assets/css/style.css";
                    }

                    return `assets/${extType}/[name][extname]`;
                },
                "chunkFileNames": "assets/js/[name].js",
                "entryFileNames": "assets/js/nocode-tool.js"
            }
        }
    },
    "test": {
        "globals": true,
        "environment": "jsdom",
        "include": ["src/**/*.test.ts"]
    }
});