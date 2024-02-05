import { execute } from "./LibraryAreaActiveElementService";

describe("LibraryAreaActiveElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = "library-child-id-0";

        expect(div.classList.contains("active")).toBe(false);
        execute(0);
        expect(div.classList.contains("active")).toBe(true);

        div.remove();
    });
});