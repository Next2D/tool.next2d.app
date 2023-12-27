import { execute } from "./TimelineLayerActiveElementService";

describe("TimelineLayerActiveElementServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const div = document.createElement("div");
        expect(div.classList.contains("active")).toBe(false);
        execute(div);
        expect(div.classList.contains("active")).toBe(true);
    });
});