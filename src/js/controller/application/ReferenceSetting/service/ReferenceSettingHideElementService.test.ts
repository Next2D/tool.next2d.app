import { execute } from "./ReferenceSettingHideElementService";
import { $REFERENCE_POINT_ID } from "../../../../config/ReferenceSettingConfig";
import { referenceSetting } from "../../../../controller/domain/model/ReferenceSetting";

describe("ReferenceSettingHideElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = $REFERENCE_POINT_ID;
        document.body.appendChild(div);

        referenceSetting.state = "show";
        expect(referenceSetting.state).toBe("show");
        expect(div.style.display).toBe("");

        execute();

        expect(referenceSetting.state).toBe("hide");
        expect(div.style.display).toBe("none");

        div.remove();
    });
});