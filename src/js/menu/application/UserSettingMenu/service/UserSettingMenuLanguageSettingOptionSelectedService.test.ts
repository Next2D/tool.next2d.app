import { execute } from "./UserSettingMenuLanguageSettingOptionSelectedService";
import { execute as userLanguageSettingObjectUpdateService } from "../../../../user/application/service/UserLanguageSettingObjectUpdateService";

describe("UserSettingMenuLanguageSettingOptionSelectedServiceTest", () =>
{
    test("execute test", () =>
    {
        const select = document.createElement("select");
        const option1 = document.createElement("option");
        option1.value = "English";
        select.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = "Japanese";
        select.appendChild(option2);

        const option3 = document.createElement("option");
        option3.value = "Turkey";
        select.appendChild(option3);

        userLanguageSettingObjectUpdateService("Japanese");
        execute(select);
        expect(option1.selected).toBe(false);
        expect(option2.selected).toBe(true);
        expect(option3.selected).toBe(false);

        userLanguageSettingObjectUpdateService("Turkey");
        execute(select);
        expect(option1.selected).toBe(false);
        expect(option2.selected).toBe(false);
        expect(option3.selected).toBe(true);

        userLanguageSettingObjectUpdateService("English");
        execute(select);
        expect(option1.selected).toBe(true);
        expect(option2.selected).toBe(false);
        expect(option3.selected).toBe(false);
    });
});