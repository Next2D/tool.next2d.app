import { execute } from "./TimelineLayerElementUpdateDisplayService";

describe("TimelineLayerElementUpdateDisplayServiceTest", () =>
{
    test("execute test", (): void =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = "layer-id-0";
        div.style.display = "";

        expect(div.style.display).toBe("");
        execute(0, "none");
        expect(div.style.display).toBe("none");
        execute(0, "");
        expect(div.style.display).toBe("");

        div.remove();
    });
});