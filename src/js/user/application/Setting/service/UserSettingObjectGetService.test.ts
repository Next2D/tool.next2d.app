import { IUserSettingIObject } from "../../../../interface/IUserSettingIObject";
import { execute } from "./UserSettingObjectGetService";

describe("UserSettingObjectGetServiceTest", () =>
{
    test("execute test", () =>
    {
        const object: IUserSettingIObject = execute();
        expect(object.layer).toBe(false);
        expect(object.modal).toBe(true);
        expect(object.type).toBe("zlib");
    });
});