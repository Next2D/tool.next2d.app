import { execute } from "./TimelineLayerFrameUpdateStyleService";

describe("TimelineLayerFrameUpdateStyleServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");

        for (let idx = 0; idx < 10; ++idx) {
            const node = document.createElement("div");
            div.appendChild(node);

            expect(node.dataset.frame).toBe(undefined);
        }

        // 初期値のテスト
        execute(div, 1);
        for (let idx = 0; idx < 10; ++idx) {

            const frame = idx + 1;

            const node = div.children[idx];
            expect(node.dataset.frame).toBe(`${frame}`);

            expect(node.classList.contains("frame")).toBe(true);
            if (frame % 5 !== 0) {
                expect(node.classList.contains("frame-pointer")).toBe(false);
            } else {
                expect(node.classList.contains("frame-pointer")).toBe(true);
            }
        }

        // スクロール位置のテスト
        execute(div, 6);
        for (let idx = 0; idx < 10; ++idx) {

            const frame = idx + 6;

            const node = div.children[idx];
            expect(node.dataset.frame).toBe(`${frame}`);

            expect(node.classList.contains("frame")).toBe(true);
            if (frame % 5 !== 0) {
                expect(node.classList.contains("frame-pointer")).toBe(false);
            } else {
                expect(node.classList.contains("frame-pointer")).toBe(true);
            }
        }
    });
});