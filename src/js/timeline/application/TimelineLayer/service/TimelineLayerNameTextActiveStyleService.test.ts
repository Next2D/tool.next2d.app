import { execute } from "./TimelineLayerNameTextActiveStyleService";

describe("TimelineLayerNameTextActiveStyleServiceTest", () =>
{
    test("execute test", async () =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);

        div.id = "layer-name-0";
        div.contentEditable    = "false";
        div.style.borderBottom = "";

        expect(div.contentEditable).toBe("false");
        expect(div.style.borderBottom).toBe("");

        execute(0);

        expect(div.contentEditable).toBe("true");
        expect(div.style.borderBottom).toBe("1px solid #f5f5f5");

        div.remove();
    });
});