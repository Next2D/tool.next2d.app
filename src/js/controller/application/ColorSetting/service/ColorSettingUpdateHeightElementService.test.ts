import { execute } from "./ColorSettingUpdateHeightElementService";
import { $TRANSFORM_OBJECT_HEIGHT_ID } from "../../../../config/TransformSettingConfig";
import { describe, expect, it } from "vitest";

describe("ColorSettingUpdateHeightElementService Test", () =>
{
    it("test case", () =>
    {
        const div = document.createElement("input");
        div.id = $TRANSFORM_OBJECT_HEIGHT_ID;
        document.body.appendChild(div);

        expect(div.value).toBe("");
        execute(99.125);
        expect(div.value).toBe("99.13");

        document.body.removeChild(div);
    });
});