import { execute } from "./PropertyAreaBlockHideService";

describe("PropertyAreaBlockHideServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.id = "test";
        document.body.appendChild(div);

        expect(div.style.display).toBe("");
        execute(["test"]);
        expect(div.style.display).toBe("none");

        div.remove();
    });
});