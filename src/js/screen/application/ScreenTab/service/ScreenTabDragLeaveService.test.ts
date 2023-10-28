import { execute } from "./ScreenTabDragLeaveService";

describe("ScreenTabDragLeaveServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.classList.add("drop-target");

        const mockEvent = {
            "preventDefault": () => { return null },
            "currentTarget": div
        };

        expect(div.classList.contains("drop-target")).toBe(true);
        execute(mockEvent);
        expect(div.classList.contains("drop-target")).toBe(false);
    });
});