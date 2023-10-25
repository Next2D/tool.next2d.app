import { execute } from "./UserSettingMenuLayerSettingChangeEventService";
import { execute as userSettingObjectGetService } from "../../../../user/application/Setting/service/UserSettingObjectGetService";

describe("UserSettingMenuLayerSettingChangeEventServiceTest", () =>
{
    test("execute test", () =>
    {
        const object1 = userSettingObjectGetService();
        expect(object1.layer).toBe(false);

        const mock1 = {
            "stopPropagation": () => { return null },
            "target": {
                "value": "1"
            }
        };
        execute(mock1);

        const object2 = userSettingObjectGetService();
        expect(object2.layer).toBe(true);

        const mock2 = {
            "stopPropagation": () => { return null },
            "target": {
                "value": "0"
            }
        };
        execute(mock2);

        const object3 = userSettingObjectGetService();
        expect(object3.layer).toBe(false);
    });
});