import { describe, it, expect } from "vitest";
import { execute } from "./ScreenDisplayObjectSvgTagComponent";

describe("ScreenDisplayObjectSvgTagComponent", () => {
    describe("基本的なSVG生成", () => {
        it("正しいSVG構造を生成する", () => {
            const base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
            const width = 100;
            const height = 100;
            const image_width = 50;
            const image_height = 50;
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

            const result = execute(base64, width, height, image_width, image_height, matrix);

            // SVGタグの基本構造を確認
            expect(result).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
            expect(result).toContain(`width="${width}"`);
            expect(result).toContain(`height="${height}"`);
            expect(result).toContain(`viewBox="0 0 ${width} ${height}"`);
            expect(result).toContain('preserveAspectRatio="none"');
            expect(result).toContain('<image');
            expect(result).toContain(`href="${base64}"`);
            expect(result).toContain(`width="${image_width}"`);
            expect(result).toContain(`height="${image_height}"`);
            expect(result).toContain('transform="matrix(');
            expect(result).toContain('</svg>');
        });

        it("1行のSVG文字列を生成する", () => {
            const base64 = "data:image/png;base64,test";
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

            const result = execute(base64, 100, 100, 50, 50, matrix);

            // 改行が含まれていないことを確認
            expect(result).not.toContain('\n');
            expect(result).not.toContain('\r');
        });
    });

    describe("Matrix変換の計算", () => {
        it("単位行列の場合、中央配置の変換が計算される", () => {
            const base64 = "data:image/png;base64,test";
            const width = 200;
            const height = 200;
            const image_width = 100;
            const image_height = 100;
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

            const result = execute(base64, width, height, image_width, image_height, matrix);

            // cx = 100 / 2 = 50
            // cy = 100 / 2 = 50
            // matrix[4] = 200 / 2 - 1 * 50 - 0 * 50 = 100 - 50 = 50
            // matrix[5] = 200 / 2 - 0 * 50 - 1 * 50 = 100 - 50 = 50
            expect(result).toContain('transform="matrix(1 0 0 1 50 50)"');
        });

        it("スケール変換を含むMatrixの計算", () => {
            const base64 = "data:image/png;base64,test";
            const width = 200;
            const height = 200;
            const image_width = 100;
            const image_height = 100;
            const matrix = new Float32Array([2, 0, 0, 2, 0, 0]); // 2倍スケール

            const result = execute(base64, width, height, image_width, image_height, matrix);

            // cx = 100 / 2 = 50
            // cy = 100 / 2 = 50
            // matrix[4] = 200 / 2 - 2 * 50 - 0 * 50 = 100 - 100 = 0
            // matrix[5] = 200 / 2 - 0 * 50 - 2 * 50 = 100 - 100 = 0
            expect(result).toContain('transform="matrix(2 0 0 2 0 0)"');
        });

        it("回転変換を含むMatrixの計算", () => {
            const base64 = "data:image/png;base64,test";
            const width = 200;
            const height = 200;
            const image_width = 100;
            const image_height = 100;
            // 45度回転のMatrix（近似値）
            const cos45 = Math.cos(Math.PI / 4);
            const sin45 = Math.sin(Math.PI / 4);
            const matrix = new Float32Array([cos45, sin45, -sin45, cos45, 0, 0]);

            const result = execute(base64, width, height, image_width, image_height, matrix);

            // Float32Arrayの精度の問題があるため、個別に検証
            expect(result).toContain('transform="matrix(');
            expect(result).toContain('width="200"');
            expect(result).toContain('height="200"');
            // matrixの最初の4要素（回転成分）を確認
            expect(result).toMatch(/transform="matrix\([0-9.]+\s+[0-9.]+\s+-[0-9.]+\s+[0-9.]+\s+[0-9.]+\s+[0-9.]+\)"/);
        });

        it("非対称スケールの計算", () => {
            const base64 = "data:image/png;base64,test";
            const width = 200;
            const height = 200;
            const image_width = 100;
            const image_height = 100;
            const matrix = new Float32Array([2, 0, 0, 3, 0, 0]); // X方向2倍、Y方向3倍

            const result = execute(base64, width, height, image_width, image_height, matrix);

            // cx = 50, cy = 50
            // matrix[4] = 100 - 2 * 50 - 0 * 50 = 0
            // matrix[5] = 100 - 0 * 50 - 3 * 50 = 100 - 150 = -50
            expect(result).toContain('transform="matrix(2 0 0 3 0 -50)"');
        });

        it("既存のmatrix[4]とmatrix[5]の値は上書きされる", () => {
            const base64 = "data:image/png;base64,test";
            const width = 100;
            const height = 100;
            const image_width = 50;
            const image_height = 50;
            const matrix = new Float32Array([1, 0, 0, 1, 999, 888]); // 既存の平行移動値

            const result = execute(base64, width, height, image_width, image_height, matrix);

            // cx = 25, cy = 25
            // matrix[4] = 50 - 1 * 25 - 0 * 25 = 25
            // matrix[5] = 50 - 0 * 25 - 1 * 25 = 25
            expect(result).toContain('transform="matrix(1 0 0 1 25 25)"');
            expect(result).not.toContain('999');
            expect(result).not.toContain('888');
        });
    });

    describe("サイズのバリエーション", () => {
        it("小さいサイズでも正しく動作する", () => {
            const base64 = "data:image/png;base64,test";
            const width = 10;
            const height = 10;
            const image_width = 5;
            const image_height = 5;
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

            const result = execute(base64, width, height, image_width, image_height, matrix);

            // cx = 2.5, cy = 2.5
            // matrix[4] = 5 - 1 * 2.5 - 0 * 2.5 = 2.5
            // matrix[5] = 5 - 0 * 2.5 - 1 * 2.5 = 2.5
            expect(result).toContain('width="10"');
            expect(result).toContain('height="10"');
            expect(result).toContain('transform="matrix(1 0 0 1 2.5 2.5)"');
        });

        it("大きいサイズでも正しく動作する", () => {
            const base64 = "data:image/png;base64,test";
            const width = 2000;
            const height = 2000;
            const image_width = 1000;
            const image_height = 1000;
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

            const result = execute(base64, width, height, image_width, image_height, matrix);

            // cx = 500, cy = 500
            // matrix[4] = 1000 - 1 * 500 - 0 * 500 = 500
            // matrix[5] = 1000 - 0 * 500 - 1 * 500 = 500
            expect(result).toContain('width="2000"');
            expect(result).toContain('height="2000"');
            expect(result).toContain('transform="matrix(1 0 0 1 500 500)"');
        });

        it("幅と高さが異なる場合", () => {
            const base64 = "data:image/png;base64,test";
            const width = 300;
            const height = 200;
            const image_width = 150;
            const image_height = 100;
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

            const result = execute(base64, width, height, image_width, image_height, matrix);

            // cx = 75, cy = 50
            // matrix[4] = 150 - 1 * 75 - 0 * 50 = 75
            // matrix[5] = 100 - 0 * 75 - 1 * 50 = 50
            expect(result).toContain('width="300"');
            expect(result).toContain('height="200"');
            expect(result).toContain('transform="matrix(1 0 0 1 75 50)"');
        });

        it("画像サイズがビューポートより大きい場合", () => {
            const base64 = "data:image/png;base64,test";
            const width = 100;
            const height = 100;
            const image_width = 200;
            const image_height = 200;
            const matrix = new Float32Array([0.5, 0, 0, 0.5, 0, 0]); // 0.5倍スケール

            const result = execute(base64, width, height, image_width, image_height, matrix);

            // cx = 100, cy = 100
            // matrix[4] = 50 - 0.5 * 100 - 0 * 100 = 50 - 50 = 0
            // matrix[5] = 50 - 0 * 100 - 0.5 * 100 = 50 - 50 = 0
            expect(result).toContain('width="200"');
            expect(result).toContain('height="200"');
            expect(result).toContain('transform="matrix(0.5 0 0 0.5 0 0)"');
        });
    });

    describe("Base64データURL", () => {
        it("PNGのbase64データURLを正しく埋め込む", () => {
            const base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

            const result = execute(base64, 100, 100, 50, 50, matrix);

            expect(result).toContain(`href="${base64}"`);
        });

        it("JPEGのbase64データURLを正しく埋め込む", () => {
            const base64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAAAAA//Z";
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

            const result = execute(base64, 100, 100, 50, 50, matrix);

            expect(result).toContain(`href="${base64}"`);
        });

        it("空のbase64文字列でも動作する", () => {
            const base64 = "";
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

            const result = execute(base64, 100, 100, 50, 50, matrix);

            expect(result).toContain('href=""');
            expect(result).toContain('<svg');
            expect(result).toContain('</svg>');
        });
    });

    describe("小数点の扱い", () => {
        it("小数点を含むサイズの計算が正しく行われる", () => {
            const base64 = "data:image/png;base64,test";
            const width = 150.5;
            const height = 100.5;
            const image_width = 75.25;
            const image_height = 50.25;
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

            const result = execute(base64, width, height, image_width, image_height, matrix);

            // cx = 75.25 / 2 = 37.625
            // cy = 50.25 / 2 = 25.125
            // matrix[4] = 150.5 / 2 - 1 * 37.625 - 0 * 25.125 = 75.25 - 37.625 = 37.625
            // matrix[5] = 100.5 / 2 - 0 * 37.625 - 1 * 25.125 = 50.25 - 25.125 = 25.125
            expect(result).toContain('width="150.5"');
            expect(result).toContain('height="100.5"');
            expect(result).toContain('transform="matrix(1 0 0 1 37.625 25.125)"');
        });

        it("Matrix要素に小数点が含まれる場合", () => {
            const base64 = "data:image/png;base64,test";
            const width = 100;
            const height = 100;
            const image_width = 50;
            const image_height = 50;
            const matrix = new Float32Array([1.5, 0.2, 0.3, 1.5, 0, 0]);

            const result = execute(base64, width, height, image_width, image_height, matrix);

            // cx = 25, cy = 25
            // matrix[4] = 50 - 1.5 * 25 - 0.3 * 25 = 50 - 37.5 - 7.5 = 5
            // matrix[5] = 50 - 0.2 * 25 - 1.5 * 25 = 50 - 5 - 37.5 = 7.5
            // Float32Arrayの精度の問題があるため、おおよその値を確認
            expect(result).toMatch(/transform="matrix\(1\.5\s+0\.2[0-9]*\s+0\.3[0-9]*\s+1\.5\s+[45]\.[0-9]+\s+7\.5\)"/);
        });
    });

    describe("Matrix配列のjoin処理", () => {
        it("Matrix要素がスペース区切りで連結される", () => {
            const base64 = "data:image/png;base64,test";
            const matrix = new Float32Array([1, 2, 3, 4, 5, 6]);

            const result = execute(base64, 100, 100, 50, 50, matrix);

            // matrix.join(" ")により、スペース区切りになる
            expect(result).toContain('transform="matrix(1 2 3 4');
            // matrix[4]とmatrix[5]は再計算される
        });

        it("負の値を含むMatrixが正しく扱われる", () => {
            const base64 = "data:image/png;base64,test";
            const width = 100;
            const height = 100;
            const image_width = 50;
            const image_height = 50;
            const matrix = new Float32Array([-1, 0, 0, -1, 0, 0]); // 反転

            const result = execute(base64, width, height, image_width, image_height, matrix);

            // cx = 25, cy = 25
            // matrix[4] = 50 - (-1) * 25 - 0 * 25 = 50 + 25 = 75
            // matrix[5] = 50 - 0 * 25 - (-1) * 25 = 50 + 25 = 75
            expect(result).toContain('transform="matrix(-1 0 0 -1 75 75)"');
        });

        it("ゼロを含むMatrixが正しく扱われる", () => {
            const base64 = "data:image/png;base64,test";
            const width = 100;
            const height = 100;
            const image_width = 50;
            const image_height = 50;
            const matrix = new Float32Array([0, 0, 0, 0, 0, 0]);

            const result = execute(base64, width, height, image_width, image_height, matrix);

            // cx = 25, cy = 25
            // matrix[4] = 50 - 0 * 25 - 0 * 25 = 50
            // matrix[5] = 50 - 0 * 25 - 0 * 25 = 50
            expect(result).toContain('transform="matrix(0 0 0 0 50 50)"');
        });
    });

    describe("SVG属性の形式", () => {
        it("preserveAspectRatioがnoneに設定される", () => {
            const base64 = "data:image/png;base64,test";
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

            const result = execute(base64, 100, 100, 50, 50, matrix);

            expect(result).toContain('preserveAspectRatio="none"');
        });

        it("viewBoxが正しく設定される", () => {
            const base64 = "data:image/png;base64,test";
            const width = 200;
            const height = 150;
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

            const result = execute(base64, width, height, 100, 100, matrix);

            expect(result).toContain('viewBox="0 0 200 150"');
        });

        it("xmlns属性が正しく設定される", () => {
            const base64 = "data:image/png;base64,test";
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

            const result = execute(base64, 100, 100, 50, 50, matrix);

            expect(result).toContain('xmlns="http://www.w3.org/2000/svg"');
        });

        it("imageタグが自己完結タグとして生成される", () => {
            const base64 = "data:image/png;base64,test";
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

            const result = execute(base64, 100, 100, 50, 50, matrix);

            expect(result).toContain('<image');
            expect(result).toContain('/>');
            // </image>タグは存在しない
            expect(result).not.toContain('</image>');
        });
    });

    describe("統合シナリオ", () => {
        it("実際のマスク適用シナリオ", () => {
            const base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
            const width = 300;
            const height = 250;
            const image_width = 150;
            const image_height = 125;
            const matrix = new Float32Array([1.2, 0, 0, 1.2, 0, 0]);

            const result = execute(base64, width, height, image_width, image_height, matrix);

            // 全ての要素が含まれることを確認
            expect(result).toMatch(/<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="300" height="250" viewBox="0 0 300 250" preserveAspectRatio="none"><image href="data:image\/png;base64,.*" width="150" height="125" transform="matrix\(.*\)" \/><\/svg>/);
        });

        it("複雑な変換を含むシナリオ", () => {
            const base64 = "data:image/png;base64,test";
            const width = 400;
            const height = 300;
            const image_width = 200;
            const image_height = 150;
            // スケール、回転、歪みを含むMatrix
            const matrix = new Float32Array([1.5, 0.5, -0.3, 1.2, 0, 0]);

            const result = execute(base64, width, height, image_width, image_height, matrix);

            // cx = 100, cy = 75
            // matrix[4] = 200 - 1.5 * 100 - (-0.3) * 75 = 200 - 150 + 22.5 = 72.5
            // matrix[5] = 150 - 0.5 * 100 - 1.2 * 75 = 150 - 50 - 90 = 10
            // Float32Arrayの精度の問題があるため、おおよその値を確認
            expect(result).toMatch(/transform="matrix\(1\.5\s+0\.5\s+-0\.3[0-9]*\s+1\.2[0-9]*\s+72\.5\s+[0-9]+[0-9.]*\)"/);
            expect(result).toContain('width="400"');
            expect(result).toContain('height="300"');
        });

        it("最小サイズのシナリオ", () => {
            const base64 = "data:image/png;base64,x";
            const width = 1;
            const height = 1;
            const image_width = 1;
            const image_height = 1;
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

            const result = execute(base64, width, height, image_width, image_height, matrix);

            // cx = 0.5, cy = 0.5
            // matrix[4] = 0.5 - 1 * 0.5 - 0 * 0.5 = 0
            // matrix[5] = 0.5 - 0 * 0.5 - 1 * 0.5 = 0
            expect(result).toContain('transform="matrix(1 0 0 1 0 0)"');
        });
    });
});
