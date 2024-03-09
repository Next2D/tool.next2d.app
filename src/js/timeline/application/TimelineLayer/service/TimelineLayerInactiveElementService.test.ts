import { execute } from "./TimelineLayerInactiveElementService";

describe("TimelineLayerInactiveElementServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const div = document.createElement("div");
        div.classList.add("active");

        expect(div.classList.contains("active")).toBe(true);
        execute(div);
        expect(div.classList.contains("active")).toBe(false);
    });
});