import { execute } from "./UserSettingMenuLayerSettingOptionSelectedService";
import { execute as userSettingObjectUpdateService } from "../../../user/application/service/UserSettingObjectUpdateService";

describe("UserSettingMenuLayerSettingOptionSelectedServiceTest", () =>
{
    test("execute test", () =>
    {
        const select = document.createElement("select");
        const option1 = document.createElement("option");
        select.appendChild(option1);

        const option2 = document.createElement("option");
        select.appendChild(option2);

        execute(select);
        expect(option1.selected).toBe(true);
        expect(option2.selected).toBe(false);

        const mock1 = {
            "layer": true,
            "modal": true,
            "type": "zlib"
        };

        userSettingObjectUpdateService(mock1);
        execute(select);
        expect(option1.selected).toBe(false);
        expect(option2.selected).toBe(true);

        const mock2 = {
            "layer": false,
            "modal": true,
            "type": "zlib"
        };

        userSettingObjectUpdateService(mock2);
        execute(select);
        expect(option1.selected).toBe(true);
        expect(option2.selected).toBe(false);
    });
});