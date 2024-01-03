import { execute } from "./TimelineLayerFrameActiveElementService";

describe("TimelineLayerFrameActiveElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");

        expect(div.classList.contains("frame-active")).toBe(false);
        execute(div);
        expect(div.classList.contains("frame-active")).toBe(true);
    });
});