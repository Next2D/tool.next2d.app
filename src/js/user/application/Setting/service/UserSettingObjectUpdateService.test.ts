import { execute } from "./UserSettingObjectUpdateService";
import { execute as userSettingObjectGetService } from "./UserSettingObjectGetService";
import { UserSettingObjectImpl } from "../../../../interface/UserSettingObjectImpl";

describe("UserSettingObjectUpdateServiceTest", () =>
{
    test("execute test", () =>
    {
        const mock: UserSettingObjectImpl = {
            "layer": false,
            "modal": true,
            "type": "zlib"
        };

        expect(mock.layer).toBe(false);
        expect(mock.modal).toBe(true);
        expect(mock.type).toBe("zlib");

        mock.layer = true;
        mock.modal = false;
        mock.type = "gif";

        execute(mock);

        const object = userSettingObjectGetService();
        expect(object.layer).toBe(true);
        expect(object.modal).toBe(false);
        expect(object.type).toBe("gif");
    });
});