describe("ConfirmModal.js property test", () =>
{
    it("property test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const confirmModal = new ConfirmModal();

        // 初期値
        expect(confirmModal.name).toBe("");
        expect(confirmModal._$saved).toBe(false);
        expect(confirmModal._$focus).toBe(false);
        expect(confirmModal._$pointX).toBe(0);
        expect(confirmModal._$pointY).toBe(0);
        expect(confirmModal._$currentValue).toBe(null);
        expect(confirmModal._$currentTarget).toBe(null);
        expect(confirmModal._$lockTarget).toBe(null);
        expect(confirmModal._$mouseMove).toBe(null);
        expect(confirmModal._$mouseUp).toBe(null);
        expect(confirmModal._$handler).toBe(null);
        expect(confirmModal._$files.length).toBe(0);
        expect(confirmModal._$state).toBe("hide");
        expect(confirmModal._$currentObject).toBe(null);
        expect(confirmModal._$mapping.size).toBe(0);
        expect(confirmModal._$layers.size).toBe(0);

        Util.$workSpaces.length = 0;
    });
});

describe("ConfirmModal.js function test", () =>
{
    beforeEach(() =>
    {
        document.body.innerHTML = window.__html__["test/test.html"];
    });

    it("executeConfirmAllOverwriting test", () =>
    {
        const workSpaces = new WorkSpace();
        Util.$activeWorkSpaceId = Util.$workSpaces.length;
        Util.$workSpaces.push(workSpaces);

        const confirmModal = new ConfirmModal();

        confirmModal._$currentObject = {
            "type": null,
            "file": {
                "name": "test",
                "type": null
            },
            "folderId": 0
        };

        confirmModal._$state = "show";
        expect(confirmModal._$state).toBe("show");

        confirmModal
            .executeConfirmAllOverwriting()
            .then(() =>
            {
                expect(confirmModal._$state).toBe("hide");
                Util.$workSpaces.length = 0;
            });
    });
});
