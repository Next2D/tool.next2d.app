import { execute } from "./TimelineLayerFrameUpdateStyleService";
import { timelineLayer } from "../../../domain/model/TimelineLayer";

describe("TimelineLayerFrameUpdateStyleServiceTest", () =>
{
    test("execute test", () =>
    {
        timelineLayer.targetLayers.set(0, [1]);

        const div = document.createElement("div");
        div.dataset.layerId = "0";

        // フレームを生成してセット
        for (let idx = 0; idx < 10; ++idx) {
            const node = document.createElement("div");
            div.appendChild(node);

            // 初期値の確認
            expect(node.dataset.frame).toBe(undefined);
        }

        // 初期値のテスト
        execute(div, 1);
        for (let idx = 0; idx < 10; ++idx) {

            const frame = idx + 1;

            const node = div.children[idx] as HTMLElement;
            expect(node.dataset.frame).toBe(`${frame}`);

            expect(node.classList.contains("frame")).toBe(true);
            if (frame % 5 !== 0) {
                expect(node.classList.contains("frame-pointer")).toBe(false);
            } else {
                expect(node.classList.contains("frame-pointer")).toBe(true);
            }

            if (frame === 1) {
                expect(node.classList.contains("frame-active")).toBe(true);
            } else {
                expect(node.classList.contains("frame-active")).toBe(false);
            }
        }

        // スクロール位置のテスト
        execute(div, 6);
        for (let idx = 0; idx < 10; ++idx) {

            const frame = idx + 6;

            const node = div.children[idx] as HTMLElement;
            expect(node.dataset.frame).toBe(`${frame}`);

            expect(node.classList.contains("frame")).toBe(true);
            expect(node.classList.contains("frame-active")).toBe(false);

            if (frame % 5 !== 0) {
                expect(node.classList.contains("frame-pointer")).toBe(false);
            } else {
                expect(node.classList.contains("frame-pointer")).toBe(true);
            }
        }
    });
});