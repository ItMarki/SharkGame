"use strict";
SharkGame.HomeActions = {
    /**
     * @type Record<string, Record<string, any>>
     * Generated cache on-demand
     */
    generated: {},

    /** @param worldType {string} */
    getActionTable(worldType = world.worldType) {
        if (typeof SharkGame.HomeActions[worldType] !== "object" || worldType === "generated") {
            worldType = "default";
        }

        if (!_.has(SharkGame.HomeActions.generated, worldType)) {
            return (SharkGame.HomeActions.generated[worldType] = SharkGame.HomeActions.generateActionTable(worldType));
        } else {
            return SharkGame.HomeActions.generated[worldType];
        }
    },

    /**
     * Retrieves, modifies, and returns the data for an action. Implemented to intercept retreival of action data to handle special logic where alternatives are inconvenient or impossible.
     * @param {object} table The table to retrieve the action data from
     * @param {string} actionName The name of the action
     */
    getActionData(table, actionName) {
        // probably find a way to forego the clonedeep here, but the performance impact seems negligible.
        const data = _.cloneDeep(table[actionName]);

        if (cad.actionPriceModifier !== 1) {
            _.each(data.cost, (costData) => {
                costData.priceIncrease *= cad.actionPriceModifier;
            });
        }

        if (home.getActionCategory(actionName) === "frenzy") {
            _.each(data.cost, (costData) => {
                costData.priceIncrease *= 0.5 ** SharkGame.Aspects.thePlan.level;
            });
        }

        return data;
    },

    /**
     * @param worldType {string}
     * @returns {Record<string, Record<string, unknown>>}
     */
    generateActionTable(worldType = world.worldType) {
        const defaultActions = SharkGame.HomeActions.default;

        if (!_.has(SharkGame.HomeActions, worldType)) {
            return defaultActions;
        }

        const finalTable = {};
        const worldActions = SharkGame.HomeActions[worldType];

        // _.has
        _.each(Object.getOwnPropertyNames(worldActions), (actionName) => {
            if (!_.has(defaultActions, actionName)) {
                finalTable[actionName] = worldActions[actionName];
            } else {
                finalTable[actionName] = {};

                Object.defineProperties(
                    finalTable[actionName],
                    Object.getOwnPropertyDescriptors(worldActions[actionName])
                );

                const defaultPropertiesToDefine = _.pickBy(
                    Object.getOwnPropertyDescriptors(defaultActions[actionName]),
                    (_propertyDescriptor, propertyName) => {
                        return !_.has(finalTable, [actionName, propertyName]);
                    }
                );

                Object.defineProperties(finalTable[actionName], defaultPropertiesToDefine);
            }
        });

        return finalTable;
    },

    // something new to keep in mind:
    // the new system for keeping home actions in check at huge numbers doesn't work if the price increase isn't a whole number
    // so fractional costs are banned now
    // that's not a big deal anyways though, just multiply some numbers around to make the equivalent balance work out in the end with a non-fractional cost

    default: {
        // FREEBIES ////////////////////////////////////////////////////////////////////////////////

        catchFish: {
            name: "捕魚",
            effect: {
                resource: {
                    get fish() {
                        return SharkGame.Aspects.apotheosis.level > 0 ? SharkGame.Aspects.apotheosis.level * 4 : 1;
                    },
                },
            },
            cost: {},
            prereq: {},
            outcomes: [
                "不是魚露是鱸魚哦。",
                "吃了一個鯡魚乾。等等。",
                "你吃了一條魚好耶！",
                "魚。",
                "吃了一條鯊魚。等等，那不是鯊魚。",
                "吃了一條鯷魚。",
                "吃了一條鯰魚。",
                "吃了一條鰈魚。",
                "吃了一條黑線鱈魚。",
                "吃了一條鯡魚。",
                "吃了一條鯖魚。",
                "吃了一條鯔魚。",
                "吃了一條河鱸。",
                "吃了一條狹鱈。",
                "吃了一條鮭魚。",
                "吃了一條沙丁魚。",
                "吃了一條比目魚。",
                "吃了一條羅非魚。",
                "吃了一條鱒魚。",
                "吃了一條白魚。",
                "吃了一條鱸魚。",
                "吃了一條鯉魚。",
                "吃了一條鱈魚。",
                "吃了一條大比目魚。",
                "吃了一條鯕鰍。",
                "吃了一條鮟鱇。",
                "吃了一條河鱸。",
                "吃了一條笛鯛。",
                "吃了一條藍魚。",
                "吃了一條石斑魚。",
                "吃了一條海鱸。",
                "吃了一條黃鰭金槍魚。",
                "吃了一條旗魚。",
                "吃了一條大西洋胸棘鯛。",
                "吃了一條鯊魚。",
                "吃了一條劍魚。",
                "吃了一條軟棘魚。",
                "吃了一條金槍魚。",
                "吃了一顆瑞典魚。",
                "吃了一條金魚。",
            ],
            helpText: "使用你自然的鯊魚能力尋找並抓捕一條魚。",
        },

        debugbutton: {
            name: "除錯功能",
            effect: {
                resource: {
                    fish: 10000000,
                    crystal: 10000000,
                    sharkonium: 100000000,
                    sand: 100000000,
                    kelp: 100000000,
                    science: 1000000000,
                    shark: 10000,
                },
            },
            cost: {},
            prereq: {
                // no prereqs
            },
            outcomes: [
                "已測試。",
                "已除錯。",
                "啊，對……這跟我的初衷不一樣。",
                "非常有趣的結果。",
                "開發者的禮物。",
                "你最好在給我測試東西。",
                "不是用來真正玩的。",
                "……你作弊。",
                "哇，你在命令行界面打了sgdebug()。真是一個黑客啊！",
            ],
            helpText: "使用你自然的編程能力尋找並抓捕臭蟲。",
            unauthorized: true,
        },

        prySponge: {
            name: "Pry sponge",
            effect: {
                resource: {
                    get sponge() {
                        return SharkGame.Aspects.apotheosis.level > 0 ? SharkGame.Aspects.apotheosis.level * 4 : 1;
                    },
                },
            },
            cost: {},
            prereq: {
                upgrade: ["spongeCollection"],
                notWorlds: ["stone"],
            },
            outcomes: [
                "Pried an orange elephant ear sponge from the rocks.",
                "Pried a brain sponge from the rocks.",
                "Pried a branching tube sponge from the rocks.",
                "Pried a brown volcano carpet from the rocks.",
                "Pried a row pore rope sponge from the rocks.",
                "Pried a branching vase sponge from the rocks.",
                "Pried a chicken liver sponge from the rocks.",
                "Pried a red boring sponge from the rocks.",
                "Pried a heavenly sponge from the rocks.",
                "Pried a brown encrusting octopus sponge from the rocks.",
                "Pried a stinker sponge from the rocks.",
                "Pried a black-ball sponge from the rocks.",
                "Pried a strawberry vase sponge from the rocks.",
                "Pried a convoluted orange sponge from the rocks.",
                "Pried a touch-me-not sponge from the rocks. Ow.",
                "Pried a lavender rope sponge from the rocks.",
                "Pried a red-orange branching sponge from the rocks.",
                "Pried a variable boring sponge from the rocks.",
                "Pried a loggerhead sponge from the rocks.",
                "Pried a yellow sponge from the rocks.",
                "Pried an orange lumpy encrusting sponge from the rocks.",
                "Pried a giant barrel sponge from the rocks.",
            ],
            helpText: "Grab a sponge from the seabed for future use.",
        },

        getClam: {
            name: "Get clam",
            effect: {
                resource: {
                    get clam() {
                        return SharkGame.Aspects.apotheosis.level > 0 ? SharkGame.Aspects.apotheosis.level * 4 : 1;
                    },
                },
            },
            cost: {},
            prereq: {
                upgrade: ["clamScooping"],
            },
            outcomes: [
                "Got a grooved carpet shell.",
                "Got a hard clam.",
                "Got a manila clam.",
                "Got a soft clam.",
                "Got an atlantic surf clam.",
                "Got an ocean quahog.",
                "Got a pacific razor clam.",
                "Got a pismo clam.",
                "Got a geoduck.",
                "Got an atlantic jackknife clam.",
                "Got a lyrate asiatic hard clam.",
                "Got an ark clam.",
                "Got a nut clam.",
                "Got a duck clam.",
                "Got a marsh clam.",
                "Got a file clam.",
                "Got a giant clam.",
                "Got an asiatic clam.",
                "Got a peppery furrow shell.",
                "Got a pearl oyster.",
            ],
            helpText: "Fetch a clam. Why do we need clams now? Who knows.",
        },

        getJellyfish: {
            name: "Grab jellyfish",
            effect: {
                resource: {
                    get jellyfish() {
                        return SharkGame.Aspects.apotheosis.level > 0 ? SharkGame.Aspects.apotheosis.level * 4 : 1;
                    },
                },
            },
            cost: {},
            prereq: {
                upgrade: ["jellyfishHunting"],
            },
            outcomes: [
                "Grabbed a mangrove jellyfish.",
                "Grabbed a lagoon jellyfish.",
                "Grabbed a nomuras jellyfish.",
                "Grabbed a sea nettle jellyfish.",
                "Grabbed an upside down jellyfish.",
                "Grabbed a comb jellyfish.",
                "Grabbed a sand jellyfish.",
                "Grabbed a box jellyfish.",
                "Grabbed a sea wasp jellyfish.",
                "Grabbed a blue blubber.",
                "Grabbed a white spotted jellyfish.",
                "Grabbed an immortal jellyfish.",
                "Grabbed a pelagia noctiluca.",
                "Grabbed a moon light jellyfish.",
                "Grabbed an iracongi irukandji jellyfish.",
                "Grabbed an irukandji jellyfish.",
                "Grabbed a moon jellyfish.",
                "Grabbed an aurelia aurita.",
                "Grabbed a ball jellyfish.",
                "Grabbed a cannonball jellyfish.",
                "Grabbed a man of war.",
                "Grabbed a war jellyfish.",
                "Grabbed a blue bottle jellyfish.",
                "Grabbed a lion's mane jellyfish.",
                "Grabbed a mane jellyfish.",
                "Grabbed a sun jellyfish.",
                "Grabbed a square jellyfish.",
                "Grabbed a physalia jellyfish.",
                "Grabbed a king jellyfish.",
                "Grabbed a cassiopeia jellyfish.",
            ],
            helpText: "Take a great risk in catching a jellyfish without being stung.",
        },

        // CONVERSIONS ////////////////////////////////////////////////////////////////////////////////

        seaApplesToScience: {
            name: "研究海蘋果",
            effect: {
                resource: {
                    science: 4,
                },
            },
            cost: [{ resource: "seaApple", costFunction: "constant", priceIncrease: 1 }],
            max: "seaApple",
            prereq: {
                resource: {
                    seaApple: 1,
                },
                upgrade: ["xenobiology"],
            },
            outcomes: [
                "裏面必然有科學！",
                "科學的原因玄不可測！",
                "也許能給我們一些見解！",
                "為什麼要做這件事？誰知道呢！科學！",
                "這些東西到底有什麼用途？為什麼要用水果命名？它們在蠕動！",
            ],
            helpText: "解剖海蘋果以獲得額外的科學。研究！",
        },

        /*
        "spongeToScience": {
            name: "Dissect sponge",
            effect: {
                resource: {
                    science: 1
                }
            },
            cost: [
                {resource: "sponge", costFunction: "constant", priceIncrease: 1}
            ],
            max: "sponge",
            prereq: {
                resource: {
                    sponge: 1
                },
                upgrade: [
                    "xenobiology"
                ]
            },
            outcomes: [
                "Squishy porous science!",
                "The sponge has been breached and the science is leaking out!",
                "This is the best use of a sponge. Teeth dissections are the best.",
                "Sponge is now so many shreds. But so much was learned!",
                "The sponge is apparently not a plant. Yet plants feel more sophisticated than these things."
            ],
            helpText: "Dissect sponges to learn their porous secrets. Science!"
        },
        */

        pearlConversion: {
            name: "Convert clam pearls",
            effect: {
                resource: {
                    crystal: 1,
                },
            },
            cost: [
                { resource: "clam", costFunction: "constant", priceIncrease: 1 },
                { resource: "science", costFunction: "constant", priceIncrease: 4 },
            ],
            max: "clam",
            prereq: {
                resource: {
                    clam: 1,
                },
                upgrade: ["pearlConversion"],
            },
            outcomes: [
                "Pearls to crystals! One day. One day, we will get this right and only use the pearl.",
                "Welp, we somehow turned rocks to crystals. Oh. Nope, those were clams. Not rocks. It's so hard to tell sometimes.",
                "Okay, we managed to only use the pearls this time, but we, uh, had to break the clams open pretty roughly.",
                "Pearls to... nope. Clams to crystals. Science is hard.",
            ],
            helpText: "Convert a pearl (and the clam around it) into crystal.",
        },

        // MAKE ADVANCED RESOURCES  ///////////////////////////////////////////////////////////////////////////////

        transmuteSharkonium: {
            name: "Transmute stuff to sharkonium",
            effect: {
                resource: {
                    sharkonium: 1,
                },
            },
            cost: [
                {
                    resource: "crystal",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 5 - SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
                {
                    resource: "sand",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 15 - 3 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
            ],
            max: "sharkonium",
            prereq: {
                upgrade: ["transmutation"],
            },
            outcomes: [
                "Transmutation destination!",
                "Transmutation rejuvenation!",
                "Transmogrification revelation!",
                "Transformation libation!",
                "Transfiguration nation! ...wait.",
                "Sharkonium arise!",
                "Arise, sharkonium!",
                "More sharkonium!",
                "The substance that knows no name! Except the name sharkonium!",
                "The substance that knows no description! It's weird to look at.",
                "The foundation of a modern shark frenzy!",
            ],
            helpText: "Convert ordinary resources into sharkonium, building material of the future!",
        },

        smeltCoralglass: {
            name: "Smelt stuff to coralglass",
            effect: {
                resource: {
                    coralglass: 1,
                },
            },
            cost: [
                { resource: "coral", costFunction: "constant", priceIncrease: 10 },
                { resource: "sand", costFunction: "constant", priceIncrease: 10 },
            ],
            max: "coralglass",
            prereq: {
                upgrade: ["coralglassSmelting"],
            },
            outcomes: [
                "Coralglass smelted!",
                "Coralglass melted! No. Wait.",
                "How does coral become part of glass? Well, you see, it's all very simple, or that's what the lobster told me.",
                "The backbo-- the exoskeleton of the crustacean industry!",
                "So fragile. Yet so useful.",
            ],
            helpText: "Smelt resources into coralglass for use in crustacean machines!",
        },

        // BUY ANIMALS ////////////////////////////////////////////////////////////////////////////////

        getShark: {
            name: "招募鯊魚",
            effect: {
                resource: {
                    shark: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 5 }],
            max: "shark",
            prereq: {
                resource: {
                    fish: 5,
                },
            },
            outcomes: [
                "一條大鼻真鯊加入了你的團隊。",
                "一條烏翅真鯊加入了你的團隊。",
                "一條藍鯊加入了你的團隊。",
                "一條公牛鯊加入了你的團隊。",
                "一條貓鯊加入了你的團隊。",
                "一條糙齒鯊加入了你的團隊。。",
                "一條灰色真鯊加入了你的團隊。",
                "一條角鯊加入了你的團隊。",
                "一條鈍吻真鯊加入了你的團隊。",
                "一條黑尾真鯊加入了你的團隊。",
                "一條哥布林鯊加入了你的團隊。",
                "一條錘頭鯊加入了你的團隊。",
                "一條槍頭真鯊加入了你的團隊。",
                "一條檸檬鯊加入了你的團隊。",
                "一條尖頭曲齒鮫加入了你的團隊。",
                "一條澳洲真鯊加入了你的團隊。",
                "一條遠洋白鰭鯊加入了你的團隊。",
                "一條高鰭真鯊加入了你的團隊。",
                "一條鉛灰真鯊加入了你的團隊。",
                "一條絲鯊加入了你的團隊。",
                "一條白邊真鯊加入了你的團隊。",
                "一條廣鼻曲齒鮫加入了你的團隊。",
                "一條露齒鯊加入了你的團隊。",
                "一條薔薇真鯊加入了你的團隊。",
                "一條沙拉真鯊加入了你的團隊。",
                "一條鯖鯊加入了你的團隊。",
                "一條鼬鯊加入了你的團隊。",
                "一條鏽鬚鮫加入了你的團隊。",
                "一條大白鯊加入了你的團隊。",
                "一條豹紋鯊加入了你的團隊。",
            ],
            multiOutcomes: [
                "一大堆鯊魚加入了你的團隊。",
                "鯊魚真多。",
                "鯊魚社區增長！",
                "更多鯊魚！更多鯊魚！",
                "大眾的鯊魚，大量的鯊魚。",
                "一簇鯊魚！",
                "一群鯊魚！",
                "一組鯊魚！",
                "一批鯊魚！",
                "一班鯊魚！",
                "一伙鯊魚！",
            ],
            helpText: "招募鯊魚，幫你抓更多的魚。",
        },

        getManta: {
            name: "僱用魟魚",
            effect: {
                resource: {
                    ray: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 15 }],
            max: "ray",
            prereq: {
                resource: {
                    shark: 5,
                },
            },
            outcomes: [
                "這些傢伙看來踢上不少的沙子呢！",
                "一條納氏鷂鱝加入了你的團隊。",
                "一條魔鬼魚加入了你的團隊。",
                "一條刺魟加入了你的團隊。",
                "一條牛鼻鱝加入了你的團隊。",
                "一條古式魟加入了你的團隊。",
                "一條薩氏魟加入了你的團隊。",
                /* oman masked ray */
                "一條雙電鰩加入了你的團隊。",
                "一條澳洲睡電鰩加入了你的團隊。",
                "一條印度蝠鱝加入了你的團隊。",
                "一條小雙鰭電鰩加入了你的團隊。",
                /* cortez electric ray */
                "一條褶尾蘿蔔魟加入了你的團隊。",
                "一條背棘鰩加入了你的團隊。",
                "一條藍吻犁頭鰩加入了你的團隊。",
                "一條斯氏牛鼻鱝加入了你的團隊。",
                "一條藍斑條尾魟加入了你的團隊。",
                /* marbled ribbontail ray */
                "一條黑斑電鰩加入了你的團隊。",
                /* marbled torpedo ray */
                "一條地中海電鰩加入了你的團隊。",
                /* torpedo ray */
                /* spotted torpedo ray */
                "一條普通電鰩加入了你的團隊。",
                /* caribbean torpedo */
                "一條卵形鷂扁魟加入了你的團隊。",
                "一條少斑扁魟加入了你的團隊。",
                /* kapala stingaree */
                /* common stingaree */
                "一條斑紋南犁頭鰩加入了你的團隊。",
                /* bullseye stingray */
                "一條哈氏大尾扁魟加入了你的團隊。",
                /* yellow stingray */
                /* cortez round stingray */
                "一條糙沙粒魟加入了你的團隊。",
                "一條褐黃扁魟加入了你的團隊。",
                "一條帶紋扁魟加入了你的團隊。",
                "一條巨斑扁魟加入了你的團隊。",
                /* sea pancake */
            ],
            multiOutcomes: [
                "一大堆魟魚加入了你的團隊。",
                "魟魚不少呢。",
                "魟魚陰謀變得更大了！",
                "這麼多魟魚我處理不了呢。",
                "更多魟魚更多魟魚摩多摩多摩多。",
                "一班魟魚！",
                "一簇魟魚！",
                "大量魟魚！",
                "沙子在水裏四處飄揚！",
                "好多魟魚。",
            ],
            helpText: "僱用魟魚，幫你收集魚。它們可能會從海床踢上一些沙子。",
        },

        getCrab: {
            name: "獲得螃蟹",
            effect: {
                resource: {
                    crab: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 10 }],
            max: "crab",
            prereq: {
                resource: {
                    shark: 10,
                    ray: 4,
                },
            },
            outcomes: [
                "一隻螃蟹開始從沙子裏篩出閃亮的東西。",
                "A bering hermit joins you.",
                "A blackeye hermit joins you.",
                "A butterfly crab joins you.",
                "A dungeness crab joins you.",
                "A flattop crab joins you.",
                "A greenmark hermit joins you.",
                "A golf-ball crab joins you.",
                "A graceful crab joins you.",
                "A graceful decorator crab joins you.",
                "A graceful kelp crab joins you.",
                "A green shore crab joins you.",
                "A heart crab joins you.",
                "A helmet crab joins you.",
                "A longhorn decorator crab joins you.",
                "A maroon hermit joins you.",
                "A moss crab joins you.",
                "A northern kelp crab joins you.",
                "A orange hairy hermit joins you.",
                "A purple shore crab joins you.",
                "A pygmy rock crab joins you.",
                "A puget sound king crab joins you.",
                "A red rock crab joins you.",
                "A scaled crab joins you.",
                "A sharpnose crab joins you.",
                "A spiny lithoid crab joins you.",
                "A widehand hermit joins you.",
                "A umbrella crab joins you.",
            ],
            multiOutcomes: [
                "A lot of crabs join you.",
                "CRABS EVERYWHERE",
                "Crabs. Crabs. Crabs!",
                "Feels sort of crab-like around here.",
                "A cast of crabs!",
                "A dose of crabs!",
                "A cribble of crabs! Okay, no, that one's made up.",
                "So many crabs.",
                "I'm sorry to say, but you have crabs. Everywhere.",
            ],
            helpText: "僱用螃蟹尋找一些鯊魚和魟魚會忽視的東西。",
        },

        getShrimp: {
            name: "Acquire shrimp",
            effect: {
                resource: {
                    shrimp: 1,
                },
            },
            cost: [{ resource: "sponge", costFunction: "linear", priceIncrease: 5 }],
            max: "shrimp",
            prereq: {
                resource: {
                    sponge: 5,
                },
                upgrade: ["seabedGeology"],
            },
            outcomes: [
                "An african filter shrimp joins you.",
                "An amano shrimp joins you.",
                "A bamboo shrimp joins you.",
                "A bee shrimp joins you.",
                "A black tiger shrimp joins you.",
                "A blue bee shrimp joins you.",
                "A blue pearl shrimp joins you.",
                "A blue tiger shrimp joins you.",
                "A brown camo shrimp joins you.",
                "A cardinal shrimp joins you.",
                "A crystal red shrimp joins you.",
                "A dark green shrimp joins you.",
                "A glass shrimp joins you.",
                "A golden bee shrimp joins you.",
                "A harlequin shrimp joins you.",
                "A malaya shrimp joins you.",
                "A neocaridina heteropoda joins you.",
                "A ninja shrimp joins you.",
                "An orange bee shrimp joins you.",
                "An orange delight shrimp joins you.",
                "A purple zebra shrimp joins you.",
                "A red cherry shrimp joins you.",
                "A red goldflake shrimp joins you.",
                "A red tiger shrimp joins you.",
                "A red tupfel shrimp joins you.",
                "A snowball shrimp joins you.",
                "A sulawesi shrimp joins you.",
                "A tiger shrimp joins you.",
                "A white bee shrimp joins you.",
                "A yellow shrimp joins you.",
            ],
            multiOutcomes: [
                "That's a lot of shrimp.",
                "So many shrimp, it's like a cloud!",
                "I can't cope with this many shrimp!",
                "Shrimp, they're like bugs, except not bugs or anything related at all!",
                "They're so tiny!",
                "How can something so small take up so much space?",
                "Sponge forever!",
            ],
            helpText: "Convince shrimp to assist you in the gathering of algae, which helps boost sponge production.",
        },

        getLobster: {
            name: "Gain lobster",
            effect: {
                resource: {
                    lobster: 1,
                },
            },
            cost: [{ resource: "clam", costFunction: "linear", priceIncrease: 10 }],
            max: "lobster",
            prereq: {
                resource: {
                    clam: 10,
                },
                upgrade: ["seabedGeology"],
            },
            outcomes: [
                "A scampi joins you.",
                "A crayfish joins you.",
                "A clawed lobster joins you.",
                "A spiny lobster joins you.",
                "A slipper lobster joins you.",
                "A hummer lobster joins you.",
                "A crawfish joins you.",
                "A rock lobster joins you.",
                "A langouste joins you.",
                "A shovel-nose lobster joins you.",
                "A crawdad joins you.",
            ],
            multiOutcomes: [
                "Lobsters lobsters lobsters lobsters.",
                "But they weren't rocks...",
                "The clam forecast is looking good!",
                "They're all about the clams!",
                "More lobsters, because why not?",
                "HEAVY LOBSTERS",
                "More lobsters for the snipping and the cutting and the clam grab!",
                "Clam patrol, here we go.",
            ],
            helpText: "Lobster like clams. Will work for clams. Good work. Many clams.",
        },

        // SHARK JOBS ////////////////////////////////////////////////////////////////////////////////

        getDiver: {
            name: "Prepare diver shark",
            effect: {
                resource: {
                    diver: 1,
                },
            },
            cost: [
                { resource: "shark", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 30 },
            ],
            max: "diver",
            prereq: {
                resource: {
                    shark: 1,
                },
                world: "shrouded",
            },
            outcomes: [
                "Well, better you than me.",
                "Good luck down there!",
                "You're doing good work for us, diver shark.",
                "Fare well on your expeditions, shark!",
            ],
            multiOutcomes: [
                "Follow the crystals!",
                "We will find the secrets of the deep!",
                "Brave the deep!",
                "Find the crystals for science!",
                "Deep, dark, scary waters. Good luck, all of you.",
            ],
            helpText: "Let a shark go deep into the darkness for more crystals and whatever else they may find.",
        },

        getScientist: {
            name: "Train science shark",
            effect: {
                resource: {
                    scientist: 1,
                },
            },
            cost: [
                { resource: "shark", costFunction: "constant", priceIncrease: 1 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 20 },
            ],
            max: "scientist",
            prereq: {
                resource: {
                    crystal: 20,
                    shark: 1,
                },
            },
            outcomes: [
                "Doctor Shark, coming right up!",
                "A scientist shark is revealed!",
                "After many painful years of study, a shark that has developed excellent skills in making excuses-- er, in science!",
                "PhD approved!",
                "Graduation complete!",
                "A new insight drives a new shark to take up the cause of science!",
            ],
            multiOutcomes: [
                "The training program was a success!",
                "Look at all this science!",
                "Building a smarter, better shark!",
                "Beakers! Beakers underwater! It's madness!",
                "Let the science commence!",
                "Underwater clipboards! No I don't know how that works either!",
                "Careful teeth record the discoveries!",
            ],
            helpText: "Train a shark in the fine art of research and the science of, well, science.",
        },

        /*
        getProspector: {
            name: "Recruit shark prospector",
            effect: {
                resource: {
                    prospector: 1,
                },
            },
            cost: [
                { resource: "shark", costFunction: "constant", priceIncrease: 1 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 15 },
            ],
            max: "prospector",
            prereq: {
                upgrade: ["prospectorSharks"],
            },
            outcomes: [
                "Ready to mine!",
                "Well, there are worse jobs.",
                "Pickaxe? Check. Hard work? Check. Lack of proper safety regulations? Double check.",
                "I'm not sure why sharks think this is a good job? It sucks??",
                "Trained in the art of mine-fu. Ready to bust crystals.",
            ],
            multiOutcomes: [
                "How do you even get leverage underwater? Newton's third law? Anyone?",
                "So, they're back in the mine.",
                "Too bad there isn't something even better than crystal down there, like, diamonds or something.",
                "Go! Collect resources! Give me stone!",
                "No rock left unturned! Then, break the rocks you turn over, there might be goodies inside!",
            ],
            helpText: "Train and equip a shark to break crystals and mine stone in sub-ocean caverns.",
        },
        */

        getNurse: {
            name: "Train nurse shark",
            effect: {
                resource: {
                    nurse: 1,
                },
            },
            cost: [
                { resource: "shark", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 100 },
            ],
            max: "nurse",
            prereq: {
                resource: {
                    shark: 1,
                },
                upgrade: ["biology"],
            },
            outcomes: [
                "A nurse shark is ready!",
                "Shark manufacturer primed.",
                "Nurse shark trained.",
                "Medical exam passed! Nurse shark is go!",
            ],
            multiOutcomes: [
                "More sharks are on the way soon.",
                "Shark swarm begins!",
                "There will be no end to the sharks!",
                "Sharks forever!",
                "The sharks will never end. The sharks are eternal.",
                "More sharks to make more sharks to make more sharks...",
            ],
            helpText: "Remove a shark from fish duty and set them to shark making duty.",
        },

        // RAY JOBS ////////////////////////////////////////////////////////////////////////////////

        getLaser: {
            name: "Equip laser ray",
            effect: {
                resource: {
                    laser: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 50 },
            ],
            max: "laser",
            prereq: {
                resource: {
                    ray: 1,
                },
                upgrade: ["laserRays"],
            },
            outcomes: [
                "Laser ray online!",
                "Laser ray! With a laser ray! It's laser ray, with a laaaaaser raaaay!",
                "Laser ray.",
                "Ray suited up with a laaaaaaser!",
                "Ray lasered. To use a laser. Not the subject of a laser.",
            ],
            multiOutcomes: [
                "Boil the seabed!",
                "Churn the sand to crystal!",
                "Laser ray armada in position!",
                "Ray crystal processing initiative is growing stronger every day!",
                "Welcome to the future! The future is lasers!",
            ],
            helpText: "Remove a ray from sand detail and let them fuse sand into raw crystal.",
        },

        /*
        getShoveler: {
            name: "Equip shoveler ray",
            effect: {
                resource: {
                    shoveler: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 15 },
            ],
            max: "shoveler",
            prereq: {
                resource: {
                    ray: 1,
                },
                upgrade: ["crystalShovel"],
            },
            outcomes: [
                "Shovel ray, at your service!",
                "For shovelry!",
                "The ray is excited to get started.",
                "Gravel is the future...I guess!",
                "Strapped a shovel to a ray. That ray is now a professional. Go get 'em!",
            ],
            multiOutcomes: [
                "Blue heroes with spades!",
                "No sand, only coarse, heavy pebbles!",
                "Let's get shoveling!",
                "Dig in!",
                "And they said shovelry was dead.",
                "The rays seemed bleak before. Now, they're excited.",
            ],
            helpText: "Remove a ray from fish detail and let them collect gravel instead.",
        },
        */

        getMaker: {
            name: "Instruct a ray maker",
            effect: {
                resource: {
                    maker: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 300 },
            ],
            max: "maker",
            prereq: {
                resource: {
                    ray: 1,
                },
                upgrade: ["rayBiology"],
            },
            outcomes: [
                "The application of kelp supplements has made a ray very productive.",
                "More rays lets you get more rays which you can then use to get more rays.",
                "The ray singularity begins!",
                "A ray maker is ready.",
                "Looks like you gave them quite the ray maker blow! 'Them' being the intangible enemy that is lacking in resources.",
                "The ray seems concerned, but obliges. The mission has been given.",
            ],
            multiOutcomes: [
                "All these makers. What are they making? What is it for? Oh. It's rays, and it's probably for sand or something.",
                "More ray makers means more rays. Do you understand what that means?! Do you?! It means more rays. Good. On the same page, then.",
                "Rapidly breeding aquatic wildlife is probably a severe ecological hazard. Good thing this isn't Earth's oceans, probably!",
                "Have you ever thought about what the rays wanted? Because this might have been what they wanted after all.",
                "MORE LASER RAYS FOR THE LASER ARMY-- oh. Well, this is good too.",
            ],
            helpText: "Remove a ray from sand business and let them concentrate on making more rays.",
        },

        /*
        stoneGetMaker: {
            name: "Instruct a ray maker",
            effect: {
                resource: {
                    maker: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 2 },
                { resource: "fish", costFunction: "linear", priceIncrease: 350 },
            ],
            max: "maker",
            prereq: {
                resource: {
                    ray: 1,
                },
                upgrade: ["rayBiology"],
                world: "stone",
            },
            outcomes: [
                "More rays lets you get more rays which you can then use to get more rays.",
                "The ray singularity begins!",
                "A ray maker is ready.",
                "Looks like you gave them quite the ray maker blow! 'Them' being the intangible enemy that is lacking in resources.",
                "The ray seems concerned, but obliges. The mission has been given.",
            ],
            multiOutcomes: [
                "All these makers. What are they making? What is it for? Oh. It's rays, and it's probably for sand or something.",
                "More ray makers means more rays. Do you understand what that means?! Do you?! It means more rays. Good. On the same page, then.",
                "Rapidly breeding aquatic wildlife is probably a severe ecological hazard. Good thing this isn't Earth's oceans, probably!",
                "Have you ever thought about what the rays wanted? Because this might have been what they wanted after all.",
                "MORE LASER RAYS FOR THE LASER ARMY-- oh. Well, this is good too.",
            ],
            helpText: "Remove a ray from fish business and let them concentrate on making more rays.",
        },
        */

        // CRAB JOBS ////////////////////////////////////////////////////////////////////////////////

        getPlanter: {
            name: "Gear up planter crab",
            effect: {
                resource: {
                    planter: 1,
                },
            },
            cost: [
                { resource: "crab", costFunction: "constant", priceIncrease: 1 },
                { resource: "sand", costFunction: "linear", priceIncrease: 200 },
            ],
            max: "planter",
            prereq: {
                resource: {
                    crab: 1,
                },
                upgrade: ["kelpHorticulture"],
            },
            outcomes: [
                "Crab set up with seeds.",
                "Shell studded with kelp.",
                "Crab is going on a mission. A mission... to farm.",
                "Planter crab equipped and ready to move a few feet and start planting some things!",
                "Crab is ready to farm!",
            ],
            multiOutcomes: [
                "Carpet the seabed!",
                "Kelp kelp kelp kelp kelp kelp kelp kelp.",
                "Horticulturists unite!",
                "Strike the sand!",
                "Pat the sand very gently and put kelp in it!",
                "More kelp. The apples. They hunger. They hunger for kelp.",
            ],
            helpText: "Equip a crab with the equipment and training to plant kelp across the ocean bottom.",
        },

        /*
        getMiller: {
            name: "Equip miller crab",
            effect: {
                resource: {
                    miller: 1,
                },
            },
            cost: [
                { resource: "crab", costFunction: "constant", priceIncrease: 1 },
                { resource: "gravel", costFunction: "linear", priceIncrease: 25 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 20 },
            ],
            max: "miller",
            prereq: {
                resource: {
                    crab: 1,
                },
                upgrade: ["gravelMilling"],
            },
            outcomes: [
                "Crab has milling gear.",
                "Why is it milling, and not grinding?",
                "Crab has been prepared for pebble disintegration.",
                "How, you ask? With big, meaty claws, how else?",
                "Making gravel flour, hopefully not for gravel bread.",
            ],
            multiOutcomes: [
                "Doing nature's job for it.",
                "Millions of years of erosion become mere minutes in your hands...",
                "Be gone, gravel!",
                "Sand, come to this world!",
                "Crush the pebbles! Crush them into what is technically just smaller pebbles!",
            ],
            helpText: "Equip a crab with the equipment and training to grind gravel directly into sand.",
        },
        */

        getBrood: {
            name: "Form crab brood",
            effect: {
                resource: {
                    brood: 1,
                },
            },
            cost: [
                { resource: "crab", costFunction: "constant", priceIncrease: 20 },
                { resource: "fish", costFunction: "linear", priceIncrease: 200 },
            ],
            max: "brood",
            prereq: {
                resource: {
                    crab: 1,
                },
                upgrade: ["crabBiology"],
            },
            outcomes: [
                "A bunch of crabs pile together into some sort of weird cluster.",
                "Crab team, assemble! FORM THE CRAB BROOD!",
                "[This message has been censored for reasons of being mostly really gross.]",
                "Eggs, eggs everywhere, but never stop and think.",
                "Writhing crab pile. Didn't expect those words next to each other today, did you.",
                "The crab brood is a rarely witnessed phenomenon, due to being some strange behaviour of crabs that have been driven to seek crystals for reasons only they understand.",
            ],
            multiOutcomes: [
                "The broods grow. The swarm rises.",
                "All these crabs are probably a little excessive. ...is what I could say, but I'm going to say this instead. MORE CRABS.",
                "A sea of crabs on the bottom of the sea. Clickity clackity.",
                "Snip snap clack clack burble burble crabs crabs crabs crabs.",
                "More crabs are always a good idea. Crystals aren't cheap.",
                "The broods swell in number. The sharks are uneasy, but the concern soon passes.",
            ],
            helpText: "Meld several crabs into a terrifying, incomprehensible crab-producing brood cluster.",
        },

        // SHRIMP JOBS ////////////////////////////////////////////////////////////////////////////////

        getQueen: {
            name: "Crown shrimp queen",
            effect: {
                resource: {
                    queen: 1,
                },
            },
            cost: [
                { resource: "shrimp", costFunction: "constant", priceIncrease: 1 },
                { resource: "sponge", costFunction: "linear", priceIncrease: 50 },
            ],
            max: "queen",
            prereq: {
                resource: {
                    shrimp: 1,
                },
                upgrade: ["eusociality"],
            },
            outcomes: [
                "Shrimp queen prepped for duty!",
                "A royal shrimp is she!",
                "More shrimp for the shrimp superorganism!",
                "Give it time before they start singing about wanting to break free.",
                "Long live the tiny tiny shrimp queen!",
            ],
            multiOutcomes: [
                "Okay, so it's not exactly a royal role, but hey, they're gonna be making eggs for a long time. Humour them.",
                "This is the weirdest monarchy in existence.",
                "Welcome to the superorganisation!",
                "They want to ride their bicycle.",
                "Give it time before they start singing about wanting to break free.",
                "Queens for the shrimp colony! Eggs for the egg throne!",
            ],
            helpText: "Create a shrimp queen to make more shrimp.",
        },

        getWorker: {
            name: "Assign shrimp worker",
            effect: {
                resource: {
                    worker: 1,
                },
            },
            cost: [
                { resource: "shrimp", costFunction: "constant", priceIncrease: 1 },
                { resource: "sponge", costFunction: "linear", priceIncrease: 20 },
            ],
            max: "worker",
            prereq: {
                resource: {
                    shrimp: 1,
                },
                upgrade: ["eusociality"],
            },
            outcomes: [
                "No more work for this shrimp! Of their particular variety! Now slightly different work! Go!",
                "Consider this a promotion.",
                "This shrimp is going to have to come in on weekends now, I'm afraid.",
                "We sure love micromanaging these tiny guys on an individual basis, don't we.",
                "This little shrimp is so happy to be picked out of the crowd.",
            ],
            multiOutcomes: [
                "These are some pretty fluid castes.",
                "Promotions for everybody!",
                "We're reorganising the superorganism.",
                "The sponge must grow.",
                "The sponge is the life.",
                "Glory to the sponge. Glory to the shrimp mass.",
            ],
            helpText: "Dedicate a shrimp to collecting stuff that isn't algae.",
        },

        // LOBSTER JOBS ////////////////////////////////////////////////////////////////////////////////

        getBerrier: {
            name: "Form lobster berrier",
            effect: {
                resource: {
                    berrier: 1,
                },
            },
            cost: [
                { resource: "lobster", costFunction: "constant", priceIncrease: 1 },
                { resource: "clam", costFunction: "linear", priceIncrease: 30 },
            ],
            max: "berrier",
            prereq: {
                resource: {
                    lobster: 1,
                },
                upgrade: ["crustaceanBiology"],
            },
            outcomes: [
                "We didn't need to see the process behind this.",
                "One lobster brimming with eggs to go.",
                "It's like some weird counterpart to the planter crab. But with eggs.",
                "Lobster with rocks ready to make a move. Oh, okay, eggs, whatever, see, they look like shiny pebbles from a distance and... oh, forget it.",
            ],
            multiOutcomes: [
                "Berrier isn't even a word!",
                "Berries and eggs aren't even the same thing!",
                "How do these things swim with this much weighing them down?",
                "We aren't running out of volunteers any time soon.",
                "Did you see them fight for this job? Claws everywhere, I tell you!",
            ],
            helpText: "Dedicate a lobster to egg production. We don't know how it works. Ask the lobsters.",
        },

        /*
        getRockLobster: {
            name: "Train rock lobster",
            effect: {
                resource: {
                    rockLobster: 1,
                },
            },
            cost: [
                { resource: "lobster", costFunction: "constant", priceIncrease: 1 },
                { resource: "clam", costFunction: "linear", priceIncrease: 150 },
            ],
            max: "rockLobster",
            prereq: {
                resource: {
                    lobster: 1,
                },
                upgrade: ["rockBreaking"],
            },
            outcomes: [
                "Break the rocks, lobster. Break them!",
                "Deployed lobster with a giant crystal nutcracker.",
                "Ready to rock.",
                "Crushing rocks is exactly as difficult as it sounds. This lobster can verify.",
            ],
            multiOutcomes: [
                "Rocks, begone!",
                "Stones? What stones?!",
                "Goodbye, slate.",
                "Goodbye, granite.",
                "Goodbye, generic-looking stone.",
                "Goodbye, pumice.",
                "Goodbye, quartz.",
                "Goodbye, basalt.",
                "Goodbye, limestone.",
                "Goodbye, schist.",
                "Goodbye, diorite.",
            ],
            helpText: "Give a lobster the right gear to crack open stones in the name of gravel.",
        },
        */

        getHarvester: {
            name: "Train lobster harvester",
            effect: {
                resource: {
                    harvester: 1,
                },
            },
            cost: [
                { resource: "lobster", costFunction: "constant", priceIncrease: 1 },
                { resource: "clam", costFunction: "linear", priceIncrease: 25 },
                { resource: "sponge", costFunction: "linear", priceIncrease: 5 },
            ],
            max: "harvester",
            prereq: {
                resource: {
                    lobster: 1,
                },
                upgrade: ["crustaceanBiology"],
            },
            outcomes: [
                "Yes, lobster, put these claws to better use.",
                "It is time for this one to seek more interesting prey. Wait. Wait, no, it's just as stationary. Never mind. False alarm.",
                "Lobster sticks to seabed!",
            ],
            multiOutcomes: [
                "Cut down the kelp forests!",
                "Rip the sponge and tear the kelp!",
                "Harvest the seafloor!",
                "The lobster tide shall claim the-- wait no you said harvesters. Okay. Adjusting that, then.",
                "These guys are pretty unenthusiastic about everything they do, aren't they.",
            ],
            helpText: "Train a lobster to cut down kelp faster than anything can plant it. Sustainable!",
        },

        // SHARK MACHINES ////////////////////////////////////////////////////////////////////////////////

        getCrystalMiner: {
            name: "Build crystal miner",
            effect: {
                resource: {
                    crystalMiner: 1,
                },
            },
            cost: [
                {
                    resource: "crystal",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 100 - 50 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
                {
                    resource: "sand",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 200 - 100 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
                { resource: "sharkonium", costFunction: "linear", priceIncrease: 25 },
            ],
            max: "crystalMiner",
            prereq: {
                resource: {
                    sharkonium: 25,
                },
                upgrade: ["automation"],
            },
            outcomes: [
                "Crystal miner activated.",
                "Crystal miner constructed.",
                "Mining machine online.",
                "Construction complete.",
                "Carve rock. Remove sand. Retrieve target.",
            ],
            multiOutcomes: [
                "The machines rise.",
                "The miners dig.",
                "The crystal shall be harvested.",
                "Crystal miners are complete.",
            ],
            helpText: "Construct a machine to automatically harvest crystals efficiently.",
        },

        getSandDigger: {
            name: "Build sand digger",
            effect: {
                resource: {
                    sandDigger: 1,
                },
            },
            cost: [
                {
                    resource: "sand",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 500 - 250 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
                { resource: "sharkonium", costFunction: "linear", priceIncrease: 150 },
            ],
            max: "sandDigger",
            prereq: {
                resource: {
                    sharkonium: 150,
                },
                upgrade: ["automation"],
            },
            outcomes: [
                "Sand digger constructed.",
                "Sand digger reaches into the seabed.",
                "The digger begins to shuffle sand into its machine maw. Rays dart away.",
                "The machine is online.",
                "The machine acts immediately, shovelling sand.",
            ],
            multiOutcomes: [
                "The machines increase in number.",
                "The diggers devour.",
                "All sand must be gathered.",
                "The rays are concerned.",
                "Devour the sands. Consume.",
                "Giant machines blot out our sun.",
            ],
            helpText: "Construct a machine to automatically dig up sand efficiently.",
        },

        getFishMachine: {
            name: "Build fish machine",
            effect: {
                resource: {
                    fishMachine: 1,
                },
            },
            cost: [{ resource: "sharkonium", costFunction: "linear", priceIncrease: 100 }],
            max: "fishMachine",
            prereq: {
                resource: {
                    sharkonium: 100,
                },
                upgrade: ["automation"],
            },
            outcomes: [
                "Fish machine activated.",
                "Fish machine constructed.",
                "Fishing machine online.",
                "Construction complete.",
                "The quarry moves. But the machine is faster.",
            ],
            multiOutcomes: [
                "One day there will be no fish left. Only the machines.",
                "Today the shark is flesh. Tomorrow, machine.",
                "Your metal servants can sate the hunger. The hunger for fish.",
                "The fishing machines are more efficient than the sharks. But they aren't very smart.",
                "Automated fishing.",
                "The power of many, many sharks, in many, many devices.",
            ],
            helpText: "Construct a machine to automatically gather fish efficiently.",
        },

        getAutoTransmuter: {
            name: "Build auto-transmuter",
            effect: {
                resource: {
                    autoTransmuter: 1,
                },
            },
            cost: [
                {
                    resource: "crystal",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 100 - 50 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
                { resource: "sharkonium", costFunction: "linear", priceIncrease: 100 },
            ],
            max: "autoTransmuter",
            prereq: {
                resource: {
                    sharkonium: 100,
                },
                upgrade: ["engineering"],
            },
            outcomes: [
                "Auto-transmuter activated.",
                "Auto-transmuter constructed.",
                "Transmutation machine online.",
                "Construction complete.",
                "Provide inputs. Only the output matters.",
            ],
            multiOutcomes: [
                "Auto-transmuters are prepared.",
                "The difference between science and magic is reliable application.",
                "All is change.",
                "Change is all.",
                "The machines know many secrets, yet cannot speak of them.",
            ],
            helpText: "Construct a machine to automatically and efficiently transmute sand and crystal to sharkonium.",
        },

        getSkimmer: {
            name: "Build skimmer",
            effect: {
                resource: {
                    skimmer: 1,
                },
            },
            cost: [
                {
                    resource: "junk",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 400 - 200 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
                { resource: "sharkonium", costFunction: "linear", priceIncrease: 200 },
            ],
            max: "skimmer",
            prereq: {
                resource: {
                    junk: 1,
                },
                upgrade: ["engineering"],
            },
            outcomes: [
                "Skimmer activated.",
                "Skimmer constructed.",
                "Residue producer online.",
                "Construction complete.",
                "Sacrifices must be made for progress.",
            ],
            multiOutcomes: [
                "The lesser resource becomes the greatest of all.",
                "Transmutation is limited. The recycler is greater.",
                "Consumption and production are two halves of the greater whole.",
                "The creations of sharks emerge from a pattern as old as their species.",
            ],
            helpText:
                "Construct a machine to automatically recycle fish and sand into residue with perfect efficiency.",
        },

        getHeater: {
            name: "Build heater",
            effect: {
                resource: {
                    heater: 1,
                },
            },
            cost: [{ resource: "sharkonium", costFunction: "linear", priceIncrease: 250 }],
            max: "heater",
            prereq: {
                upgrade: ["thermalConditioning"],
            },
            outcomes: [
                "Heater activated.",
                "Heater constructed.",
                "Climate control online.",
                "Construction complete.",
                "The end of ice.",
            ],
            multiOutcomes: [
                "The ice age comes to a close.",
                "Is this replacing one form of destruction for another?",
                "Life becomes easier.",
                "The warmth. The warmth we desired so much.",
                "Life returns to the frozen sea.",
                "This world awakens.",
            ],
            helpText: "Construct a machine to combat the advancing ice shelf.",
        },

        // MODDED MACHINES

        /*
        getCoalescer: {
            name: "Construct coalescer",
            effect: {
                resource: {
                    coalescer: 1,
                },
            },
            cost: [
                { resource: "knowledge", costFunction: "linear", priceIncrease: 1 },
                { resource: "science", costFunction: "linear", priceIncrease: 20000000 },
                { resource: "delphinium", costFunction: "linear", priceIncrease: 2500 },
            ],
            max: "coalescer",
            prereq: {
                upgrade: ["knowledgeCoalescers"],
            },
            outcomes: [
                "Accuring thought energy.",
                "Put together a coalescer.",
                "Constructed a thought coalescer.",
                "The structure begins sapping thoughts from the surroundings.",
                "It's not really a machine...it's more like a ritual station.",
                "For something made by dolphins, it might seem smart, but that's just because it's sapping your brainpower.",
            ],
            multiOutcomes: [
                "Now we're thinking with portals...maybe. I think it involves a portal.",
                "Praise be to the brain gods!",
                "Big brain time.",
                "How do the dolphins know to do this?",
                "Free our minds, oh great creations!",
                "The dolphins seem very, very pleased. I'm not sure that I like this anymore.",
            ],
            helpText: "Create a strange structure to consistently siphon knowledge from its surroundings.",
        },

        getCrusher: {
            name: "Build crusher",
            effect: {
                resource: {
                    crusher: 1,
                },
            },
            cost: [{ resource: "sharkonium", costFunction: "linear", priceIncrease: 250 }],
            max: "crusher",
            prereq: {
                resource: {
                    stone: 1,
                },
                upgrade: ["rockProcessing"],
            },
            outcomes: ["Crusher activated.", "Crusher constructed.", "Crushing begins.", "Construction complete."],
            multiOutcomes: [
                "Stone wasn't very useful anyways.",
                "Shoo, rocks!",
                "We can never run out of rocks. The cycle is forever.",
                "CRUSH. KILL. DESTORY. SMALL ROCKS IN PARTICULAR.",
            ],
            helpText: "Construct a machine to break stone down into gravel.",
        },

        getPulverizer: {
            name: "Build pulverizer",
            effect: {
                resource: {
                    pulverizer: 1,
                },
            },
            cost: [
                { resource: "sharkonium", costFunction: "linear", priceIncrease: 250 },
                { resource: "gravel", costFunction: "linear", priceIncrease: 250 },
            ],
            max: "pulverizer",
            prereq: {
                resource: {
                    gravel: 1,
                },
                upgrade: ["gravelPulverizing"],
            },
            outcomes: [
                "Pulverizing begins in T-minus 3...",
                "Flipping the swtich on, the tumblers churn out sand.",
                "Pulverizer, activated.",
                "Construction complete.",
            ],
            multiOutcomes: [
                "The sand. It flows.",
                "The machines take over for the crabs.",
                "Right now, sand is like gold...we can't find it anywhere.",
                "Machines are better than crabs. They won't gravel- er, grovel.",
                "Man, sand is expensive.",
            ],
            helpText: "Construct a machine to break down gravel into sand.",
        },
        */

        // CRUSTACEAN MACHINES /////////////////////////////////////////////////////////

        getSpongeFarmer: {
            name: "Build sponge farmer",
            effect: {
                resource: {
                    spongeFarmer: 1,
                },
            },
            cost: [{ resource: "coralglass", costFunction: "linear", priceIncrease: 200 }],
            max: "spongeFarmer",
            prereq: {
                resource: {
                    coralglass: 200,
                },
                upgrade: ["coralCircuitry"],
            },
            outcomes: [
                "Sponge farmer is active.",
                "Sponge farmer capable.",
                "This sponge farming machine clatters to life.",
                "This automated caretaker gets to work.",
            ],
            multiOutcomes: [
                "Sponges are not hard to domesticate. It's harder to make them wild.",
                "The shrimp will be happier.",
                "There is something missing compared to our machines. Ours are slightly more menacing, but also more effective.",
                "Who needs this much sponge?",
            ],
            helpText: "This crustacean machine automatically farms and harvests sponge.",
        },

        getBerrySprayer: {
            name: "Build berry sprayer",
            effect: {
                resource: {
                    berrySprayer: 1,
                },
            },
            cost: [{ resource: "coralglass", costFunction: "linear", priceIncrease: 500 }],
            max: "berrySprayer",
            prereq: {
                resource: {
                    coralglass: 500,
                    lobster: 2,
                },
                upgrade: ["coralCircuitry"],
            },
            outcomes: [
                "Berry sprayer is active.",
                "Berry sprayer capable.",
                "This egg spraying machine clatters to life.",
                "This automated caretaker gets to work.", // yeah, it's lazy, I know, but still just as appropriate
            ],
            multiOutcomes: [
                "Automation of population? What a terrifying concept.",
                "The machine rears lobster eggs. Wouldn't the shrimp want something like this too?",
                "There is an uneasiness about these machines that fills the sharks with concern.",
                "Why was this machine invented? Are we helping to prepare an army?",
            ],
            helpText: "This crustacean machine distributes lobster eggs for optimal hatching conditions.",
        },

        getGlassMaker: {
            name: "Build glass maker",
            effect: {
                resource: {
                    glassMaker: 1,
                },
            },
            cost: [
                { resource: "coralglass", costFunction: "linear", priceIncrease: 400 },
                { resource: "sand", costFunction: "linear", priceIncrease: 200 },
                { resource: "coral", costFunction: "linear", priceIncrease: 200 },
            ],
            max: "glassMaker",
            prereq: {
                resource: {
                    coralglass: 400,
                },
                upgrade: ["coralCircuitry"],
            },
            outcomes: [
                "Glass maker is active.",
                "Glass maker capable.",
                "This glass forging machine clatters to life.",
                "The coralglass factory whirrs and boils.",
            ],
            multiOutcomes: [
                "Coralglass. The sharkonium of the shelled kind.",
                "The raw heat from these things could boil the ocean dry. How they do it, we don't know.",
                "Coralglass. So fragile, so beautiful, yet so durable. They make the machines in their own image.",
                "The fine intricacies of these machines are lost on us, given how much of our technological development involves our mouths.",
            ],
            helpText:
                "This crustacean machine automatically makes coralglass out of coral and sand through processes we don't fully understand.",
        },
    },
    abandoned: {
        catchFish: {},

        debugbutton: {},

        prySponge: {
            prereq: {
                upgrade: ["spongeCollection"],
            },
        },
        getClam: {},

        // CONVERSIONS ////////////////////////////////////////////////////////////////////////////////

        spongeFiltration: {
            name: "Manufacture sponge filter",
            effect: {
                resource: {
                    filter: 1,
                },
            },
            cost: [{ resource: "sponge", costFunction: "linear", priceIncrease: 5 }],
            max: "filter",
            prereq: {
                resource: {
                    sponge: 1,
                },
                upgrade: ["environmentalism"],
            },
            outcomes: [
                "Sweet, sweet filtration!",
                "Smell that water! Couldn't you just eat it like fish?!",
                "Hope restored.",
                "In darkness, we find salvation.",
                "One organism corrects the mistakes of another.",
                "Clean water restored.",
                "Surely, this is sustainable.",
                "Begone, filth!",
                "Saved by sponge. Who would've thought?",
            ],
            helpText: "Create filters from sponge to get rid of tar.",
        },

        breakDownAncientPart: {
            name: "Break down ancient parts",
            effect: {
                resource: {
                    science: 2500,
                },
            },
            cost: [{ resource: "ancientPart", costFunction: "constant", priceIncrease: 1 }],
            max: "ancientPart",
            prereq: {
                upgrade: ["reverseEngineering"],
            },
            outcomes: [
                "Fascinating.",
                "Progress.",
                "Ohh. Now it makes sense. Wait, nevermind.",
                "What are these even made out of??",
                "Now that it's taken apart, how do we put it back together??",
                "The doohickey's connected to the...spring-thing. The spring-thing's connected to the...wait, no it isn't.",
                "A lot was learned from this! Maybe!",
            ],
            helpText: "Break down ancient parts to advance science.",
        },

        // MAKE ADVANCED RESOURCES  ///////////////////////////////////////////////////////////////////////////////

        transmuteSharkonium: {},

        forgeSpronge: {
            name: "Forge sponge into spronge",
            effect: {
                resource: {
                    spronge: 1,
                    //tar: 0.001,
                },
            },
            cost: [
                {
                    resource: "sponge",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 5 - SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
                {
                    resource: "junk",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 15 - 3 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
            ],
            max: "spronge",
            prereq: {
                upgrade: ["industrialGradeSponge"],
            },
            outcomes: [
                "It pulses. That's unsettling.",
                "It shakes and quivers and otherwise acts sort of like sharkonium which is kind of freaking me out uh help",
                "Well, the octopuses know how to use this, I think.",
                "What... what <em>is</em> that?!",
                "Spronge. What a name. I don't think I could name it anything myself. Apart from 'horrifying'.",
                "Sweet fishmas, it's glowing. It's glowing!",
            ],
            helpText: "Repurpose boring old sponge into spronge, building material of the future.",
        },

        fuseAncientPart: {
            name: "Fuse stuff into ancient parts",
            effect: {
                resource: {
                    ancientPart: 1,
                },
            },
            cost: [
                {
                    resource: "crystal",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 100 - 20 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
                {
                    resource: "clam",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 300 - 60 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
            ],
            max: "ancientPart",
            prereq: {
                upgrade: ["highEnergyFusion"],
            },
            outcomes: [
                "FUSION!",
                "Progress.",
                "The past is irrelevant when we create the future.",
                "What are we making again? What is this material???",
                "The water boils with energy, and the finished product drops to the seafloor.",
                "Fusion completed.",
                "The lasers converge to a point, superheating the clams and reforming them.",
                "How could this be made without already having the parts??",
            ],
            helpText: "Convert clams (and crystals) directly into ancient parts.",
        },

        // BUY ANIMALS ////////////////////////////////////////////////////////////////////////////////

        getShark: {},

        getManta: {},

        getCrab: {},

        getOctopus: {
            name: "Employ octopus",
            effect: {
                resource: {
                    octopus: 1,
                },
            },
            cost: [{ resource: "clam", costFunction: "linear", priceIncrease: 15 }],
            max: "octopus",
            prereq: {
                resource: {
                    clam: 1,
                },
                upgrade: ["clamScooping"],
            },
            outcomes: [
                "A capricorn night octopus joins you.",
                "A plain-body night octopus joins you.",
                "A hammer octopus joins you.",
                "A southern keeled octopus joins you.",
                "A two-spot octopus joins you.",
                "A caribbean reef octopus joins you.",
                "A southern white-spot octopus joins you.",
                "A bigeye octopus joins you.",
                "A carolinian octopus joins you.",
                "A lesser pacific striped octopus joins you.",
                "A chestnut octopus joins you.",
                "A big blue octopus joins you.",
                "A lilliput longarm octopus joins you.",
                "A red-spot night octopus joins you.",
                "A globe octopus joins you.",
                "A scribbled night octopus joins you.",
                "A bumblebee two-spot octopus joins you.",
                "A southern sand octopus joins you.",
                "A lobed octopus joins you.",
                "A starry night octopus joins you.",
                "A atlantic white-spotted octopus joins you.",
                "A maori octopus joins you.",
                "A mexican four-eyed octopus joins you.",
                "A galapagos reef octopus joins you.",
                "An ornate octopus joins you.",
                "A white-striped octopus joins you.",
                "A pale octopus joins you.",
                "A japanese pygmy octopus joins you.",
                "A east pacific red octopus joins you.",
                "A spider octopus joins you.",
                "A moon octopus joins you.",
                "A frilled pygmy octopus joins you.",
                "A tehuelche octopus joins you.",
                "A gloomy octopus joins you.",
                "A veiled octopus joins you.",
                "A bighead octopus joins you.",
                "A common octopus joins you.",
                "A club pygmy octopus joins you.",
                "A star-sucker pygmy octopus joins you.",
                "An atlantic banded octopus joins you.",
            ],
            multiOutcomes: [
                "Efficiency increases with limb count.",
                "Hard to understand, but hardworking nonetheless.",
                "The minds of the octopuses are a frontier unbraved by many sharks.",
                "They hardly seem to notice you. They take their payment and begin to harvest.",
                "They say something about the schedule being on target.",
                "One of the new batch tells you to find unity in efficiency.",
                "You could have sworn you saw an octopus among the crowd glinting like metal.",
                "Octopi? No. Octopodes? Definitely not.",
            ],
            helpText: "Pay an octopus for their efficient clam retrieval services.",
        },

        // SHARK JOBS ////////////////////////////////////////////////////////////////////////////////

        getScientist: {},

        getNurse: {},

        // RAY JOBS ////////////////////////////////////////////////////////////////////////////////

        getLaser: {},

        getMaker: {
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 400 },
            ],
        },

        // CRAB JOBS ////////////////////////////////////////////////////////////////////////////////

        getCollector: {
            name: "Instruct collector crab",
            effect: {
                resource: {
                    collector: 1,
                },
            },
            cost: [
                { resource: "crab", costFunction: "constant", priceIncrease: 1 },
                { resource: "sponge", costFunction: "linear", priceIncrease: 5 },
            ],
            max: "collector",
            prereq: {
                resource: {
                    crab: 1,
                },
                upgrade: ["agriculture"],
            },
            outcomes: [
                "Crab understands how to snip sponge.",
                "Crab will now get sponges.",
                "This crab has graduated from sponge school.",
                "One more educated individual, ready to do a surprisingly difficult task.",
            ],
            multiOutcomes: [
                "The crabs now understand how to get sponges.",
                "Collect and conquer. The sponges. Conquer the sponges.",
                "Sponge incoming!",
                "The porous fiends are no match for the claws of a crab!",
                "Crystals? Who needs crystals when you can have sponge?!",
                "Yes, collecting sponges is much harder than it looks!",
                "Why do we need these again?",
                "Each rock will have a crab, as each sponge has a rock.",
            ],
            helpText: "Instruct a crab on the proper way to collect sponges from rocks.",
        },

        getBrood: {},

        // OCTOPUS JOBS ////////////////////////////////////////////////////////////////////////////////

        getInvestigator: {
            name: "Reassign octopus as Investigator",
            effect: {
                resource: {
                    investigator: 1,
                },
            },
            cost: [
                { resource: "octopus", costFunction: "constant", priceIncrease: 1 },
                { resource: "clam", costFunction: "linear", priceIncrease: 100 },
            ],
            max: "investigator",
            prereq: {
                resource: {
                    octopus: 1,
                },
                upgrade: ["octopusMethodology"],
            },
            outcomes: [
                "An octopus is an investigator now.",
                "Octopus, investigator.",
                "The role has been assigned. investigator.",
                "The delegation has been made. investigator.",
                "This individual now investigates.",
            ],
            multiOutcomes: [
                "Investigators will study the unknown in pursuit of collective gain.",
                "Investigators will study objects they do not understand.",
                "Investigators will examine any thing out of place.",
                "Investigators will act as instructed.",
            ],
            helpText: "Delegate an octopus to investigate strange objects and phenomena for science.",
        },

        getScavenger: {
            name: "Reassign octopus as scavenger",
            effect: {
                resource: {
                    scavenger: 1,
                },
            },
            cost: [
                { resource: "octopus", costFunction: "constant", priceIncrease: 1 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 50 },
            ],
            max: "scavenger",
            prereq: {
                resource: {
                    octopus: 1,
                },
                upgrade: ["farAbandonedExploration"],
            },
            outcomes: [
                "An octopus is a scavenger now.",
                "Octopus, scavenger.",
                "The role has been assigned. Scavenger.",
                "The delegation has been made. Scavenger.",
                "This individual now scavenges.",
            ],
            multiOutcomes: [
                "Scavengers will retrieve the broken pieces of a once great society.",
                "Scavengers will scavenge from the wreckage of the city.",
                "Scavengers will take only what is still useful.",
                "Scavengers will act as instructed.",
            ],
            helpText: "Delegate an octopus to scavenge strange mechanical components from the city.",
        },

        // SHARK MACHINES ////////////////////////////////////////////////////////////////////////////////

        getCrystalMiner: {},

        getSandDigger: {},

        getFishMachine: {},

        getSkimmer: {
            prereq: {
                resource: {
                    junk: 1,
                },
                upgrade: ["recyclerDiscovery"],
            },
        },

        // OCTOPUS MACHINES /////////////////////////////////////////////////////////

        getClamCollector: {
            name: "Build clam collector",
            effect: {
                resource: {
                    clamCollector: 1,
                },
            },
            cost: [{ resource: "spronge", costFunction: "linear", priceIncrease: 50 }],
            max: "clamCollector",
            prereq: {
                resource: {
                    spronge: 50,
                },
                upgrade: ["sprongeBiomimicry"],
            },
            outcomes: [
                "Machine: clam collector. Operation: in progress.",
                "Machine: clam collector. Operation: beginning.",
                "Machine: clam collector. Result: clam collection.",
                "Machine: clam collector. Result: food for the masses.",
            ],
            multiOutcomes: [
                "These machines feel strangely alive. They pulse and throb.",
                "There exist more clam collectors now.",
                "The biomachine expands.",
                "The octopuses tell me, find unity in efficiency. Find peace in automation.",
            ],
            helpText: "This octopus machine collects clams. Simple purpose, simple machine.",
        },

        getEggBrooder: {
            name: "Build egg brooder",
            effect: {
                resource: {
                    eggBrooder: 1,
                },
            },
            cost: [
                { resource: "spronge", costFunction: "linear", priceIncrease: 150 },
                { resource: "octopus", costFunction: "constant", priceIncrease: 1 },
            ],
            max: "eggBrooder",
            prereq: {
                resource: {
                    spronge: 150,
                    octopus: 10,
                },
                upgrade: ["sprongeBiomimicry"],
            },
            outcomes: [
                "Machine: egg brooder. Operation: in progress.",
                "Machine: egg brooder. Operation: beginning.",
                "Machine: egg brooder. Result: egg maintenance.",
                "Machine: egg brooder. Result: population rises.",
                "Machine: egg brooder. Cost: within acceptable parameters.",
            ],
            multiOutcomes: [
                "These machines feel strangely alive. They pulse and throb.",
                "There exist more egg brooders now.",
                "The biomachine expands.",
                "The octopuses tell me, find unity in efficiency. Find peace in an optimised generation.",
            ],
            helpText: "This octopus machine broods and incubates octopus eggs.",
        },

        getSprongeSmelter: {
            name: "Build spronge smelter",
            effect: {
                resource: {
                    sprongeSmelter: 1,
                },
            },
            cost: [{ resource: "spronge", costFunction: "linear", priceIncrease: 100 }],
            max: "sprongeSmelter",
            prereq: {
                resource: {
                    spronge: 100,
                },
                upgrade: ["sprongeBiomimicry"],
            },
            outcomes: [
                "Machine: spronge smelter. Operation: in progress.",
                "Machine: spronge smelter. Operation: beginning.",
                "Machine: spronge smelter. Result: spronge smelting.",
                "Machine: spronge smelter. Result: further development.",
            ],
            multiOutcomes: [
                "These machines feel strangely alive. They pulse and throb.",
                "There exist more spronge smelters now.",
                "The biomachine expands.",
                "The octopuses tell me, find unity in efficiency. Find peace in an assured future.",
            ],
            helpText: "This octopus machine imbues sponge with industrial potential. Requires residue for function.",
        },
    },
    haven: {
        catchFish: {},

        debugbutton: {},

        // CONVERSIONS ////////////////////////////////////////////////////////////////////////////////

        seaApplesToScience: {
            effect: {
                resource: {
                    get science() {
                        return 4 * (1 + 0.01 * res.getResource("historian"));
                    },
                },
            },
        },

        // MAKE ADVANCED RESOURCES  ///////////////////////////////////////////////////////////////////////////////

        transmuteSharkonium: {},

        fuseDelphinium: {
            name: "Fuse stuff into delphinium",
            effect: {
                resource: {
                    delphinium: 1,
                },
            },
            cost: [
                {
                    resource: "coral",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 15 - 3 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
                {
                    resource: "crystal",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 5 - SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
            ],
            max: "delphinium",
            prereq: {
                upgrade: ["aquamarineFusion"],
            },
            outcomes: [
                "Fusion confusion.",
                "Fission's fishy.",
                "Delphinium, something that, much like its inventors, just isn't quite as legitimate in the ocean.",
                "Delphinium, a substance we tolerate!",
                "Delphinium! It's a product!",
                "Delphinium! It... uh, is a thing! That exists!",
            ],
            helpText: "Fuse valuable resources into delphinium, which is kinda like sharkonium. Except worse.",
        },

        craftPapyrus: {
            name: "Craft kelp papyrus",
            effect: {
                resource: {
                    papyrus: 1,
                },
            },
            cost: [{ resource: "kelp", costFunction: "constant", priceIncrease: 15 }],
            max: "papyrus",
            prereq: {
                upgrade: ["kelpPapyrus"],
            },
            outcomes: ["foobar."],
            helpText: "Using the power of the sun somehow, make crunchy, solid kelp sheets for writing stuff down.",
        },

        // BUY ANIMALS ////////////////////////////////////////////////////////////////////////////////

        getShark: {},

        getManta: {},

        getCrab: {},

        getDolphin: {
            name: "Fetch dolphin",
            effect: {
                resource: {
                    dolphin: 1,
                },
            },
            cost: [
                { resource: "fish", costFunction: "linear", priceIncrease: 5 },
                { resource: "coral", costFunction: "linear", priceIncrease: 2 },
            ],
            max: "dolphin",
            prereq: {
                upgrade: ["cetaceanAwareness"],
            },
            outcomes: [
                "A white beaked dolphin joins you.",
                "A short finned pilot whale joins you.",
                "A pantropical dolphin joins you.",
                "A long-finned pilot whale joins you.",
                "A hourglass dolphin joins you.",
                "A bottlenose dolphin joins you.",
                "A striped dolphin joins you.",
                "A pygmy killer whale joins you.",
                "A melon-headed whale joins you.",
                "An irrawaddy dolphin joins you.",
                "A dusky dolphin joins you.",
                "A clymene dolphin joins you.",
                "A black dolphin joins you.",
                "A southern right-whale dolphin joins you.",
                "A rough toothed dolphin joins you.",
                "A short beaked common dolphin joins you.",
                "A pacific white-sided dolphin joins you.",
                "A northern right-whale dolphin joins you.",
                "A long-snouted spinner dolphin joins you.",
                "A long-beaked common dolphin joins you.",
                "An atlantic white sided dolphin joins you.",
                "An atlantic hump-backed dolphin joins you.",
                "An atlantic spotted dolphin joins you.",
            ],
            multiOutcomes: [
                "A pod of dolphins!",
                "More of them. Hm.",
                "More of these squeaky chatterers.",
                "More whiners.",
                "Do we need these guys?",
                "They have to be good for something.",
            ],
            helpText: "Pay a dolphin to help us get coral or something. Prepare to put up with whining.",
        },

        getWhale: {
            name: "Reach whale",
            effect: {
                resource: {
                    whale: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 25000 }],
            max: "whale",
            prereq: {
                upgrade: ["whaleCommunication"],
            },
            outcomes: [
                "A blue whale joins you.",
                "A pygmy blue whale joins you.",
                "A bowhead whale joins you.",
                "A fin whale joins you.",
                "A gray whale joins you.",
                "A humpback whale joins you.",
                "A southern minke whale joins you.",
                "A common minke whale  joins you.",
                "A dwarf minke whale joins you.",
                "A pygmy right whale joins you.",
                "A north right whale  joins you.",
                "A southern right whale joins you.",
                "A sei whale joins you.",
                "A beluga whale joins you.",
                "A sperm whale joins you.",
                "A pygmy sperm whale joins you.",
                "A dwarf sperm whale joins you.",
            ],
            multiOutcomes: [
                "A pod of whales!",
                "Aloof, mysterious, big.",
                "So majestic. Wait, no, we're looking at a boulder formation.",
                "The songs are mesmerising.",
                "They might not all eat fish, but they're great at rounding them up.",
            ],
            helpText: "Persuade one of the great whales to help us out. They can round up entire schools.",
        },

        // SHARK JOBS ////////////////////////////////////////////////////////////////////////////////

        getScientist: {},

        getNurse: {},

        // RAY JOBS ////////////////////////////////////////////////////////////////////////////////

        getLaser: {},

        getMaker: {
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 300 },
            ],
        },

        // CRAB JOBS ////////////////////////////////////////////////////////////////////////////////

        getPlanter: {},

        getBrood: {},

        // DOLPHIN JOBS ////////////////////////////////////////////////////////////////////////////////

        getTreasurer: {
            name: "Promote dolphin treasurer",
            effect: {
                resource: {
                    treasurer: 1,
                },
            },
            cost: [
                { resource: "dolphin", costFunction: "constant", priceIncrease: 1 },
                { resource: "coral", costFunction: "linear", priceIncrease: 20 },
            ],
            max: "treasurer",
            prereq: {
                upgrade: ["coralCollection"],
            },
            outcomes: [
                "Treasurer of the dolphin treasures, go!",
                "We are trusting this dolphin with a lot. Is that wise?",
                "A dolphin is promoted to where it can do slightly more damage!",
                "Dolphin treasurer ready to do... whatever it is they do.",
            ],
            multiOutcomes: [
                "Do we need this many treasurers?",
                "Should we be encouraging this?",
                "We require more crystals.",
                "You might be playing a dangerous game trusting these guys.",
                "The treasury grows!",
            ],
            helpText:
                "Promote a dolphin to a harder job involving interest on precious coral and crystal or something like that.",
        },

        getHistorian: {
            name: "Qualify dolphin historian",
            effect: {
                resource: {
                    historian: 1,
                },
            },
            cost: [
                { resource: "dolphin", costFunction: "constant", priceIncrease: 1 },
                { resource: "science", costFunction: "linear", priceIncrease: 100 },
            ],
            max: "historian",
            prereq: {
                resource: {
                    dolphin: 1,
                },
                upgrade: ["retroactiveRecordkeeping"],
            },
            outcomes: [
                "We've given a dolphin free opportunity to ramble. WHY?!",
                "Let's humour this dolphin's rambling.",
                "This historian might have some insight.",
                "Maybe this dolphin can answer the question of why we're even working with dolphins.",
                "There are questions we have that this historian could answer for us.",
            ],
            multiOutcomes: [
                "We begrudgingly acknowledge that working together is providing us with new insights.",
                "History is told by the victors. The dolphins are losers, but they'll tell it anyway.",
                "These pretentious clicking jerks can sometimes raise a good point.",
                "Oh joy. We're encouraging them to talk more.",
                "Maybe if we let them talk about themselves a lot, they'll stop being so mean??",
                "Ah, yes. Qualify an ego-stroker.",
                "For the last time, I don't need to hear the story of Dolphantine again!!",
            ],
            helpText:
                "Determine which of these dolphins is actually smart, and not just repeating meaningless stories.",
        },

        getBiologist: {
            name: "Train dolphin biologist",
            effect: {
                resource: {
                    biologist: 1,
                },
            },
            cost: [
                { resource: "dolphin", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 40 },
            ],
            max: "biologist",
            prereq: {
                resource: {
                    dolphin: 1,
                },
                upgrade: ["dolphinBiology"],
            },
            outcomes: [
                "Dolphin biologist graduated!",
                "Biologist trained.",
                "Dolphin dedicated to dolphin duty.",
                "Specialist dolphin ready for dolphin.",
            ],
            multiOutcomes: [
                "More of them. Eesh.",
                "Dolphins proliferate.",
                "Dolphin biologists ready for whatever passes for their 'research'.",
                "Smug hedonists, the lot of them!",
                "The dolphin population regretfully grows.",
            ],
            helpText:
                "Train a dolphin to specialise in biology. Dolphin biology, specifically, and production, apparently.",
        },

        // WHALE JOBS ////////////////////////////////////////////////////////////////////////////////

        getChorus: {
            name: "Assemble great chorus",
            effect: {
                resource: {
                    chorus: 1,
                },
            },
            cost: [
                {
                    resource: "whale",
                    costFunction: "unique",
                    priceIncrease: 3000,
                },
                {
                    resource: "dolphin",
                    costFunction: "unique",
                    priceIncrease: 100000,
                },
            ],
            max: "chorus",
            prereq: {
                resource: {
                    whale: 1,
                },
                upgrade: ["eternalSong"],
            },
            outcomes: [
                "The chorus is made.",
                "The singers sing an immortal tune.",
                "The song is indescribable.",
                "Serenity, eternity.",
                "What purpose does the song have?",
                "Liquid infinity swirls around the grand chorus.",
            ],
            helpText: "Form the singers of the eternal song. Let it flow through this world.",
        },

        // SHARK MACHINES ////////////////////////////////////////////////////////////////////////////////

        getCrystalMiner: {},

        getSandDigger: {},

        getFishMachine: {},

        getAutoTransmuter: {},

        getSkimmer: {},

        // DOLPHIN MACHINES /////////////////////////////////////////////////////////

        getCrimsonCombine: {
            name: "Build crimson combine",
            effect: {
                resource: {
                    crimsonCombine: 1,
                },
            },
            cost: [
                { resource: "delphinium", costFunction: "linear", priceIncrease: 75 },
                {
                    resource: "coral",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 300 - 150 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
            ],
            max: "crimsonCombine",
            prereq: {
                upgrade: ["dolphinTechnology"],
            },
            outcomes: [
                "The combine activates, and navigates to the nearest reef.",
                "Animals are torn from the reefbed at lightning speed.",
                "A red fog surrounds the machine as it begins to harvest.",
                "The blades of the combine spin up, and begin their reckless harvest.",
            ],
            multiOutcomes: [
                "Soon, the coral will be ours, but at what cost?",
                "Sustainability has failed us.",
                "We must resort to drastic measures in the name of progress.",
                "Treasurers are slow. Machines are fast. But not that fast, it's still made of delphinium, mind you.",
                "I hope the biosphere didn't need this coral for anything.",
                "The red mist grows.",
            ],
            helpText: "This dolphin machine pries coral from the reefs at a reckless pace.",
        },

        getKelpCultivator: {
            name: "Build kelp cultivator",
            effect: {
                resource: {
                    kelpCultivator: 1,
                },
            },
            cost: [
                { resource: "delphinium", costFunction: "linear", priceIncrease: 100 },
                {
                    resource: "seaApple",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 25 - 12.5 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
            ],
            max: "kelpCultivator",
            prereq: {
                upgrade: ["dolphinTechnology"],
            },
            outcomes: [
                "The kelp cultivator activates and begins planting its garden.",
                "The kelp cultivator turns on and nagivates to a suitable planting spot.",
                "The kelp cultivator will not disturb the natural order.",
                "The kelp cultivator works in tandem with nature.",
            ],
            multiOutcomes: [
                "Sustainability is a must.",
                "These gentle machines are, in fact, slow and methodical, just as expected from dolphin machines.",
                "Toward their gardens, these machines can almost feel care.",
                "The machines do not like the sea apples. They forcefully extract them for us.",
                "I mean, it's clearly eco-friendly, but is it really necessary to go this slow??",
            ],
            helpText: "This dolphin machine carefully tends to gardens of kelp.",
        },

        getTirelessCrafter: {
            name: "Build tireless crafter",
            effect: {
                resource: {
                    tirelessCrafter: 1,
                },
            },
            cost: [
                { resource: "delphinium", costFunction: "linear", priceIncrease: 100 },
                {
                    resource: "crystal",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 100 - 50 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
                {
                    resource: "coral",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 100 - 50 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
            ],
            max: "tirelessCrafter",
            prereq: {
                resource: {
                    delphinium: 200,
                },
                upgrade: ["dolphinTechnology"],
            },
            outcomes: [
                "Tireless crafter fuses the matter.",
                "Tireless crafter never ceases.",
                "Tireless crafter lays foundation for a future.",
                "Tireless crafter is an accident waiting to happen.",
            ],
            multiOutcomes: [
                "Delphinium. The warped counterpart to sharkonium.",
                "A silent, heatless process, much like the auto-transmuter's method of operation.",
                "Delphinium. We don't understand it. It feels a lot like sharkonium, but warmer.",
                "The complexity of these machines is unwarranted. The dolphins think themselves smarter, but we have simpler, more effective solutions.",
            ],
            helpText:
                "This dolphin machine creates delphinium. What good that is to us is a mystery. Use it to make their useless machines, I guess?",
        },
    },
    frigid: {
        catchFish: {},

        debugbutton: {},

        // MAKE ADVANCED RESOURCES  ///////////////////////////////////////////////////////////////////////////////

        transmuteSharkonium: {},

        // BUY ANIMALS ////////////////////////////////////////////////////////////////////////////////

        getShark: {},

        getSquid: {
            name: "Enlist squid",
            effect: {
                resource: {
                    squid: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 15 }],
            max: "squid",
            prereq: {
                upgrade: ["civilContact"],
            },
            outcomes: [
                "A giant squid joins you.",
                "A bush-club squid joins you.",
                "A comb-finned squid joins you.",
                "A glass squid joins you.",
                "An armhook squid joins you.",
                "A jewel squid joins you.",
                "A scaled squid joins you.",
                "A big-fin squid joins you.",
                "A whip-lash squid joins you.",
                "A flying squid joins you.",
                "A hooked squid joins you.",
                "A glacial squid joins you.",
                "A fire squid joins you.",
                "A grass squid joins you.",
            ],
            multiOutcomes: [
                "The squid join the frenzy, but stay close to the village.",
                "The squid are cooperative and obedient. They do as directed.",
                "A squiggle of squid! No, of course that's not real.",
                "You all. Hunting duty. Get on it.",
                "Squid are ready to hunt.",
                "The squid venture out in search of fish.",
                "The squid have no qualms about joining the frenzy.",
                "The squid offer their utmost respect.",
            ],
            helpText: "Enlist a squid to help us hunt down fish. Squid are used to the cold.",
        },

        getCrab: {
            prereq: {
                resource: {
                    shark: 6,
                },
            },
            helpText: "Hire a crab to find things that sharks overlook.",
        },

        getUrchin: {
            name: "Attract urchin",
            effect: {
                resource: {
                    urchin: 1,
                },
            },
            cost: [{ resource: "kelp", costFunction: "linear", priceIncrease: 1 }],
            max: "urchin",
            prereq: {
                upgrade: ["urchinAttraction"],
            },
            outcomes: [
                "A collector urchin joins you.",
                "A burrowing urchin joins you.",
                "A fire urchin joins you.",
                "A lance urchin joins you.",
                "A long-spined urchin joins you.",
                "A reef urchin joins you.",
                "A rock-boring urchin joins you.",
                "A pencil urchin joins you.",
                "A needle urchin joins you.",
                "A violet urchin joins you.",
                "A purple urchin joins you.",
                "A double-spined urchin joins you.",
                "A flower urchin joins you.",
            ],
            multiOutcomes: [
                "ow ow ow spikes hurt",
                "The urchins join the frenzy. The frenzy keeps its distance.",
                "Prickly.",
                "A pile of sea urchins. A whole pile of them.",
                "The urchins, they're everywhere!",
                "How many urchins could we possibly need?",
                "The urchins go straight to harvesting kelp, and in the process, sand.",
                "And we're sure that we need urchins this badly?",
                "I wonder if these things can be weaponized...",
                "These aren't poisonous...Right?",
            ],
            helpText: "Attract an urchin who will gather kelp and sand. Urchins are used to the cold.",
        },

        // SHARK JOBS ////////////////////////////////////////////////////////////////////////////////

        getScientist: {},

        getNurse: {},

        // SQUID JOBS ////////////////////////////////////////////////////////////////////////////////

        getExtractionTeam: {
            //i consider this a squid job
            name: "Organize extraction team",
            effect: {
                resource: {
                    extractionTeam: 1,
                },
            },
            cost: [
                { resource: "crab", costFunction: "constant", priceIncrease: 1 },
                { resource: "squid", costFunction: "constant", priceIncrease: 1 },
                { resource: "kelp", costFunction: "linear", priceIncrease: 50 },
            ],
            max: "extractionTeam",
            prereq: {
                upgrade: ["assistedExtraction"],
            },
            outcomes: [
                "Team assembled.",
                "Initiating teamwork.",
                "Cooperation commencing.",
                "The crab climbs onto the squid's head. Now, they are a team.",
                "Crab + Squid = Crystal???",
                "The squid's speed quickly makes up for the effect of the cold on the crab, and they zip into the distance.",
                "The squid straps the crab to itself with a band of kelp. That's one way, I guess.",
            ],
            multiOutcomes: [
                "The method of cooperation varies, but the result is always the same.",
                "Some of these pairs have...unique strategies. That one has make a bundle with its kelp.",
                "The pairs dart off into the ocean.",
                "The teams form a loose group, which then moves in a general direction.",
                "Teamwork makes the dream work, or something.",
                "That's a lot of crystal.",
                "Has anyone ever stopped to consider why these things need kelp?",
            ],
            helpText: "Convince a squid and a crab to work together to gather crystals.",
        },

        getCollective: {
            name: "Assemble squid collective",
            effect: {
                resource: {
                    collective: 1,
                },
            },
            cost: [
                { resource: "squid", costFunction: "constant", priceIncrease: 10 },
                { resource: "fish", costFunction: "linear", priceIncrease: 1000 },
            ],
            max: "collective",
            prereq: {
                upgrade: ["squidBiology"],
            },
            outcomes: [
                "The squid have been collected.",
                "The group congregates and begins doing whatever it is they do.",
                "A collective of squid collectively collects itself.",
                "I collect that this collective is collectively collected.",
                "Why is it not called a collection?",
                "A bunch of squid get together and do something or other.",
            ],
            multiOutcomes: [
                "Collect the squid. Collect them.",
                "Collected a bunch of squid, I guess.",
                "Why do squid have to do everything as a team???",
                "I'm a bit concerned about future living space at this point.",
                "How many squid could possibly be needed to do this job??",
            ],
            helpText: "Bring together a group of squid to produce even more squid.",
        },

        // CRAB JOB ////////////////////////////////////////////////////////////////////////////////

        getBrood: {},

        // URCHIN JOB ////////////////////////////////////////////////////////////////////////////////////

        getSpawner: {
            name: "Designate urchin spawner",
            effect: {
                resource: {
                    spawner: 1,
                },
            },
            cost: [
                { resource: "urchin", costFunction: "constant", priceIncrease: 1 },
                { resource: "kelp", costFunction: "linear", priceIncrease: 15 },
            ],
            max: "spawner",
            prereq: {
                upgrade: ["urchinBiology"],
            },
            outcomes: [
                "Wait, so, run this process by me again real quick?",
                "The urchin stops collecting kelp.",
                "If urchins could talk, I'd want to know what they think of this change of profession.",
            ],
            multiOutcomes: [
                "Hold on - more?",
                "Wait, who said we needed more?",
                "Did we not already have enough?",
                "At this rate, the entire sea floor will eventually fill up with urchins!",
                "Seriously, I can't look anywhere and NOT see more of them.",
                "I'm gonna wake up tomorrow covered in these things, I swear.",
                "I'm a bit concerned about future living space at this point.",
            ],
            helpText: "Tell an urchin to go make more urchins.",
        },

        // SHARK MACHINES ////////////////////////////////////////////////////////////////////////////////

        getCrystalMiner: {},

        getSandDigger: {},

        getFishMachine: {},

        getAutoTransmuter: {},

        getHeater: {
            name: "Build heater",
            effect: {
                resource: {
                    heater: 1,
                },
            },
            cost: [
                { resource: "sharkonium", costFunction: "linear", priceIncrease: 100 },
                {
                    resource: "kelp",
                    costFunction: "linear",
                    get priceIncrease() {
                        return 750 - 375 * SharkGame.Aspects.amorphousAssembly.level;
                    },
                },
            ],
            max: "heater",
            prereq: {
                upgrade: ["artificialHeating"],
            },
            outcomes: [
                "Heater activated.",
                "Heater constructed.",
                "Climate control online.",
                "Construction complete.",
                "Less-ice-inator is ready to go.",
            ],
            multiOutcomes: [
                "The ice crawls toward us regardless.",
                "Are we fighting a hopeless cause?",
                "The machines extend our lives, but can they truly save us?",
                "The warmth. The warmth we desired so much.",
                "The frozen sea lives a little longer.",
                "This world dies slower.",
            ],
            get helpText() {
                return SharkGame.Upgrades.purchased.indexOf("rapidRecharging") > -1
                    ? "Construct one of the machines we used to slow the formerly-advancing ice shelf. Not much use now."
                    : "Construct a machine to slow down the advancing ice shelf.";
            },
        },
    },
    shrouded: {
        catchFish: {},

        debugbutton: {},

        getJellyfish: {},

        // CONVERSIONS ////////////////////////////////////////////////////////////////////////////////

        jellyfishToScience: {
            name: "Dismantle jellyfish",
            effect: {
                resource: {
                    science: 4,
                },
            },
            cost: [{ resource: "jellyfish", costFunction: "constant", priceIncrease: 1 }],
            max: "jellyfish",
            prereq: {
                resource: {
                    jellyfish: 150,
                },
                upgrade: ["xenobiology"],
            },
            outcomes: [
                "Eww eww gross it's so gloopy and fragile and OW IT STUNG ME",
                "These things are like a bag of wonders. Weird, tasteless wonders.",
                "Wow, sea apples seemed weird, but these things barely exist.",
                "Well, they turned out just as fragile as they looked.",
                "So interesting!",
            ],
            helpText: "Examine the goop inside the stinging jellies! Discovery!",
        },

        makeSacrifice: {
            name: "Perform Arcane Sacrifice",
            effect: {
                resource: {
                    sacrifice: 1,
                },
            },
            cost: [{ resource: "arcana", costFunction: "constant", priceIncrease: 1 }],
            max: "arcana",
            prereq: {
                upgrade: ["arcaneSacrifice"],
            },
            outcomes: [
                "For the greater good.",
                "For the good of us all.",
                "The power within these shards is now ours.",
                "The flash is dizzying, but the power is worth it.",
                "The shards rupture into tiny pieces that disintegrate everywhere.",
                "That familiar feeling.",
                "Feel the power. Feel the flow of energy.",
            ],
            helpText:
                "Smash large quantities of arcana to release the energy contained within, so that it might be used for the greater good.",
        },

        // MAKE ADVANCED RESOURCES  ///////////////////////////////////////////////////////////////////////////////

        transmuteSharkonium: {},

        // BUY ANIMALS ////////////////////////////////////////////////////////////////////////////////

        getShark: {
            name: "Recruit shark",
            effect: {
                resource: {
                    shark: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 5 }],
            max: "shark",
            prereq: {
                resource: {
                    fish: 5,
                },
            },
            outcomes: [
                "A bignose shark joins you.",
                "A blacktip reef shark joins you.",
                "A blue shark joins you.",
                "A bull shark joins you.",
                "A cat shark joins you.",
                "A crocodile shark joins you.",
                "A dusky whaler shark joins you.",
                "A dogfish joins you.",
                "A graceful shark joins you.",
                "A grey reef shark joins you.",
                "A goblin shark joins you.",
                "A hammerhead shark joins you.",
                "A hardnose shark joins you.",
                "A lemon shark joins you.",
                "A milk shark joins you.",
                "A nervous shark joins you.",
                "An oceanic whitetip shark joins you.",
                "A pigeye shark joins you.",
                "A sandbar shark joins you.",
                "A silky shark joins you.",
                "A silvertip shark joins you.",
                "A sliteye shark joins you.",
                "A speartooth shark joins you.",
                "A spinner shark joins you.",
                "A spot-tail shark joins you.",
                "A mako shark joins you.",
                "A tiger shark joins you.",
                "A tawny shark joins you.",
                "A white shark joins you.",
                "A zebra shark joins you.",
            ],
            multiOutcomes: [
                "A whole bunch of sharks join you.",
                "That's a lot of sharks.",
                "The shark community grows!",
                "More sharks! MORE SHARKS!",
                "Sharks for the masses. Mass sharks.",
                "A shiver of sharks! No, that's a legit name. Look it up.",
                "A school of sharks!",
                "A shoal of sharks!",
                "A frenzy of sharks!",
                "A gam of sharks! Yes, that's correct.",
                "A college of sharks! They're a little smarter than a school.",
            ],
            helpText: "Recruit a shark to help catch more fish.",
        },

        getManta: {
            name: "Hire ray",
            effect: {
                resource: {
                    ray: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 15 }],
            max: "ray",
            prereq: {
                resource: {
                    shark: 10,
                },
            },
            outcomes: [
                "These guys seem to be kicking up a lot of sand!",
                "A spotted eagle ray joins you.",
                "A manta ray joins you.",
                "A stingray joins you.",
                "A clownnose ray joins you.",
                "A bluespotted maskray joins you.",
                "A bluntnose stingray joins you.",
                "A oman masked ray joins you.",
                "A bulls-eye electric ray joins you.",
                "A shorttailed electric ray joins you.",
                "A bentfin devil ray joins you.",
                "A lesser electric ray joins you.",
                "A cortez electric ray joins you.",
                "A feathertail stingray joins you.",
                "A thornback ray joins you.",
                "A giant shovelnose ray joins you.",
                "A pacific cownose ray joins you.",
                "A bluespotted ribbontail ray joins you.",
                "A marbled ribbontail ray joins you.",
                "A blackspotted torpedo ray joins you.",
                "A marbled torpedo ray joins you.",
                "A atlantic torpedo ray joins you.",
                "A panther torpedo ray joins you.",
                "A spotted torpedo ray joins you.",
                "A ocellated torpedo joins you.",
                "A caribbean torpedo joins you.",
                "A striped stingaree joins you.",
                "A sparesly-spotted stingaree joins you.",
                "A kapala stingaree joins you.",
                "A common stingaree joins you.",
                "A eastern fiddler ray joins you.",
                "A bullseye stingray joins you.",
                "A round stingray joins you.",
                "A yellow stingray joins you.",
                "A cortez round stingray joins you.",
                "A porcupine ray joins you.",
                "A sepia stingaree joins you.",
                "A banded stingaree joins you.",
                "A spotted stingaree joins you.",
                "A sea pancake joins you.",
            ],
            multiOutcomes: [
                "A whole bunch of rays join you.",
                "That's a lot of rays.",
                "The ray conspiracy grows!",
                "I can't even deal with all of these rays.",
                "More rays more rays more more more.",
                "A school of rays!",
                "A fever of rays! Yes, seriously. Look it up.",
                "A whole lotta rays!",
                "The sand is just flying everywhere!",
                "So many rays.",
            ],
            helpText: "Hire a ray to help collect fish. They might kick up some sand from the seabed.",
        },

        getEel: {
            name: "Hire eel",
            effect: {
                resource: {
                    eel: 1,
                },
            },
            cost: [{ resource: "fish", costFunction: "linear", priceIncrease: 15 }],
            max: "eel",
            prereq: {
                upgrade: ["seabedGeology"],
            },
            outcomes: [
                "A false moray joins you.",
                "A mud eel joins you.",
                "A spaghetti eel joins you.",
                "A moray eel joins you.",
                "A thin eel joins you.",
                "A worm eel joins you.",
                "A conger joins you.",
                "A longneck eel joins you.",
                "A pike conger joins you.",
                "A duckbill eel joins you.",
                "A snake eel joins you.",
                "A snipe eel joins you.",
                "A sawtooth eel joins you.",
                "A cutthroat eel joins you.",
                "An electric eel joins you.",
                "A bobtail snipe eel joins you.",
                "A silver eel joins you.",
                "A long finned eel joins you.",
                "A short finned eel joins you.",
            ],
            multiOutcomes: [
                "Eels combining elements of the sharks and the eels to create something not quite as good as either.",
                "The seabed sways with the arrival of new eels.",
                "Fish and sand go hand in hand with eels! Well, fin and fin.",
                "Don't mess with the creatures with jaws inside their jaws.",
                "Eel nation arise!",
                "That's a lot of eels.",
                "So there's more eels. Whee.",
                "The eels increase in number.",
                "More eels happened. Yay.",
            ],
            helpText: "Offer a new home and fish supply to an eel. They can round up fish and sand.",
        },

        getChimaera: {
            name: "Procure chimaera",
            effect: {
                resource: {
                    chimaera: 1,
                },
            },
            cost: [{ resource: "jellyfish", costFunction: "linear", priceIncrease: 20 }],
            max: "chimaera",
            prereq: {
                resource: {
                    jellyfish: 20,
                },
                upgrade: ["chimaeraReunification"],
            },
            outcomes: [
                "A ploughnose chimaera joins you.",
                "A cape elephantfish joins you.",
                "An australian ghost shark joins you.",
                "A whitefin chimaera joins you.",
                "A bahamas ghost shark joins you.",
                "A southern chimaera joins you.",
                "A longspine chimaera joins you.",
                "A cape chimaera joins you.",
                "A shortspine chimaera joins you.",
                "A leopard chimaera joins you.",
                "A silver chimaera joins you.",
                "A pale ghost shark joins you.",
                "A spotted ratfish joins you.",
                "A philippine chimaera joins you.",
                "A black ghostshark joins you.",
                "A blackfin ghostshark joins you.",
                "A marbled ghostshark joins you.",
                "A striped rabbitfish joins you.",
                "A large-eyed rabbitfish joins you.",
                "A spookfish joins you.",
                "A dark ghostshark joins you.",
                "A purple chimaera joins you.",
                "A pointy-nosed blue chimaera joins you.",
                "A giant black chimaera joins you.",
                "A smallspine spookfish joins you.",
                "A pacific longnose chimaera joins you.",
                "A dwarf sicklefin chimaera joins you.",
                "A sicklefin chimaera joins you.",
                "A paddle-nose chimaera joins you.",
                "A straightnose rabbitfish joins you.",
            ],
            multiOutcomes: [
                "Many chimaeras come from the deep.",
                "Like ghosts, they come.",
                "The chimaeras avert your gaze, but set to work quickly.",
                "The jellyfish stocks shall climb ever higher!",
                "Well, it saves you the effort of braving the stinging tentacles.",
                "What have they seen, deep in the chasms?",
                "They aren't sharks, but they feel so familiar.",
                "The long-lost kindred return.",
            ],
            helpText: "Convince a chimaera to hunt in the darker depths for us.",
        },

        // SHARK JOBS ////////////////////////////////////////////////////////////////////////////////

        getDiver: {
            name: "Prepare diver shark",
            effect: {
                resource: {
                    diver: 1,
                },
            },
            cost: [
                { resource: "shark", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 30 },
            ],
            max: "diver",
            prereq: {
                resource: {
                    shark: 3,
                },
            },
            outcomes: [
                "Well, better you than me.",
                "Good luck down there!",
                "You're doing good work for us, diver shark.",
                "Fare well on your expeditions, shark!",
            ],
            multiOutcomes: [
                "Follow the crystals!",
                "We will find the secrets of the deep!",
                "Brave the deep!",
                "Find the crystals for science!",
                "Deep, dark, scary waters. Good luck, all of you.",
            ],
            helpText: "Let a shark go deep into the darkness for more crystals and whatever else they may find.",
        },

        getScientist: {
            name: "Train science shark",
            effect: {
                resource: {
                    scientist: 1,
                },
            },
            cost: [
                { resource: "shark", costFunction: "constant", priceIncrease: 1 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 20 },
            ],
            max: "scientist",
            prereq: {
                resource: {
                    crystal: 20,
                    shark: 1,
                },
            },
            outcomes: [
                "Doctor Shark, coming right up!",
                "A scientist shark is revealed!",
                "After many painful years of study, a shark that has developed excellent skills in making excuses-- er, in science!",
                "PhD approved!",
                "Graduation complete!",
                "A new insight drives a new shark to take up the cause of science!",
            ],
            multiOutcomes: [
                "The training program was a success!",
                "Look at all this science!",
                "Building a smarter, better shark!",
                "Beakers! Beakers underwater! It's madness!",
                "Let the science commence!",
                "Underwater clipboards! No I don't know how that works either!",
                "Careful teeth record the discoveries!",
            ],
            helpText: "Train a shark in the fine art of research and the science of, well, science.",
        },

        getNurse: {
            name: "Train nurse shark",
            effect: {
                resource: {
                    nurse: 1,
                },
            },
            cost: [
                { resource: "shark", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 100 },
            ],
            max: "nurse",
            prereq: {
                resource: {
                    shark: 1,
                },
                upgrade: ["biology"],
            },
            outcomes: [
                "A nurse shark is ready!",
                "Shark manufacturer primed.",
                "Nurse shark trained.",
                "Medical exam passed! Nurse shark is go!",
            ],
            multiOutcomes: [
                "More sharks are on the way soon.",
                "Shark swarm begins!",
                "There will be no end to the sharks!",
                "Sharks forever!",
                "The sharks will never end. The sharks are eternal.",
                "More sharks to make more sharks to make more sharks...",
            ],
            helpText: "Remove a shark from fish duty and set them to shark making duty.",
        },

        // RAY JOBS ////////////////////////////////////////////////////////////////////////////////

        getMaker: {
            name: "Instruct a ray maker",
            effect: {
                resource: {
                    maker: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 400 },
            ],
            max: "maker",
            prereq: {
                resource: {
                    ray: 1,
                },
                upgrade: ["rayBiology"],
            },
            outcomes: [
                "The application of kelp supplements has made a ray very productive.",
                "More rays lets you get more rays which you can then use to get more rays.",
                "The ray singularity begins!",
                "A ray maker is ready.",
                "Looks like you gave them quite the ray maker blow! 'Them' being the intangible enemy that is lacking in resources.",
                "The ray seems concerned, but obliges. The mission has been given.",
            ],
            multiOutcomes: [
                "All these makers. What are they making? What is it for? Oh. It's rays, and it's probably for sand or something.",
                "More ray makers means more rays. Do you understand what that means?! Do you?! It means more rays. Good. On the same page, then.",
                "Rapidly breeding aquatic wildlife is probably a severe ecological hazard. Good thing this isn't Earth's oceans, probably!",
                "Have you ever thought about what the rays wanted? Because this might have been what they wanted after all.",
                "MORE LASER RAYS FOR THE LASER ARMY-- oh. Well, this is good too.",
            ],
            helpText: "Remove a ray from sand business and let them concentrate on making more rays.",
        },

        getScholar: {
            name: "Train ray scholar",
            effect: {
                resource: {
                    scholar: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "crystal", costFunction: "linear", priceIncrease: 250 },
            ],
            max: "scholar",
            prereq: {
                upgrade: ["arcaneStudy"],
            },
            outcomes: [
                "Study buddy!",
                "Another scholar receives their doctorate in magical stuff.",
                "The ray receives their degree.",
                "The ray receives a certificate.",
                "Ray, ready to learn!",
                "Congratulations buddy, you've earned the right to speculate about weird fragment thingies!",
            ],
            multiOutcomes: [
                "No, not ray scientists, scholars!",
                "Curious minds begin to tinker and toy with the strange substance that composes arcana.",
                "Just how much is there to learn about this stuff?",
                "They don't do science. They do study.",
                "The other side of the coin of research.",
                "The scientists and the scholars rarely collaborate, so they form their own schools.",
            ],
            helpText: "Train a ray to study the mystical properties of arcana.",
        },

        // EEL JOBS ////////////////////////////////////////////////////////////////////////////////

        getPit: {
            name: "Dig eel pit",
            effect: {
                resource: {
                    pit: 1,
                },
            },
            cost: [
                { resource: "eel", costFunction: "constant", priceIncrease: 3 },
                { resource: "fish", costFunction: "linear", priceIncrease: 50 },
                { resource: "sand", costFunction: "linear", priceIncrease: 20 },
            ],
            max: "pit",
            prereq: {
                resource: {
                    eel: 1,
                },
                upgrade: ["eelHabitats"],
            },
            outcomes: [
                "Why does it take three eels? Oh well. We don't really need to know.",
                "Dig that pit. We can dig it.",
                "Let's get digging.",
                "Oh, hey, this hole's already empty. Well, isn't that something.",
            ],
            multiOutcomes: [
                "Let's get digging.",
                "Eel tide rises.",
                "More eels! They're handy to have.",
                "Many eyes from the caves.",
                "Secret homes!",
                "The eels are content.",
            ],
            helpText: "Find a suitable pit for eels to make more eels.",
        },

        getSifter: {
            name: "Train eel sifter",
            effect: {
                resource: {
                    sifter: 1,
                },
            },
            cost: [
                { resource: "eel", costFunction: "constant", priceIncrease: 1 },
                { resource: "fish", costFunction: "linear", priceIncrease: 1000 },
            ],
            max: "sifter",
            prereq: {
                upgrade: ["arcaneSifting"],
            },
            outcomes: [
                "Eel sifter ready to find things!",
                "Eel ready to sift through the sands!",
                "Time to sift, eel. Time to seek, search and sift.",
                "Time for this little guy to find some goodies.",
            ],
            multiOutcomes: [
                "Time to find the things!",
                "Sift. It's a fun word. Siiiiffft.",
                "Sifters scouring the seabed for some special stuff.",
                "Shifters ready to shift! Wait. No. Hang on.",
                "Sifting the seabed for scores of surprises!",
            ],
            helpText: "Specialise an eel in finding interesting things on the seabed.",
        },

        // CHIMAERA JOBS ////////////////////////////////////////////////////////////////////////////////

        getExplorer: {
            name: "Prepare chimaera explorer",
            effect: {
                resource: {
                    explorer: 1,
                },
            },
            cost: [
                { resource: "chimaera", costFunction: "constant", priceIncrease: 1 },
                { resource: "jellyfish", costFunction: "linear", priceIncrease: 150 },
            ],
            max: "explorer",
            prereq: {
                upgrade: ["abyssalEnigmas"],
            },
            outcomes: [
                "A seeker of mysteries is prepared.",
                "The chimaera explorer is ready for their journey.",
                "Explorer ready for some answers!",
                "The chimaera swims down to the ocean below.",
            ],
            multiOutcomes: [
                "The exploration party is ready.",
                "Learn the secrets of the deeps!",
                "More mysteries to uncover.",
                "Ancient riddles for ancient creatures.",
                "Find the truth beneath the waves!",
            ],
            helpText:
                "Help prepare a chimaera for exploration to parts unknown in search of the mysterious and elusive arcana.",
        },

        // SHARK MACHINES ////////////////////////////////////////////////////////////////////////////////

        getCrystalMiner: {},

        getSandDigger: {},

        getFishMachine: {},
    },
    marine: {
        catchFish: {},

        debugbutton: {},

        getClam: {
            name: "Get clam",
            effect: {
                resource: {
                    get clam() {
                        return SharkGame.Aspects.apotheosis.level > 0 ? SharkGame.Aspects.apotheosis.level * 4 : 1;
                    },
                },
            },
            cost: {},
            prereq: {
                upgrade: ["clamScooping"],
            },
            outcomes: [
                "Got a grooved carpet shell.",
                "Got a hard clam.",
                "Got a manila clam.",
                "Got a soft clam.",
                "Got an atlantic surf clam.",
                "Got an ocean quahog.",
                "Got a pacific razor clam.",
                "Got a pismo clam.",
                "Got a geoduck.",
                "Got an atlantic jackknife clam.",
                "Got a lyrate asiatic hard clam.",
                "Got an ark clam.",
                "Got a nut clam.",
                "Got a duck clam.",
                "Got a marsh clam.",
                "Got a file clam.",
                "Got a giant clam.",
                "Got an asiatic clam.",
                "Got a peppery furrow shell.",
                "Got a pearl oyster.",
            ],
            helpText: "Fetch a clam. Why do we need clams now? Who knows.",
        },

        // CONVERSIONS ////////////////////////////////////////////////////////////////////////////////

        seaApplesToScience: {
            name: "Study sea apples",
            effect: {
                resource: {
                    science: 4,
                },
            },
            cost: [{ resource: "seaApple", costFunction: "constant", priceIncrease: 1 }],
            max: "seaApple",
            prereq: {
                resource: {
                    seaApple: 1,
                },
                upgrade: ["xenobiology"],
            },
            outcomes: [
                "There's science inside these things, surely!",
                "The cause of science is advanced!",
                "This is perhaps maybe insightful!",
                "Why are we even doing this? Who knows! Science!",
                "What is even the point of these things? Why are they named for fruit? They're squirming!",
            ],
            helpText: "Dissect sea apples to gain additional science. Research!",
        },

        pearlConversion: {
            name: "Convert clam pearls",
            effect: {
                resource: {
                    crystal: 1,
                },
            },
            cost: [{ resource: "clam", costFunction: "constant", priceIncrease: 5 }],
            max: "clam",
            prereq: {
                resource: {
                    clam: 1,
                },
                upgrade: ["pearlConversion"],
            },
            outcomes: [
                "Pearls to crystals! One day. One day, we will get this right and only use the pearl.",
                "Welp, we somehow turned rocks to crystals. Oh. Nope, those were clams. Not rocks. It's so hard to tell sometimes.",
                "Okay, we managed to only use the pearls this time, but we, uh, had to break the clams open pretty roughly.",
                "Pearls to... nope. Clams to crystals. Science is hard.",
            ],
            helpText: "Convert a pearl (and the clam around it) into crystal.",
        },

        // MAKE ADVANCED RESOURCES  ///////////////////////////////////////////////////////////////////////////////

        transmuteSharkonium: {
            name: "Transmute stuff to sharkonium",
            effect: {
                resource: {
                    sharkonium: 1,
                },
            },
            cost: [
                {
                    resource: "crystal",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 5 - SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
                {
                    resource: "sand",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 15 - 3 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
            ],
            max: "sharkonium",
            prereq: {
                upgrade: ["transmutation"],
            },
            outcomes: [
                "Transmutation destination!",
                "Transmutation rejuvenation!",
                "Transmogrification revelation!",
                "Transformation libation!",
                "Transfiguration nation! ...wait.",
                "Sharkonium arise!",
                "Arise, sharkonium!",
                "More sharkonium!",
                "The substance that knows no name! Except the name sharkonium!",
                "The substance that knows no description! It's weird to look at.",
                "The foundation of a modern shark frenzy!",
            ],
            helpText: "Convert ordinary resources into sharkonium, building material of the future!",
        },

        fuseCalcinium: {
            name: "Fuse stuff to calcinium",
            effect: {
                resource: {
                    calcinium: 1,
                },
            },
            cost: [
                {
                    resource: "clam",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 15 - 3 * SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
                {
                    resource: "crystal",
                    costFunction: "constant",
                    get priceIncrease() {
                        return 5 - SharkGame.Aspects.syntheticTransmutation.level;
                    },
                },
            ],
            max: "calcinium",
            prereq: {
                upgrade: [""],
            },
            outcomes: [],
            helpText: "Smelt resources into calcinium for use in crustacean machines.",
        },

        // BUY ANIMALS ////////////////////////////////////////////////////////////////////////////////

        getShark: {},

        getManta: {},

        getCrab: {},

        getLobster: {
            name: "Gain lobster",
            effect: {
                resource: {
                    lobster: 1,
                },
            },
            cost: [{ resource: "clam", costFunction: "linear", priceIncrease: 10 }],
            max: "lobster",
            prereq: {
                resource: {
                    clam: 10,
                },
                upgrade: ["clamScooping"],
            },
            outcomes: [
                "A scampi joins you.",
                "A crayfish joins you.",
                "A clawed lobster joins you.",
                "A spiny lobster joins you.",
                "A slipper lobster joins you.",
                "A hummer lobster joins you.",
                "A crawfish joins you.",
                "A rock lobster joins you.",
                "A langouste joins you.",
                "A shovel-nose lobster joins you.",
                "A crawdad joins you.",
            ],
            multiOutcomes: [
                "Lobsters lobsters lobsters lobsters.",
                "But they weren't rocks...",
                "The clam forecast is looking good!",
                "They're all about the clams!",
                "More lobsters, because why not?",
                "HEAVY LOBSTERS",
                "More lobsters for the snipping and the cutting and the clam grab!",
                "Clam patrol, here we go.",
            ],
            helpText: "",
        },

        // SHARK JOBS ////////////////////////////////////////////////////////////////////////////////

        getScientist: {},

        getNurse: {},

        // RAY JOBS ////////////////////////////////////////////////////////////////////////////////

        getMaker: {},

        getExtractor: {
            name: "Assemble extractor ray",
            effect: {
                resource: {
                    extractor: 1,
                },
            },
            cost: [
                { resource: "ray", costFunction: "constant", priceIncrease: 1 },
                { resource: "calcinium", costFunction: "linear", priceIncrease: 15 },
                { resource: "fish", costFunction: "linear", priceIncrease: 500 },
            ],
            max: "extractor",
            prereq: {
                resource: {
                    calcinium: 1,
                },
                upgrade: ["calciniumBiosynergy"],
            },
            outcomes: [],
            multiOutcomes: [],
            helpText: "",
        },

        // CRAB JOBS ////////////////////////////////////////////////////////////////////////////////

        getPlanter: {},

        getBrood: {},

        getSeabedStripper: {
            name: "Build seabed stripper",
            effect: {
                resource: {
                    seabedStripper: 1,
                },
            },
            cost: [
                { resource: "calcinium", costFunction: "linear", priceIncrease: 150 },
                { resource: "crab", costFunction: "constant", priceIncrease: 1 },
            ],
            max: "seabedStripper",
            prereq: {
                resource: {
                    calcinium: 1,
                },
                upgrade: ["crustaceanTransmutation"],
            },
            outcomes: [],
            multiOutcomes: [],
            helpText: "",
        },

        // LOBSTER JOBS ////////////////////////////////////////////////////////////////////////////////

        getBerrier: {
            name: "Form lobster berrier",
            effect: {
                resource: {
                    berrier: 1,
                },
            },
            cost: [
                { resource: "lobster", costFunction: "constant", priceIncrease: 1 },
                { resource: "clam", costFunction: "linear", priceIncrease: 30 },
            ],
            max: "berrier",
            prereq: {
                resource: {
                    lobster: 1,
                },
                upgrade: ["crustaceanBiology"],
            },
            outcomes: [
                "We didn't need to see the process behind this.",
                "One lobster brimming with eggs to go.",
                "It's like some weird counterpart to the planter crab. But with eggs.",
                "Lobster with rocks ready to make a move. Oh, okay, eggs, whatever, see, they look like shiny pebbles from a distance and... oh, forget it.",
            ],
            multiOutcomes: [
                "Berrier isn't even a word!",
                "Berries and eggs aren't even the same thing!",
                "How do these things swim with this much weighing them down?",
                "We aren't running out of volunteers any time soon.",
                "Did you see them fight for this job? Claws everywhere, I tell you!",
            ],
            helpText: "Dedicate a lobster to egg production. We don't know how it works. Ask the lobsters.",
        },

        // SHARK MACHINES ////////////////////////////////////////////////////////////////////////////////

        getCrystalMiner: {},

        getSandDigger: {},

        getFishMachine: {},

        getAutoTransmuter: {},

        // CRUSTACEAN MACHINES /////////////////////////////////////////////////////////

        getCalciniumConverter: {
            name: "Build calcinium converter",
            effect: {
                resource: {
                    calciniumConverter: 1,
                },
            },
            cost: [
                { resource: "calcinium", costFunction: "linear", priceIncrease: 100 },
                { resource: "lobster", costFunction: "constant", priceIncrease: 1 },
            ],
            max: "calciniumConverter",
            prereq: {
                resource: {
                    calcinium: 1,
                },
                upgrade: ["crustaceanTransmutation"],
            },
            outcomes: [
                /*                 "Berry sprayer is active.",
                "Berry sprayer capable.",
                "This egg spraying machine clatters to life.",
                "This automated caretaker gets to work.", */
            ],
            multiOutcomes: [
                /*                 "Automation of population? What a terrifying concept.",
                "The machine rears lobster eggs. Wouldn't the shrimp want something like this too?",
                "There is an uneasiness about these machines that fills the sharks with concern.",
                "Why was this machine invented? Are we helping to prepare an army?", */
            ],
            helpText: "", // This crustacean machine distributes lobster eggs for optimal hatching conditions.
        },
    },
};

SharkGame.HomeActionCategories = {
    all: {
        // This category should be handled specially.
        name: "All",
        actions: [],
    },

    basic: {
        name: "Basic",
        actions: ["catchFish", "debugbutton", "prySponge", "getClam", "getJellyfish"],
    },

    frenzy: {
        name: "Frenzy",
        actions: [
            "getShark",
            "getManta",
            "getCrab",
            "getShrimp",
            "getLobster",
            "getDolphin",
            "getWhale",
            "getEel",
            "getChimaera",
            "getOctopus",
            "getSquid",
            "getUrchin",
        ],
    },

    professions: {
        name: "Jobs",
        actions: [
            "getDiver",
            //"getProspector",
            "getScientist",
            "getLaser",
            //getShoveler",
            "getPlanter",
            "getCollector",
            //"getMiller",
            "getWorker",
            "getHarvester",
            //"getRockLobster",
            "getPhilosopher",
            "getTreasurer",
            "getTechnician",
            "getSifter",
            "getTransmuter",
            "getExplorer",
            "getInvestigator",
            "getScavenger",
            "getHistorian",
            "getExtractionTeam",
            "getScholar",
            "getExtractor",
        ],
    },

    breeders: {
        name: "Producers",
        actions: [
            "getNurse",
            "getMaker",
            //"stoneGetMaker",
            "getBrood",
            "getQueen",
            "getBerrier",
            "getBiologist",
            "getPit",
            "getCollective",
            "getSpawner",
        ],
    },

    processing: {
        name: "Processing",
        actions: [
            "seaApplesToScience",
            //"spongeToScience",
            "jellyfishToScience",
            "pearlConversion",
            "advancedPearlConversion",
            "spongeFiltration",
            "breakDownAncientPart",
            "transmuteSharkonium",
            "smeltCoralglass",
            "fuseDelphinium",
            "forgeSpronge",
            "fuseAncientPart",
            "makeSacrifice",
        ],
    },

    machines: {
        name: "Shark Machines",
        actions: [
            "getCrystalMiner",
            "getSandDigger",
            "getAutoTransmuter",
            "getFishMachine",
            "getSkimmer",
            //"getCrusher",
            //"getPulverizer",
            "getHeater",
        ],
    },

    otherMachines: {
        name: "Other Machines",
        actions: [
            "getSpongeFarmer",
            "getBerrySprayer",
            "getGlassMaker",
            "getTirelessCrafter",
            "getClamCollector",
            "getEggBrooder",
            "getSprongeSmelter",
            //"getCoalescer",
            "getCrimsonCombine",
            "getKelpCultivator",
            "getSeabedStripper",
            "getCalciniumConverter",
        ],
    },

    unique: {
        name: "Unique",
        actions: ["getChorus"],
    },
};
