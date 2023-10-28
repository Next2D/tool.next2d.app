import { execute } from "./ScreenTabDragOverService";

describe("ScreenTabDragOverServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");

        const mockEvent = {
            "preventDefault": () => { return null },
            "currentTarget": div
        };

        expect(div.classList.contains("drop-target")).toBe(false);
        execute(mockEvent);
        expect(div.classList.contains("drop-target")).toBe(true);
    });
});