import { execute } from "./TimelineLayerControllerNameTextActiveStyleService";
import { describe, expect, it } from "vitest";

describe("TimelineLayerControllerNameTextActiveStyleServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");

        div.id = "layer-name-0";
        div.contentEditable    = "false";
        div.style.borderBottom = "";

        expect(div.contentEditable).toBe("false");
        expect(div.style.borderBottom).toBe("");

        execute(div);

        expect(div.contentEditable).toBe("true");
        expect(div.style.borderBottom).toBe("1px solid rgb(245, 245, 245)");
    });
});