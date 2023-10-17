import { execute } from "./UserSettingMenuModalSettingChangeEventService";
import { execute as userSettingObjectGetService } from "../../../../user/application/service/UserSettingObjectGetService";

describe("UserSettingMenuModalSettingChangeEventServiceTest", () =>
{
    test("execute test", () =>
    {
        const object1 = userSettingObjectGetService();
        expect(object1.modal).toBe(true);

        const mock1 = {
            "stopPropagation": () => { return null },
            "target": {
                "value": "0"
            }
        };
        execute(mock1);

        const object2 = userSettingObjectGetService();
        expect(object2.modal).toBe(false);

        const mock2 = {
            "stopPropagation": () => { return null },
            "target": {
                "value": "1"
            }
        };
        execute(mock2);

        const object3 = userSettingObjectGetService();
        expect(object3.modal).toBe(true);
    });
});