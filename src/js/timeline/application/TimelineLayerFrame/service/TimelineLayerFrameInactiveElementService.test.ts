import { execute } from "./TimelineLayerFrameInactiveElementService";

describe("TimelineLayerFrameInactiveElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.classList.add("frame-active");

        expect(div.classList.contains("frame-active")).toBe(true);
        execute(div);
        expect(div.classList.contains("frame-active")).toBe(false);
    });
});