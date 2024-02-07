import { execute } from "./LibraryAreaUpdateSymbolElementService";
import { Instance } from "../../../../core/domain/model/Instance";

describe("LibraryAreaUpdateSymbolElementServiceTest", () =>
{
    test("execute test", () =>
    {
        const instance = new Instance({
            "id": 1,
            "type": "bitmap",
            "name": "Bitmap_01",
            "symbol": "app.next2d.Bitmap"
        });

        const div = document.createElement("div");
        document.body.appendChild(div);
        div.id = "library-child-id-1";

        const span1 = document.createElement("span");
        div.appendChild(span1);

        const span2 = document.createElement("span");
        div.appendChild(span2);

        expect(span2.textContent).toBe("");
        execute(instance);
        expect(span2.textContent).toBe(instance.symbol);

        div.remove();
    });
});