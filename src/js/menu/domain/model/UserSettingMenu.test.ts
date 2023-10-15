import { UserSettingMenu } from "./UserSettingMenu";

describe("UserSettingMenuTest", () =>
{
    test("UserSettingMenu test", () =>
    {
        const div = document.createElement("div");
        div.id = "user-setting";
        document.body.appendChild(div);

        const toolDiv = document.createElement("div");
        toolDiv.id = "tools-setting";
        document.body.appendChild(toolDiv);

        const object = new UserSettingMenu();

        object.setOffset();
        object.move(div);

        expect(div.style.left).toBe("30px");
        expect(div.style.top).toBe("80px");

        div.remove();
        toolDiv.remove();
    });
});