import { execute } from "./UserSettingMenuPublishTypeOptionSelectedService";
import { execute as userSettingObjectUpdateService } from "../../../../user/application/service/UserSettingObjectUpdateService";

describe("UserSettingMenuPublishTypeOptionSelectedServiceTest", () =>
{
    test("execute test", () =>
    {
        const select = document.createElement("select");
        const option1 = document.createElement("option");
        option1.value = "zlib";
        select.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = "json";
        select.appendChild(option2);

        const option3 = document.createElement("option");
        option3.value = "webm";
        select.appendChild(option3);

        execute(select);
        expect(option1.selected).toBe(true);
        expect(option2.selected).toBe(false);
        expect(option3.selected).toBe(false);

        const mock1 = {
            "layer": false,
            "modal": true,
            "type": "json"
        };

        userSettingObjectUpdateService(mock1);
        execute(select);
        expect(option1.selected).toBe(false);
        expect(option2.selected).toBe(true);
        expect(option3.selected).toBe(false);

        const mock2 = {
            "layer": false,
            "modal": true,
            "type": "webm"
        };

        userSettingObjectUpdateService(mock2);
        execute(select);
        expect(option1.selected).toBe(false);
        expect(option2.selected).toBe(false);
        expect(option3.selected).toBe(true);

        const mock3 = {
            "layer": false,
            "modal": true,
            "type": "zlib"
        };

        userSettingObjectUpdateService(mock3);
        execute(select);
        expect(option1.selected).toBe(true);
        expect(option2.selected).toBe(false);
        expect(option3.selected).toBe(false);

    });
});