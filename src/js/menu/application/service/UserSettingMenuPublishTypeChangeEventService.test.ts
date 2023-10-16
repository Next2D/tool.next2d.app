import { execute } from "./UserSettingMenuPublishTypeChangeEventService";
import { execute as userSettingObjectGetService } from "../../../user/service/UserSettingObjectGetService";

describe("UserSettingMenuPublishTypeChangeEventServiceTest", () =>
{
    test("execute test", () =>
    {
        const object1 = userSettingObjectGetService();
        expect(object1.type).toBe("zlib");

        const mock1 = {
            "stopPropagation": () => { return null },
            "target": {
                "value": "json"
            }
        };
        execute(mock1);

        const object2 = userSettingObjectGetService();
        expect(object2.type).toBe("json");

        const mock2 = {
            "stopPropagation": () => { return null },
            "target": {
                "value": "custom"
            }
        };
        execute(mock2);

        const object3 = userSettingObjectGetService();
        expect(object3.type).toBe("custom");
    });
});