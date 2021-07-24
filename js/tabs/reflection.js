"use strict";
SharkGame.Reflection = {
    tabId: "reflection",
    tabDiscovered: false,
    tabName: "反思",
    tabBg: "img/bg/bg-gate.png",

    sceneImage: "img/events/misc/scene-reflection.png",

    discoverReq: {
        resource: {
            essence: 1,
        },
    },

    message:
        "你可能不會記得所有東西，但是你現在不只是一條鯊魚。" +
        "</br><span='medDesc'>反思你自己的改變和你創造的現實。</span>",

    init() {
        const ref = SharkGame.Reflection;
        // register tab
        SharkGame.Tabs[ref.tabId] = {
            id: ref.tabId,
            name: ref.tabName,
            discovered: ref.tabDiscovered,
            discoverReq: ref.discoverReq,
            code: ref,
        };
    },

    switchTo() {
        const ref = SharkGame.Reflection;
        const content = $("#content");
        content.append($("<div>").attr("id", "tabMessage"));
        content.append($("<div>").attr("id", "aspectList"));
        let message = ref.message;
        const tabMessageSel = $("#tabMessage");
        if (SharkGame.Settings.current.showTabImages) {
            message = "<img width=400 height=200 src='" + ref.sceneImage + "' id='tabSceneImageEssence'>" + message;
            tabMessageSel.css("background-image", "url('" + ref.tabBg + "')");
        }
        tabMessageSel.html(message);

        ref.updateAspectList();
    },

    update() {},

    updateAspectList() {
        const listSel = $("#aspectList");
        $.each(SharkGame.Aspects, (aspectId, aspectData) => {
            if (aspectData.level > 0 && !aspectData.ignore) {
                let aspectLabel = aspectData.name + "<br><span class='medDesc'>";
                if (aspectData.level >= aspectData.max) {
                    aspectLabel += "(Maximum Power)";
                } else {
                    aspectLabel += "(Power: " + main.beautify(aspectData.level) + ")";
                }
                aspectLabel += `<br>${aspectData.getEffect(aspectData.level)}</span>`;
                // FIXME: Either add flavourtext to aspects, or delete this line
                // aspectLabel += `<br><em>${aspectData.flavour}</em>`;
                // base: this will be better to address once functional aspect prototypes are implemented

                const item = $("<div>").addClass("aspectDiv");
                item.append(aspectLabel);
                listSel.append(item);

                if (SharkGame.Settings.current.showIcons) {
                    // FIXME: artifacts -> aspects
                    // base: ditto what i said above
                    const iconDiv = SharkGame.changeSprite(SharkGame.spriteIconPath, "artifacts/" + aspectId, null, "general/missing-artifact");
                    if (iconDiv) {
                        iconDiv.addClass("button-icon");
                        iconDiv.addClass("gatewayButton");
                        item.prepend(iconDiv);
                    }
                }
            }
        });
        if ($("#aspectList > div").length === 0) {
            listSel.append("<p><em>You have no aspects to you yet.</em></p>");
        }
    },
};
