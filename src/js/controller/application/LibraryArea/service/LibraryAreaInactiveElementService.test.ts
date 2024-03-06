import { execute } from "./LibraryAreaInactiveElementService";

describe("LibraryAreaInactiveElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = "library-child-id-0";
        div.classList.add("active");

        expect(div.classList.contains("active")).toBe(true);
        execute(0);
        expect(div.classList.contains("active")).toBe(false);

        div.remove();
    });
});