import { BaseMenu } from "./BaseMenu";

describe("BaseMenuTest", () =>
{
    test("BaseMenu test", () =>
    {
        const div = document.createElement("div");
        div.id = "base-menu";
        document.body.appendChild(div);

        const object = new BaseMenu("base-menu");
        expect(object.name).toBe("base-menu");
        expect(div.classList.contains("fadeIn")).toBe(false);
        expect(div.classList.contains("fadeOut")).toBe(false);

        object.show();
        expect(div.classList.contains("fadeIn")).toBe(true);

        object.hide();
        expect(div.classList.contains("fadeOut")).toBe(true);

        div.remove();
    });
});