import { execute } from "./TimelineLayerInactiveMoveTargetStyleService";

describe("TimelineLayerInactiveMoveTargetStyleServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const div = document.createElement("div");
        div.classList.add("move-target");

        expect(div.classList.contains("move-target")).toBe(true);
        execute(div);
        expect(div.classList.contains("move-target")).toBe(false);
    });
});