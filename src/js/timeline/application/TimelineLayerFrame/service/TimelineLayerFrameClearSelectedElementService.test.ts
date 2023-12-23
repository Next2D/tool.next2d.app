import { execute } from "./TimelineLayerFrameClearSelectedElementService";
import { timelineLayer } from "../../../domain/model/TimelineLayer";

describe("TimelineLayerFrameClearSelectedElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const div1 = document.createElement("div");
        div1.setAttribute("class", "frame-active");

        const div2 = document.createElement("div");
        div2.setAttribute("class", "frame-active");

        const div3 = document.createElement("div");
        div3.setAttribute("class", "frame-active");

        const targetFrames = timelineLayer.targetFrames;
        expect(targetFrames.size).toBe(0);

        targetFrames.set(0, [div1, div3]);
        targetFrames.set(1, [div2]);
        expect(targetFrames.size).toBe(2);

        expect(div1.classList.contains("frame-active")).toBe(true);
        expect(div2.classList.contains("frame-active")).toBe(true);
        expect(div3.classList.contains("frame-active")).toBe(true);

        execute();

        expect(targetFrames.size).toBe(0);
        expect(div1.classList.contains("frame-active")).toBe(false);
        expect(div2.classList.contains("frame-active")).toBe(false);
        expect(div3.classList.contains("frame-active")).toBe(false);
    });
});