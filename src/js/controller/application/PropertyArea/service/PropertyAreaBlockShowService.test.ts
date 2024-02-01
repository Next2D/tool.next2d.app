import { execute } from "./PropertyAreaBlockShowService";

describe("PropertyAreaBlockShowServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        div.style.display = "none";
        div.id = "test";
        document.body.appendChild(div);

        expect(div.style.display).toBe("none");
        execute(["test"]);
        expect(div.style.display).toBe("");

        div.remove();
    });
});