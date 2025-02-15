import { execute } from "./ReferenceSettingShowElementService";
import { $REFERENCE_POINT_ID } from "../../../../config/ReferenceSettingConfig";
import { referenceSetting } from "../../../../controller/domain/model/ReferenceSetting";
import { describe, expect, it } from "vitest";

describe("ReferenceSettingShowElementServiceTest", () =>
{
    it("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = $REFERENCE_POINT_ID;
        document.body.appendChild(div);

        referenceSetting.state = "hide";
        div.style.display = "none";
        expect(referenceSetting.state).toBe("hide");
        expect(div.style.display).toBe("none");

        execute();

        expect(referenceSetting.state).toBe("show");
        expect(div.style.display).toBe("");

        div.remove();
    });
});