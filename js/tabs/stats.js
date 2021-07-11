"use strict";
SharkGame.Stats = {
    tabId: "stats",
    tabDiscovered: false,
    tabName: "岩洞",
    tabBg: "img/bg/bg-grotto.png",

    sceneImage: "img/events/misc/scene-grotto.png",

    recreateIncomeTable: null,
    incomeTableEmpty: true,

    discoverReq: { upgrade: ["statsDiscovery"] },

    bannedDisposeCategories: ["special", "harmful", "hidden"],

    message:
        "岩洞是用來更好地知道資源的地方。" +
        "</br></br>你也可以棄置你不需要的東西。" +
        "</br>棄置專家會將牠們回到牠們普通的生活。",

    init() {
        // register tab
        SharkGame.Tabs[stats.tabId] = {
            id: stats.tabId,
            name: stats.tabName,
            discovered: stats.tabDiscovered,
            discoverReq: stats.discoverReq,
            code: stats,
        };
        stats.recreateIncomeTable = true;
    },

    switchTo() {
        const content = $("#content");
        content.append($("<div>").attr("id", "tabMessage"));
        const statsContainer = $("<div>").attr("id", "statsContainer");
        content.append(statsContainer);

        statsContainer.append($("<div>").attr("id", "statsUpperContainer").append($("<div>").attr("id", "incomeData")));
        statsContainer.append($("<div>").attr("id", "statsLeftContainer").append($("<div>").attr("id", "disposeResource")));
        statsContainer.append($("<div>").attr("id", "statsRightContainer").append($("<div>").attr("id", "generalStats")));

        statsContainer.append($("<div>").addClass("clear-fix"));
        let message = stats.message;
        const tabMessageSel = $("#tabMessage");
        if (SharkGame.Settings.current.showTabImages) {
            message = "<img width=400 height=200 src='" + stats.sceneImage + "' id='tabSceneImage'>" + message;
            tabMessageSel.css("background-image", "url('" + stats.tabBg + "')");
        }
        tabMessageSel.html(message);

        const disposeSel = $("#disposeResource");
        disposeSel.append($("<h3>").html("棄置東西"));
        main.createBuyButtons("rid", disposeSel, "append");
        stats.createDisposeButtons();

        const table = stats.createIncomeTable();
        const incomeDataSel = $("#incomeData");
        incomeDataSel.append($("<h3>").html("收入詳情"));
        incomeDataSel.append(
            $("<p>")
                .html("（下列為資源、各個資源給你的收入以及你從每個東西獲得的總收入。）")
                .addClass("medDesc")
        );

        const switchButtonDiv = $("<div>");
        switchButtonDiv.css({
            margin: "auto",
            "margin-bottom": "15px",
            clear: "both",
        });
        // TODO NAME BUTTON BETTER
        SharkGame.Button.makeButton("switchButton", "交換生產者和被生產者", switchButtonDiv, stats.toggleSwitch).addClass("min-block");
        if (SharkGame.Settings.current.grottoMode === "simple") {
            SharkGame.Button.makeButton("modeButton", "切換至進階模式", switchButtonDiv, stats.toggleMode).addClass("min-block");
        } else {
            SharkGame.Button.makeButton("modeButton", "切換至簡單模式", switchButtonDiv, stats.toggleMode).addClass("min-block");
        }
        /*         if (SharkGame.Settings.current.incomeTotalMode === "absolute") {
            SharkGame.Button.makeButton("percentButton", "Show Income as Percentage", switchButtonDiv, stats.togglePercent).addClass("min-block");
        } else {
            SharkGame.Button.makeButton("percentButton", "Show Income as Number", switchButtonDiv, stats.togglePercent).addClass("min-block");
        } */
        incomeDataSel.append(switchButtonDiv);

        incomeDataSel.append(table);
        incomeDataSel.append($("<div>").attr("id", "tableKey"));
        stats.updateTableKey();

        const genStats = $("#generalStats");
        genStats.append($("<h3>").html("一般統計"));
        const firstTime = main.isFirstTime();
        genStats.append($("<p>").html("開始起的時間：<br/><span id='gameTime' class='timeDisplay'></span>").addClass("medDesc"));
        if (!firstTime) {
            genStats.append(
                $("<p>").html("Time since you came through the gate:<br/><span id='runTime' class='timeDisplay'></span>").addClass("medDesc")
            );
        }
        genStats.append($("<h3>").html("總獲得海洋資源"));
        if (!firstTime) {
            genStats.append(
                $("<p>").html("Essence given is the total acquired for the entire game and not just for this world.").addClass("medDesc")
            );
        }
        genStats.append(stats.createTotalAmountTable());
    },

    update() {
        stats.updateDisposeButtons();
        stats.updateIncomeTable();
        stats.updateTotalAmountTable();
        if (stats.recreateIncomeTable) {
            stats.createIncomeTable();
            stats.createTotalAmountTable();
            stats.recreateIncomeTable = false;
        }

        // update run times
        const currTime = _.now();
        $("#gameTime").html(main.formatTime(currTime - SharkGame.timestampGameStart));
        $("#runTime").html(main.formatTime(currTime - SharkGame.timestampRunStart));
    },

    createDisposeButtons() {
        const buttonDiv = $("#disposeResource").addClass("disposeArrangement");
        SharkGame.ResourceMap.forEach((_resource, resourceId) => {
            if (res.getTotalResource(resourceId) > 0 && stats.bannedDisposeCategories.indexOf(res.getCategoryOfResource(resourceId)) === -1) {
                SharkGame.Button.makeButton(
                    "dispose-" + resourceId,
                    "Dispose of<br/>" + res.getResourceName(resourceId, false, false, SharkGame.getElementColor("tooltipbox", "background-color")),
                    buttonDiv,
                    stats.onDispose
                );
            }
        });
    },

    updateDisposeButtons() {
        SharkGame.ResourceMap.forEach((_resource, resourceName) => {
            if (res.getTotalResource(resourceName) > 0 && stats.bannedDisposeCategories.indexOf(res.getCategoryOfResource(resourceName)) === -1) {
                const button = $("#dispose-" + resourceName);
                const resourceAmount = res.getResource(resourceName);
                let amountToDispose = main.getBuyAmount();
                if (amountToDispose < 0) {
                    const max = resourceAmount;
                    const divisor = Math.floor(amountToDispose) * -1;
                    amountToDispose = Math.floor(max / divisor);
                }
                const disableButton = resourceAmount < amountToDispose || amountToDispose <= 0;
                let label =
                    "棄置 " +
                    main.beautify(amountToDispose) +
                    " 個<br/>" +
                    res.getResourceName(
                        resourceName,
                        disableButton,
                        amountToDispose,
                        SharkGame.getElementColor("dispose-" + resourceName, "background-color")
                    );
                if (amountToDispose <= 0) {
                    label =
                        "不能再棄置更多 " +
                        res.getResourceName(
                            resourceName,
                            disableButton,
                            amountToDispose,
                            SharkGame.getElementColor("dispose-" + resourceName, "background-color")
                        );
                }

                if (button.html() !== label.replace(/'/g, '"').replace("<br/>", "<br>")) {
                    button.html(label);
                }

                if (disableButton) {
                    button.addClass("disabled");
                } else {
                    button.removeClass("disabled");
                }
            }
        });
    },

    onDispose() {
        const resourceName = $(this).attr("id").split("-")[1];
        const resourceAmount = res.getResource(resourceName);
        let amountToDispose = SharkGame.Settings.current.buyAmount;
        if (amountToDispose < 0) {
            const max = resourceAmount;
            const divisor = Math.floor(amountToDispose) * -1;
            amountToDispose = max / divisor;
        }
        if (resourceAmount >= amountToDispose) {
            res.changeResource(resourceName, -amountToDispose);
            const category = SharkGame.ResourceCategories[res.getCategoryOfResource(resourceName)];
            const employmentPool = res.getBaseOfResource(resourceName);
            if (employmentPool) {
                res.changeResource(employmentPool, amountToDispose);
            }
            SharkGame.Log.addMessage(SharkGame.choose(category.disposeMessage));
        } else {
            SharkGame.Log.addMessage("不能棄置那麼多！你不夠這個東西。");
        }
    },

    updateIncomeTable() {
        SharkGame.ResourceMap.forEach((_resource, resourceId) => {
            if (res.getTotalResource(resourceId) > 0) {
                if (SharkGame.ResourceMap.get(resourceId).income) {
                    const income = SharkGame.ResourceMap.get(resourceId).income;
                    $.each(income, (incomeKey, incomeValue) => {
                        let cell = $("#income-" + resourceId + "-" + incomeKey);
                        const realIncome = SharkGame.BreakdownIncomeTable.get(resourceId)[incomeKey];
                        const changeChar = !(realIncome < 0) ? "+" : "";
                        let newValue =
                            "<span style='color: " +
                            res.TOTAL_INCOME_COLOR +
                            "'>" +
                            // (SharkGame.Settings.current.incomeTotalMode === "absolute" ? (changeChar + main.beautifyIncome(realIncome)).bold() : ((Math.min(realIncome/SharkGame.PlayerIncomeTable.get(incomeKey) * 100, 100)).toFixed(0) + "%")).bold() +
                            (changeChar + main.beautifyIncome(realIncome)).bold() +
                            "</span>";

                        if (cell.html() !== newValue.replace(/'/g, '"')) {
                            cell.html(newValue);
                        }

                        if (SharkGame.Settings.current.switchStats) {
                            cell = $("#table-amount-" + resourceId + "-" + incomeKey);
                        } else {
                            cell = $("#table-amount-" + resourceId);
                        }

                        newValue =
                            resourceId !== "world"
                                ? "<div style='text-align:right'>" + main.beautify(res.getResource(resourceId)).bold() + "</div>"
                                : "";
                        if (cell.html() !== newValue.replace(/'/g, '"')) {
                            cell.html(newValue);
                        }

                        if (SharkGame.Settings.current.grottoMode === "advanced") {
                            cell = $("#network-" + resourceId + "-" + incomeKey);
                            newValue =
                                "<span style='color:" +
                                res.RESOURCE_AFFECT_MULTIPLIER_COLOR +
                                "'>x" +
                                main.beautify(
                                    res.getNetworkIncomeModifier("generator", resourceId) * res.getNetworkIncomeModifier("resource", incomeKey),
                                    false,
                                    2
                                ) +
                                "</span>";
                            if (cell.html() !== newValue.replace(/'/g, '"')) {
                                cell.html(newValue);
                            }
                        } else {
                            cell = $("#base-income-" + resourceId + "-" + incomeKey);
                            newValue =
                                "<span style='color:" +
                                res.INCOME_COLOR +
                                "'>" +
                                (!(SharkGame.BreakdownIncomeTable.get(resourceId)[incomeKey] < 0) ? "+" : "") +
                                main.beautify(
                                    incomeValue *
                                        res.getNetworkIncomeModifier("generator", resourceId) *
                                        res.getNetworkIncomeModifier("resource", incomeKey),
                                    false,
                                    2
                                ) +
                                "/s" +
                                "</span>";
                            if (cell.html() !== newValue.replace(/'/g, '"')) {
                                cell.html(newValue);
                            }
                        }
                    });
                }
            }
        });
    },

    updateTotalAmountTable() {
        SharkGame.ResourceMap.forEach((_resource, resourceId) => {
            const totalResource = res.getTotalResource(resourceId);
            if (totalResource > 0 && res.getCategoryOfResource(resourceId) !== "hidden") {
                const cell = $("#totalAmount-" + resourceId);
                const newValue = main.beautify(totalResource);
                const oldValue = cell.html();

                if (oldValue !== newValue.replace(/'/g, '"')) {
                    cell.html(newValue);
                }
            }
        });
    },

    createIncomeTable() {
        let incomesTable = $("#incomeTable");
        if (incomesTable.length === 0) {
            incomesTable = $("<table>").attr("id", "incomeTable");
        } else {
            incomesTable.empty();
        }

        let formatCounter = 1;

        const drawnResourceMap = new Map();
        SharkGame.ResourceMap.forEach((generatorData, generatorName) => {
            if (res.getTotalResource(generatorName) > 0 && generatorData.income) {
                // if the resource has an income requiring any costs
                // and it isn't a forced income
                // do not display the resource's income if it requires a non-existent resource (looking at you, sponge)
                for (const incomeResourceName in generatorData.income) {
                    // skip income that doesn't exist
                    if (SharkGame.PlayerResources.get(incomeResourceName) < generatorData.income[incomeResourceName] && !generatorData.forceIncome)
                        return;
                }

                $.each(generatorData.income, (incomeKey, incomeValue) => {
                    if (world.doesResourceExist(incomeKey) && res.getTotalResource(incomeKey) > 0 && incomeValue !== 0) {
                        if (SharkGame.Settings.current.switchStats) {
                            // Switch it!
                            if (!drawnResourceMap.has(incomeKey)) {
                                drawnResourceMap.set(incomeKey, {});
                            }

                            drawnResourceMap.get(incomeKey)[generatorName] = incomeValue;
                        } else {
                            if (!drawnResourceMap.has(generatorName)) {
                                drawnResourceMap.set(generatorName, {});
                            }

                            // Copy all the good incomes over
                            drawnResourceMap.get(generatorName)[incomeKey] = incomeValue;
                        }
                    }
                });
            }
        });

        drawnResourceMap.forEach((headingData, headingName) => {
            // if the resource has an income requiring any costs
            // and it isn't a forced income
            // do not display the resource's income if it requires a non-existent resource (looking at you, sponge)
            const subheadings = Object.keys(headingData).length;

            let resourceMapRow = $("<tr>");
            let counter = 0;

            const rowStyle = formatCounter % 2 === 0 ? "evenRow" : "oddRow";

            if (!SharkGame.Settings.current.switchStats) {
                resourceMapRow.append(
                    $("<td>")
                        .attr("rowspan", subheadings)
                        .html(
                            headingName !== "world"
                                ? "<div style='text-align:right'>" + main.beautify(res.getResource(headingName)).bold() + "</div>"
                                : ""
                        )
                        .addClass(rowStyle)
                        .attr("id", "table-amount-" + headingName)
                );
            }
            resourceMapRow.append($("<td>").html(res.getResourceName(headingName)).attr("rowspan", subheadings).addClass(rowStyle));

            function addCell(text, rowspan, id) {
                if (id) {
                    resourceMapRow.append(
                        $("<td>")
                            .attr("rowspan", rowspan === "inline" ? 1 : subheadings)
                            .attr("id", id)
                            .html(text ? `<span style='color:${text[0]}'>${text[1]}</span>` : undefined)
                            .addClass(rowStyle)
                    );
                } else {
                    resourceMapRow.append(
                        $("<td>")
                            .attr("rowspan", rowspan === "inline" ? 1 : subheadings)
                            .html(text ? `<span style='color:${text[0]}'>${text[1]}</span>` : undefined)
                            .addClass(rowStyle)
                    );
                }
            }

            const multipliers = {
                upgrade: [],
                world: [],
                aspect: [],
            };

            $.each(headingData, (subheadingKey, _subheadingValue) => {
                const incomeKey = SharkGame.Settings.current.switchStats ? headingName : subheadingKey;
                const generatorName = SharkGame.Settings.current.switchStats ? subheadingKey : headingName;
                multipliers.upgrade.push(res.getMultiplierProduct("upgrade", generatorName, incomeKey));
                multipliers.world.push(res.getMultiplierProduct("world", generatorName, incomeKey));
                multipliers.aspect.push(res.getMultiplierProduct("aspect", generatorName, incomeKey));
            });
            $.each(multipliers, (category, values) => {
                //thanks stackoverflow
                multipliers[category] =
                    values.filter((value, index, list) => {
                        return list.indexOf(value) === index;
                    }).length !== 1;
            });

            $.each(headingData, (subheadingKey, subheadingValue) => {
                const incomeKey = SharkGame.Settings.current.switchStats ? headingName : subheadingKey;
                const generatorName = SharkGame.Settings.current.switchStats ? subheadingKey : headingName;
                const incomeValue = subheadingValue;

                const generatorBoostRowspan = SharkGame.Settings.current.switchStats ? "inline" : undefined;
                const realIncome = SharkGame.BreakdownIncomeTable.get(generatorName)[incomeKey];
                const changeChar = !(realIncome < 0) ? "+" : "";

                if (SharkGame.Settings.current.switchStats) {
                    resourceMapRow.append(
                        $("<td>")
                            .html(
                                generatorName !== "world"
                                    ? "<div style='text-align:right'>" + main.beautify(res.getResource(subheadingKey)).bold() + "</div>"
                                    : ""
                            )
                            .addClass(rowStyle)
                            .attr("id", "table-amount-" + generatorName + "-" + incomeKey)
                    );
                }
                resourceMapRow.append($("<td>").html(res.getResourceName(subheadingKey)).addClass(rowStyle));

                // which mode are we in?
                if (SharkGame.Settings.current.grottoMode === "advanced") {
                    addCell(
                        [
                            res.INCOME_COLOR,
                            changeChar + main.beautify(SharkGame.ResourceMap.get(generatorName).baseIncome[incomeKey], false, 2) + "/s",
                        ],
                        "inline",
                        "advanced-base-income-" + generatorName + "-" + incomeKey
                    );
                    if (multipliers.upgrade || counter === 0) {
                        const upgradeMutiplier = res.getMultiplierProduct("upgrade", generatorName, incomeKey);
                        if (upgradeMutiplier !== 1) {
                            addCell(
                                [res.UPGRADE_MULTIPLIER_COLOR, "x" + main.beautify(upgradeMutiplier, false, 1)],
                                multipliers.upgrade ? "inline" : undefined
                            );
                        } else addCell(undefined, multipliers.upgrade ? "inline" : undefined);
                    }

                    if (multipliers.world || counter === 0) {
                        const worldMultiplier = res.getMultiplierProduct("world", generatorName, incomeKey);
                        if (worldMultiplier !== 1) {
                            addCell(
                                [res.WORLD_MULTIPLIER_COLOR, "x" + main.beautify(worldMultiplier, false, 1)],
                                multipliers.world ? "inline" : undefined
                            );
                        } else addCell(undefined, multipliers.world ? "inline" : undefined);
                    }

                    if (multipliers.aspect || counter === 0) {
                        const aspectMultiplier = res.getMultiplierProduct("aspect", generatorName, incomeKey);
                        if (aspectMultiplier !== 1) {
                            addCell(
                                [res.ASPECT_MULTIPLIER_COLOR, "x" + main.beautify(aspectMultiplier, false, 1)],
                                multipliers.aspect ? "inline" : undefined
                            );
                        } else addCell(undefined, multipliers.aspect ? "inline" : undefined);
                    }

                    if (generatorBoostRowspan === "inline" || counter === 0) {
                        const resourceAffectMultiplier =
                            res.getNetworkIncomeModifier("generator", generatorName) * res.getNetworkIncomeModifier("resource", incomeKey);
                        if (resourceAffectMultiplier !== 1) {
                            addCell(
                                [res.RESOURCE_AFFECT_MULTIPLIER_COLOR, "x" + main.beautify(resourceAffectMultiplier, false, 2)],
                                generatorBoostRowspan,
                                "network-" + generatorName + "-" + incomeKey
                            );
                        } else addCell(undefined, generatorBoostRowspan);
                    }
                } else {
                    addCell(
                        [
                            res.INCOME_COLOR,
                            changeChar +
                                main.beautify(
                                    incomeValue *
                                        res.getNetworkIncomeModifier("generator", generatorName) *
                                        res.getNetworkIncomeModifier("resource", incomeKey),
                                    false,
                                    2
                                ) +
                                "/s",
                        ],
                        "inline",
                        "base-income-" + generatorName + "-" + incomeKey
                    );
                }

                addCell(undefined, "inline");

                if (SharkGame.Settings.current.incomeTotalMode === "percentage") {
                    addCell(
                        [
                            res.TOTAL_INCOME_COLOR,
                            (Math.min((realIncome / SharkGame.PlayerIncomeTable.get(incomeKey)) * 100, 100).toFixed(0) + "%").bold(),
                        ],
                        "inline",
                        "income-" + generatorName + "-" + incomeKey
                    );
                } else {
                    addCell(
                        [res.TOTAL_INCOME_COLOR, (changeChar + main.beautifyIncome(realIncome)).bold()],
                        "inline",
                        "income-" + generatorName + "-" + incomeKey
                    );
                }

                counter++;
                incomesTable.append(resourceMapRow);
                resourceMapRow = $("<tr>");
            });

            // throw away dangling values
            resourceMapRow = null;
            formatCounter++;
        });

        if (drawnResourceMap.size) {
            const row = $("<tr>");
            let columns = incomesTable[0].children[0].children.length;

            if (SharkGame.Settings.current.switchStats) {
                row.append(
                    $("<td>")
                        .html("<span><u>" + "資源".bold() + "</u></span>")
                        .addClass("evenRow")
                );
                row.append(
                    $("<td>")
                        .html("<span><u>" + "數量".bold() + "</u></span>")
                        .addClass("evenRow")
                );

                row.append(
                    $("<td>")
                        .html("<span><u>" + "生產者".bold() + "</u></span>")
                        .addClass("evenRow")
                );
            } else {
                row.append(
                    $("<td>")
                        .html("<span><u>" + "數量".bold() + "</u></span>")
                        .addClass("evenRow")
                );
                row.append(
                    $("<td>")
                        .html("<span><u>" + "生產者".bold() + "</u></span>")
                        .addClass("evenRow")
                );

                row.append(
                    $("<td>")
                        .html("<span><u>" + "資源".bold() + "</u></span>")
                        .addClass("evenRow")
                );
            }

            row.append(
                $("<td>")
                    .html("<span><u><b>" + (SharkGame.Settings.current.grottoMode === "advanced" ? "基本收入" : "每一個的收入") + "</b></u></span>")
                    .addClass("evenRow")
            );

            columns -= 4;
            while (columns > 1) {
                columns -= 1;
                row.append($("<td>").html(undefined).addClass("evenRow"));
            }

            if (res.getSpecialMultiplier() !== 1) {
                row.append(
                    $("<td>")
                        .html("x" + res.getSpecialMultiplier())
                        .addClass("evenRow")
                        .attr("rowspan", incomesTable.find("tr").length + 1)
                );
            }

            row.append($("<td>").html("<span><u><b>TOTAL</b></u></span>").addClass("evenRow"));

            incomesTable.prepend(row);
            SharkGame.Stats.incomeTableEmpty = false;
        } else {
            incomesTable.prepend($("<tr>").append($("<td>").html("<span><i><b>什麼都沒有。</b></i></span>")));
            SharkGame.Stats.incomeTableEmpty = true;
        }
        return incomesTable;
    },

    createTotalAmountTable() {
        let totalAmountTable = $("#totalAmountTable");
        if (totalAmountTable.length === 0) {
            totalAmountTable = $("<table>").attr("id", "totalAmountTable");
        } else {
            totalAmountTable.empty();
        }

        SharkGame.ResourceMap.forEach((_resource, resourceId) => {
            if (res.getTotalResource(resourceId) > 0 && res.getCategoryOfResource(resourceId) !== "hidden") {
                const row = $("<tr>");

                row.append($("<td>").html(res.getResourceName(resourceId)));
                row.append(
                    $("<td>")
                        .html(main.beautify(res.getTotalResource(resourceId)))
                        .attr("id", "totalAmount-" + resourceId)
                );

                totalAmountTable.append(row);
            }
        });

        return totalAmountTable;
    },

    toggleSwitch() {
        SharkGame.Settings.current.switchStats = !SharkGame.Settings.current.switchStats;
        SharkGame.Stats.createIncomeTable();
    },

    toggleMode() {
        if (SharkGame.Settings.current.grottoMode === "simple") {
            SharkGame.Settings.current.grottoMode = "advanced";
            document.getElementById("modeButton").innerHTML = "切換至簡單模式";
        } else {
            SharkGame.Settings.current.grottoMode = "simple";
            document.getElementById("modeButton").innerHTML = "切換至進階模式";
        }
        stats.createIncomeTable();
        stats.updateTableKey();
    },

    updateTableKey() {
        if (SharkGame.Settings.current.grottoMode !== "advanced" || SharkGame.Stats.incomeTableEmpty) {
            document.getElementById("tableKey").innerHTML = "";
            return;
        }

        if (world.worldType !== "start") {
            document.getElementById("tableKey").innerHTML =
                "<br> <b><u>說明</b></u>" +
                `<br> <span style='color:${res.UPGRADE_MULTIPLIER_COLOR}'><b>這個顏色</b></span>代表升級效果。` +
                `<br> <span style='color:${res.WORLD_MULTIPLIER_COLOR}'><b>This color</b></span> is for world effects.` +
                `<br> <span style='color:${res.RESOURCE_AFFECT_MULTIPLIER_COLOR}'><b>This color</b></span> is for how some resources affect each other.` +
                `<br> <span style='color:${res.ASPECT_MULTIPLIER_COLOR}'><b>This color</b></span> is for aspect effects.`;
        } else {
            document.getElementById("tableKey").innerHTML =
                "<br> <b><u>說明</b></u>" +
                `<br> <span style='color:${res.UPGRADE_MULTIPLIER_COLOR}'><b>這個顏色/b></span>代表升級效果。`;
        }
    },
};
