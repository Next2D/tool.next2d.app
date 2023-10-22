import { UserSettingObjectImpl } from "../../../interface/UserSettingObjectImpl";
import { execute } from "./UserSettingObjectGetService";

describe("UserSettingObjectGetServiceTest", () =>
{
    test("execute test", () =>
    {
        const object: UserSettingObjectImpl = execute();
        expect(object.layer).toBe(false);
        expect(object.modal).toBe(true);
        expect(object.type).toBe("zlib");
    });
});