import { execute } from "./TimelineLayerActiveMoveTargetStyleService";

describe("TimelineLayerActiveMoveTargetStyleServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const div = document.createElement("div");

        expect(div.classList.contains("move-target")).toBe(false);
        execute(div);
        expect(div.classList.contains("move-target")).toBe(true);
    });
});