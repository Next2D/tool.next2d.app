import { execute } from "./TimelineLayerControllerNameTextActiveStyleService";
import { describe, expect, it, vi } from "vitest";

describe("TimelineLayerControllerNameTextActiveStyleServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");

        div.id = "layer-name-0";
        div.contentEditable    = "false";
        
        // focus()をspyする
        const focusSpy = vi.spyOn(div, 'focus');

        expect(div.contentEditable).toBe("false");

        execute(div);

        expect(div.contentEditable).toBe("true");
        
        // focus()が呼ばれたことを確認
        expect(focusSpy).toHaveBeenCalled();
    });
});