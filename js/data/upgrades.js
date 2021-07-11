// TODO: separate upgrades?
// NAMES, EFFECTS, DESCRIPTIONS, IF THEY EXIST, COSTS, PREREQUISITES
// names will remain constant
// effects vary with what is or isn't in the world
// this is hard
// i cant tell if i'll need to just make separate, independent lists
// i probably will
// but that's for later

// my end conclusion is that I will certainly be putting upgrades into individual lists,
// separated by world type. therefore every world gets its own upgrade progression individually,
// so I can closely monitor and control the progression in every world, have individual and unique
// descriptions and names and effects, and have the progression of each species vary by world.

// Wouldn't it make more sense to have effects just depend on world type then, instead of making
// three or more near-if-not-comletely-identical entries?
SharkGame.Upgrades = {
    purchased: [],
    /**
     * @type Record<string, Record<string, any>>
     * Generated cache on-demand
     */
    generated: {},

    /** @param worldType {string} */
    getUpgradeTable(worldType = world.worldType) {
        if (typeof SharkGame.Upgrades[worldType] !== "object") {
            // This world type doesn't have any special upgrades, so use the default ones.
            // We don't want to generate the same upgrade table multiple times for no reason.
            worldType = "default";
        }
        if (!_.has(SharkGame.Upgrades.generated, worldType)) {
            return (SharkGame.Upgrades.generated[worldType] = SharkGame.Upgrades.generateUpgradeTable(worldType));
        }
        return SharkGame.Upgrades.generated[worldType];
    },

    /**
     * Retrieves, modifies, and returns the data for an upgrade. Implemented to intercept retreival of upgrade data to handle special logic where alternatives are inconvenient or impossible.
     * @param {object} table The table to retrieve the upgrade data from
     * @param {string} upgradeName The name of the upgrade
     */
    getUpgradeData(table, upgradeName) {
        // probably find a way to forego the clonedeep here, but the performance impact seems negligible.
        const data = _.cloneDeep(table[upgradeName]);

        // apply effect of internal calculator aspect if indeed applicable
        // would use getters but there would be too many getters to be reasonable
        if (data.cost && data.cost.science && data.cost.science <= 150) {
            switch (SharkGame.Aspects.internalCalculator.level) {
                case 1:
                    data.cost.science *= 0.5;
                    break;
                case 2:
                    $.each(data.cost, (resource) => {
                        data.cost[resource] *= 0.5;
                    });
            }
        }

        return data;
    },

    /** @param worldType {string} */
    generateUpgradeTable(worldType = world.worldType) {
        let finalTable = {};
        const defaultUpgrades = SharkGame.Upgrades.default;
        if (_.has(SharkGame.Upgrades, worldType)) {
            const worldUpgrades = SharkGame.Upgrades[worldType];
            _.each(Object.getOwnPropertyNames(worldUpgrades), (upgradeName) => {
                if (defaultUpgrades[upgradeName]) {
                    finalTable[upgradeName] = {};
                    const names = Object.getOwnPropertyNames(worldUpgrades[upgradeName]);
                    _.each(names, (theName) => {
                        const descriptor = Object.getOwnPropertyDescriptor(worldUpgrades[upgradeName], theName);
                        Object.defineProperty(finalTable[upgradeName], theName, descriptor);
                    });
                    const defaultNames = Object.getOwnPropertyNames(defaultUpgrades[upgradeName]);
                    _.each(defaultNames, (theName) => {
                        if (!finalTable[upgradeName][theName]) {
                            const descriptor = Object.getOwnPropertyDescriptor(defaultUpgrades[upgradeName], theName);
                            Object.defineProperty(finalTable[upgradeName], theName, descriptor);
                        }
                    });
                } else {
                    finalTable[upgradeName] = worldUpgrades[upgradeName];
                }
            });
        } else {
            finalTable = defaultUpgrades;
        }
        return finalTable;
    },
    default: {
        crystalBite: {
            name: "水晶咬器",
            desc: "咬我們的水晶，讓它變成有助於我們咬東西的工具！",
            researchedMessage: "開發出奇怪的牙齒服，使鯊魚更好地抓魚。",
            effectDesc: "鯊魚帶着牠們的新咬器，生產力翻倍。原來穿在嘴巴外面，效果更好！",
            cost: {
                science: 50,
                fish: 10,
                crystal: 5,
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                },
            },
        },
        crystalSpade: {
            name: "水晶鏟子",
            desc: "給魟魚製作奇怪的繫帶工具。",
            researchedMessage: "魟魚現在能更有效率地挖更多的沙！",
            effectDesc: "魟魚用牠們專門製作的挖掘工具，生產力翻倍。",
            cost: {
                science: 50,
                sand: 20,
                crystal: 5,
            },
            effect: {
                incomeMultiplier: {
                    ray: 2,
                },
            },
        },
        crystalContainer: {
            name: "水晶容器",
            desc: "用我們的水晶做奇怪的瓶子。可能有用？？",
            researchedMessage: "原來不只是水可以裝進這些容器。科學變得更容易了！",
            effectDesc: "科學家處理科學的效率翻倍。",
            cost: {
                science: 100,
                crystal: 50,
            },
            effect: {
                incomeMultiplier: {
                    scientist: 2,
                },
            },
        },
        statsDiscovery: {
            name: "倉儲洞穴",
            desc: "是時候將我們的存儲移到一個更好的地方。我們找到了一個，但是它需要一些改善。",
            researchedMessage:
                "我們得到的所有物資現在儲存並列出在一個基本上被淹沒的洞穴系統裡。我們整齊了！大致上！",
            effectDesc: "我們將東西儲存在一個集中位置裡，現在對我們在做什麼有頭緒了……大致上。",
            cost: {
                science: 150,
            },
            required: {
                upgrades: ["crystalContainer"],
            },
        },
        underwaterChemistry: {
            name: "水下化學",
            desc: "通過這些奇怪的瓶子，我們現在可以將東西和其他東西放進去，看看會發生什麼。",
            researchedMessage: "那麼，我們沒發現到任何有用的東西，但是如果我們一直做下去，我們在科學方面會有重大的成就！",
            effectDesc: "科學家們得到了新的化學見解，效率翻倍。",
            cost: {
                science: 200,
                crystal: 50,
            },
            required: {
                upgrades: ["crystalContainer"],
            },
            effect: {
                incomeMultiplier: {
                    scientist: 2,
                },
            },
        },
        seabedGeology: {
            name: "海床地質學",
            desc: "考察海底，看出它包含着什麼豐富的，深層的，甜蜜的祕密。",
            researchedMessage: "我們不僅找到了一堆奇怪的東西，而且魟魚發現有更多的沙子！",
            effectDesc: "魟魚對海床和各種不同的沉澱物的理解使牠們的效率加強多一倍。",
            cost: {
                science: 250,
                sand: 250,
            },
            required: {
                upgrades: ["crystalContainer"],
            },
            effect: {
                incomeMultiplier: {
                    ray: 2,
                },
            },
        },
        thermalVents: {
            name: "散熱通風口",
            desc: "調查一直加熱東西的滾燙的通風口。",
            researchedMessage: "這是一個絕妙且無窮的熱源！我們一定要充分利用它。",
            effectDesc: "一個用於未來科技的能源被發現了。",
            cost: {
                science: 300,
                sand: 500,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
        },
        laserRays: {
            name: "激光線",
            desc: "使用玄妙的鯊魚神祕科學，用魟魚提取通風口的熱作為科技使用。",
            researchedMessage: "魟魚現在可以被給予裝備，使牠們將沙子融合成水晶！未來啊！",
            effectDesc: "激光魟魚現在可以被裝備，使其將沙子燃燒成晶瑩剔透的水晶。",
            cost: {
                science: 100,
                sand: 2000,
                crystal: 100,
            },
            required: {
                upgrades: ["thermalVents"],
            },
        },
        transmutation: {
            name: "轉變",
            desc: "通過加熱東西並對它們做科學的東西，我們也許能製造新的東西！",
            researchedMessage: "一個新的材料已被發現！它以其發現者Sharkonium博士的名字命名。",
            effectDesc: "允許將一些廢料轉變成鯊魚素，未來的材料。",
            cost: {
                science: 1000,
                crystal: 2000,
                sand: 4000,
            },
            required: {
                upgrades: ["thermalVents", "underwaterChemistry"],
            },
        },
        automation: {
            name: "Automation",
            desc: "Using sharkonium, we can make things to do things so we don't have to do the things!",
            researchedMessage: "Now we don't have to do all the work, machines can do it for us! Future!!",
            effectDesc: "Machines can be built to supplement population duties. This is efficient.",
            cost: {
                science: 1500,
                sharkonium: 250,
            },
            required: {
                upgrades: ["transmutation"],
            },
        },
        engineering: {
            name: "Engineering",
            desc: "The machines sort of suck. Let's make them better by learning how!",
            researchedMessage: "The machines are twice as good now! We've figured out new designs in the process, too!",
            effectDesc: "Machines are twice as effective. Skimmers and auto-transmuters are now possible to create.",
            cost: {
                science: 2500,
                sharkonium: 1750,
            },
            required: {
                upgrades: ["automation"],
                seen: ["fishMachine", "crystalMiner", "sandDigger"],
            },
            effect: {
                incomeMultiplier: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                },
            },
        },
        recyclerDiscovery: {
            name: "Recycler",
            desc: "Devise a system of pulverising unwanted resources into a component paste, and reusing them as something else.",
            researchedMessage:
                "Well this thing is frankly terrifying. I wouldn't swim anywhere near the input holes if I were you. Maybe it'll help though!",
            effectDesc: "Allows recycling of materials by virtue of a horrifying mechanical maw that consumes all that ventures near it. Future?",
            cost: {
                science: 5000,
                sharkonium: 5000,
            },
            required: {
                upgrades: ["engineering"],
            },
        },
        iterativeDesign: {
            name: "Iterative Design",
            desc: "The machines are useful, but they could be better. Maybe it's time we started over?",
            researchedMessage: "As it turns out, science is about learning from mistakes, or so the scientists say. About their own mistakes.",
            effectDesc: "All shark machines run twice as fast. Again!",
            cost: {
                science: 15000,
                sharkonium: 17500,
            },
            required: {
                upgrades: ["engineering"],
            },
            effect: {
                incomeMultiplier: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                    autoTransmuter: 2,
                    skimmer: 2,
                    heater: 2,
                    scientist: 4,
                },
            },
        },
        superprocessing: {
            name: "Superprocessing",
            desc:
                "The recycler wasn't really meant for millions of fish at once. Seeing as that transaction is fairly common, we should probably do something about it.",
            researchedMessage: "Eureka! If we make the big things bigger, and the grinders grindier, we can process way more material at once!",
            effectDesc:
                "The recycler's efficiency only starts dropping at 10 million material inserted at once, instead of 100 thousand. The base efficiency is now 100%.",
            cost: {
                science: 1e6,
                sharkonium: 1e6,
                junk: 1e6,
            },
            required: {
                upgrades: ["iterativeDesign", "recyclerDiscovery"],
            },
        },
        agriculture: {
            name: "Agriculture",
            desc: "The hunter-gatherer lifestyle will only work so well for us. Maybe we should gather these animals in one place and let them grow.",
            researchedMessage: "It is so much easier to get things when they're all in one place. It's like the ocean is our grotto now!",
            effectDesc: "Various roles are twice as effective thanks to farming regions for coral and sponge.",
            cost: {
                science: 500,
                sand: 1000,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
        },
        kelpHorticulture: {
            name: "Kelp Horticulture",
            desc: "Determine what it takes to plant kelp all over the seabed. Maybe this is useful.",
            researchedMessage: "Crab-specific gear has been invented to allow for kelp farming! This is possibly useful.",
            effectDesc: "Crabs can become kelp farmers and grow a living carpet across the bottom of the sea.",
            cost: {
                science: 1000,
                sand: 2000,
            },
            required: {
                upgrades: ["agriculture"],
                resources: ["kelp"],
            },
        },
        biology: {
            name: "Biology",
            desc: "What is a shark? What is inside a shark, except for large amounts of fish?",
            researchedMessage: "With a new understanding of their own biology, sharks can now specialise in the manufacture of new sharks.",
            effectDesc: "Sharks are twice as effective. Did you know shark eggs don't actually form just because a shark wills them to exist?",
            cost: {
                science: 400,
            },
            required: {
                upgrades: ["underwaterChemistry", "agriculture"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                },
            },
        },
        xenobiology: {
            name: "異源生物學",
            desc: "判定出這些奇怪的無臉生物到底是什麼。",
            researchedMessage: "無定論！需要進一步的研究！可能對科學有重大的好處！",
            effectDesc:
                "海帶生產海蘋果的速度加快一倍。還有，海蘋果不是水果。我們也可以以科學的名義解剖海蘋果和水母。",
            cost: {
                science: 600,
            },
            required: {
                upgrades: ["agriculture"],
                resources: ["seaApple", "jellyfish"],
                seen: ["seaApple", "jellyfish"],
            },
            effect: {
                incomeMultiplier: {
                    kelp: 2,
                },
            },
        },
        rayBiology: {
            name: "魟魚生物學",
            desc: "雖然魟魚是鯊魚的血肉，但是我們對牠們一知半解。但願可以解決這個問題。我們需要在沙陷阱上放餌。",
            researchedMessage:
                "原來我們可以直接問。我們知道了魟魚是如何創造更多魟魚的。跟鯊魚相似的，只不過是魟魚而已。",
            effectDesc:
                "魟魚和激光魟魚加強多一倍。經過這場尷尬的事情後，我們可能再也不會將鯊魟關係回復如初。",
            cost: {
                science: 700,
                sand: 600,
            },
            required: {
                upgrades: ["biology", "laserRays"],
                seen: ["kelp"],
            },
            effect: {
                incomeMultiplier: {
                    ray: 2,
                    laser: 2,
                },
            },
        },
        crabBiology: {
            name: "螃蟹生物學",
            desc: "螃蟹是一個謎團。牠們保護自己，挖掘水晶或是種下植物。牠們背後到底有什麼？螃蟹究竟是什麼？？",
            researchedMessage:
                "原來螃蟹是友善的甲殼動物，向鯊魚透露了螃蟹生產的祕密。它涉及蛋，還是什麼。軟軟的蛋。",
            effectDesc:
                "螃蟹和種植螃蟹分別強四倍和兩倍。螃蟹還行，但是牠們也有點恐怖奇怪。很好的是牠們站在我們這一方面！",
            cost: {
                science: 500,
                kelp: 100,
            },
            required: {
                upgrades: ["biology", "sunObservation"],
                resources: ["crab"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 4,
                    planter: 2,
                },
            },
        },
        sunObservation: {
            name: "Sun Observation",
            desc: "We must determine what is with the weird glare on the surface of the water.",
            researchedMessage: "Shark science has discovered the sun! It has also discovered that looking directly into the sun hurts.",
            effectDesc:
                "Planter crabs are twice as effective. Is a suns worth many fish? We can see a sun, but where is it really? And what is it made of?",
            cost: {
                science: 5000,
            },
            required: {
                upgrades: ["agriculture"],
            },
            effect: {
                incomeMultiplier: {
                    planter: 2,
                },
            },
        },
        exploration: {
            name: "Exploration",
            desc: "Swim beyond the home seas to see what can be found!",
            researchedMessage: "Found lots of schools of fish! So many different schools! And such untapped sand reserves!",
            effectDesc: "Sharks and rays are twice as effective. Did you know oceans are big? Fascinating!",
            cost: {
                science: 5000,
                fish: 5000,
            },
            required: {
                upgrades: ["sunObservation"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                    ray: 2,
                },
            },
        },
        farExploration: {
            name: "征遠",
            desc: "探索海洋家之外的廣闊的空間。",
            researchedMessage: "尋找了一些水晶豐富的礦層，還有一些奇怪的萬丈深淵。",
            effectDesc: "螃蟹強四倍。你知道嗎，海洋其實比大還要大？妙啊！",
            cost: {
                science: 8000,
                fish: 15000,
            },
            required: {
                upgrades: ["exploration"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 4,
                },
            },
        },
        gateDiscovery: {
            name: "Chasm Exploration",
            desc: "A campaign of risky, foolhardy expeditions to the deeps, to find whatever can be found.",
            researchedMessage: "A strange structure was found from clues within the chasms. The cost was great, but the discovery is greater!",
            effectDesc: "Something ancient lurked in the depths.",
            cost: {
                science: 1e6,
                shark: 1000,
                fish: 50000,
            },
            required: {
                upgrades: ["farExploration"],
            },
        },
    },
    abandoned: {
        // Unless upgrade is defined here, it won't exist on the world
        // hence the empty objects
        crystalBite: {},
        crystalSpade: {},
        crystalContainer: {},
        statsDiscovery: { cost: { science: 75 } },
        underwaterChemistry: {},
        seabedGeology: {},
        thermalVents: {},
        clamScooping: {
            name: "Clam Scooping",
            desc: "We see these things all over the seabed but we can't tell which are clams and which are rocks.",
            researchedMessage:
                "Patient observation has shown that clams and rocks are in fact different and distinct things. Now we won't be scooping up any more rocks!",
            effectDesc: "Clams can be collected like fish.",
            cost: {
                science: 150,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
        },
        laserRays: {},
        transmutation: {
            cost: {
                science: 1500,
                crystal: 1750,
            },
        },
        spongeCollection: {
            name: "Sponge Collection",
            desc: "We can see these things littering the reefs and beds, but only the octopuses know how to collect them without breaking them.",
            researchedMessage:
                "Understanding the fragile nature of sponges and their weird porous texture, we can now collect sponges by not biting so hard.",
            effectDesc: "Sponge can be collected in the same way fish can be.",
            cost: {
                science: 888,
            },
            required: {
                upgrades: ["octopusMethodology"],
            },
        },
        industrialGradeSponge: {
            name: "Industrial-Grade Sponge",
            desc: "Our octopus contacts inform us that sponge is highly useful with a little augmentation. Let's figure this out.",
            researchedMessage:
                "By infusing sponge with processed matter, we have devised spronge, a versatile super-material that kind of freaks us out!",
            effectDesc: "Enables creation of spronge, the backbone... uh... the core material in cephalopod technology.",
            cost: {
                science: 1500,
                sponge: 800,
                junk: 4000,
            },
            required: {
                upgrades: ["recyclerDiscovery", "spongeCollection"],
                seen: ["sponge"],
            },
        },
        automation: { cost: { science: 1750 } },
        environmentalism: {
            name: "Environmentalism",
            desc: "The machines produce what now?! Quick, we need a solution - sponges filter stuff, right?!",
            researchedMessage: "With the right kind of stretching and squishing, we can turn sponges into weird little filter things!",
            effectDesc: "Sponges can be turned into filters to stop the tar from killing us all. Yay!",
            cost: {
                science: 250,
                sponge: 15,
            },
            required: {
                upgrades: ["spongeCollection", "automation"],
            },
        },
        engineering: {
            effectDesc: "Shark machines are twice as effective.",
            effect: {
                incomeBoost: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                },
            },
        },
        recyclerDiscovery: {
            effectDesc:
                "Allows recycling of materials by virtue of a horrifying mechanical maw that consumes all that ventures near it. Future? Also, skimmers are now possible to create.",
            cost: {
                science: 4000,
                sharkonium: 2000,
            },
            required: {
                upgrades: ["automation"],
            },
        },
        iterativeDesign: {
            cost: {
                science: 75000,
                sharkonium: 17500,
            },
            effect: {
                incomeBoost: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                    skimmer: 2,
                },
                incomeMultiplier: {
                    scientist: 4,
                },
            },
        },
        sprongeBiomimicry: {
            name: "Spronge Biomimicry",
            desc: "The cephalopod school of thought is that a machine that mimics life is a better machine. We don't understand this so well yet.",
            researchedMessage:
                "For machines that mimic life, these things sure put out a lot of pollution. It's sort of alarming. Very alarming, even.",
            effectDesc:
                "We can mimic some of the life-mimicking biotechnology the octopuses use, but it gums up the oceans so quickly. So very dangerous.",
            cost: {
                science: 4000,
                spronge: 200,
            },
            required: {
                upgrades: ["automation", "industrialGradeSponge"],
                resources: ["sponge", "junk"],
                seen: ["spronge"],
            },
        },
        agriculture: {
            researchedMessage:
                "While the tar makes it difficult to pull off, it is so much easier to get things when they're all in one place. It's like the ocean is our grotto now!",
            effectDesc: "Crabs can now specialize in collecting sponge.",
            cost: {
                science: 1500,
                sand: 500,
                sponge: 10,
            },
            required: {
                upgrades: ["seabedGeology", "spongeCollection"],
                seen: ["sponge"],
            },
        },
        biology: {
            cost: {
                science: 1600,
            },
        },
        rayBiology: {
            cost: {
                science: 1800,
                sand: 1600,
            },
            required: {
                upgrades: ["biology", "laserRays"],
            },
        },
        crabBiology: {
            desc: "Crabs are a mystery. They keep to themselves and dig up crystals or pick up sponge. What is even up with that? What ARE crabs??",
            cost: {
                science: 2500,
                fish: 2500,
            },
            required: {
                upgrades: ["biology"],
                resources: ["crab"],
                seen: ["collector"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 4,
                    collector: 4,
                },
            },
        },
        octopusMethodology: {
            name: "Octopus Methodology",
            desc: "The octopuses claim they know ways to improve their routines and machines.",
            researchedMessage: "We have no idea what thought processes guide these cephalopod allies of ours, but they know how to get results.",
            effectDesc: "Octopuses can specialise in different tasks, and octopuses work more efficiently.",
            cost: {
                science: 888,
                clam: 888,
            },
            required: {
                upgrades: ["clamScooping"],
                resources: ["octopus"],
                seen: ["octopus"],
            },
            effect: {
                incomeMultiplier: {
                    octopus: 2,
                },
            },
        },
        octalEfficiency: {
            name: "Octal Efficiency",
            desc: "The octopuses wish to further enhance their productivity for collective gain.",
            researchedMessage:
                "The instructions constructed and disseminated by the octopuses are complex and only understood to other octopuses. Head hurts. Something about the number eight.",
            effectDesc: "Octopuses, their specialists, and their machines are twice as effective. Find unity in efficiency.",
            cost: {
                science: 8888,
                clam: 88888,
            },
            required: {
                upgrades: ["sprongeBiomimicry"],
                seen: ["clamCollector", "sprongeSmelter", "eggBrooder"],
            },
            effect: {
                incomeMultiplier: {
                    octopus: 2,
                    investigator: 2,
                },
                incomeBoost: {
                    clamCollector: 2,
                    eggBrooder: 2,
                    sprongeSmelter: 2,
                },
            },
        },
        sunObservation: {
            desc: "It's hard to see, but there's a weird glare on the surface of the water, and we need to figure out what it means.",
            effectDesc:
                "Octopus investigators, science sharks, and collector crabs are twice as effective. Is a suns worth many fish? We can see a sun, but where is it really? And what is it made of?",
            cost: {
                science: 17500,
            },
            effect: {
                incomeMultiplier: {
                    scientist: 2,
                    investigator: 2,
                    collector: 2,
                },
            },
        },
        exploration: {
            desc: "Venture into open waters to see what can be found!",
            researchedMessage: "Fish, sand, and crystals can be found! Even further out, though, there's something else.",
            effectDesc: "Sharks, rays, crabs, and crab collectors are more effective...and something was spotted in the distance.",
            cost: {
                science: 25000,
                fish: 30000,
            },
            required: {
                upgrades: ["sunObservation"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 4,
                    collector: 2,
                },
            },
        },
        farAbandonedExploration: {
            name: "Far Exploration",
            desc: "In the distance lies a bunch of weird structures that sharks have dared not enter...so what happens if we do?",
            researchedMessage:
                "As it turns out, discoveries happen! There are no signs of life, but we found lots of weird machines and a strange gate.",
            effectDesc:
                "Explored the city in the distance and discovered a gate and some weird machines. Octopuses can now specialize in scavenging around the city.",
            cost: {
                science: 50000,
                fish: 75000,
            },
            required: {
                upgrades: ["exploration"],
            },
        },
        superiorSearchAlgorithms: {
            name: "Superior Search Algorithms",
            desc: "Why is finding stuff so hard?!?!",
            researchedMessage:
                "As our octopus bretheren explain, it was hard because we kept telling them to go in circles. They used the word 'inept'.",
            effectDesc:
                "The octopuses have taken control of both scavenging operations and are refusing to listen to our directions. Still, scavengers are 8 times faster and collectors are 4 times faster.",
            cost: {
                science: 88888,
                ancientPart: 88,
            },
            required: {
                upgrades: ["farAbandonedExploration", "octalEfficiency"],
                seen: ["ancientPart"],
            },
            effect: {
                incomeMultiplier: {
                    scavenger: 8,
                    collector: 4,
                },
            },
        },
        reverseEngineering: {
            name: "Reverse Engineering",
            desc: "What is up with these parts? Why are they shaped like that?!",
            researchedMessage: "Results inconclusive. Further analysis pending.",
            effectDesc:
                "Ancient parts can be sacrificed for science. Scientists and scavengers are twice as effective, and investigators are 4 times as effective.",
            cost: {
                science: 125000,
                ancientPart: 250,
            },
            required: {
                upgrades: ["farAbandonedExploration", "engineering"],
                seen: ["ancientPart"],
            },
            effect: {
                incomeMultiplier: {
                    scientist: 2,
                    investigator: 4,
                },
            },
        },
        highEnergyFusion: {
            name: "High-Energy Fusion",
            desc: "These old parts must have some kind of use! Question is, can we figure it out???",
            researchedMessage: "The secret of high-energy fusion has been unlocked. Scavenge no more. We will do it ourselves.",
            effectDesc:
                "Laser rays can fuse sand to crystal at an absurd rate. We have figured out how to create more ancient parts by fusing clams and crystals.",
            cost: {
                science: 2500000,
                ancientPart: 1750,
            },
            required: {
                upgrades: ["reverseEngineering", "iterativeDesign", "laserRays"],
            },
            effect: {
                incomeBoost: {
                    laser: 128,
                },
            },
        },
        artifactAssembly: {
            name: "Artifact Assembly",
            desc: "Assemble the pieces. Create the tool. Open the gate.",
            researchedMessage: "It is done.",
            effectDesc: "The artifact is assembled. The gate can be opened.",
            cost: {
                ancientPart: 250000,
            },
            required: {
                upgrades: ["highEnergyFusion"],
            },
        },
        eightfoldOptimisation: {
            name: "Eightfold Optimisation",
            desc: "Enhance productivity. Optimise. Improve. Improve.",
            researchedMessage: "Peak productivity attained. Maintain course. Maintain efficiency.",
            effectDesc: "Octopuses and their roles, as well as their machines, are all eight times as effective. Optimised.",
            cost: {
                science: 8e7,
            },
            required: {
                upgrades: ["reverseEngineering", "octalEfficiency"],
                resources: ["octopus"],
            },
            effect: {
                incomeMultiplier: {
                    octopus: 8,
                    investigator: 8,
                    scavenger: 8,
                },
                incomeBoost: {
                    clamCollector: 8,
                    eggBrooder: 8,
                    sprongeSmelter: 8,
                },
            },
        },
        mechanisedAlchemy: {
            name: "Mechanised Alchemy",
            desc: "Better engineering and transmutation processes lead to a refinement of our machines.",
            researchedMessage: "We are blurring the line between science and magic more than ever before!",
            effectDesc: "Shark machines are all four times as effective, as are filters. We work better with the machines, not against them.",
            cost: {
                science: 4e7,
            },
            required: {
                upgrades: ["reverseEngineering", "iterativeDesign"],
                resources: ["sharkonium"],
            },
            effect: {
                incomeMultiplier: {
                    filter: 8,
                },
                incomeBoost: {
                    fishMachine: 4,
                    crystalMiner: 4,
                    sandDigger: 4,
                    skimmer: 4,
                },
            },
        },
    },
    haven: {
        crystalBite: {},
        crystalSpade: {},
        cetaceanAwareness: {
            name: "Cetacean Awareness",
            desc: "From a distance, it's hard to tell which of us are really sharks or... those other things. We need to figure this out.",
            researchedMessage:
                "Right, so, dolphins have a horizontal tail and sharks have a vertical tail. Also, they have warm blood and bigger brains. Jerks.",
            effectDesc: "Dolphins can now be recruited. We're happy about this why, exactly??",
            cost: {
                science: 75,
                coral: 100,
            },
            required: {
                totals: {
                    coral: 75,
                },
            },
        },
        crystalContainer: {},
        statsDiscovery: {},
        underwaterChemistry: {},
        seabedGeology: {},
        transmutation: {
            desc:
                "The properties of delphinium make it totally usuable for the applications we have in mind. Maybe if we try some different ingredients, we can make a new kind of material?",
            cost: {
                science: 150000,
                crystal: 75000,
                sand: 4000000,
            },
            required: {
                upgrades: ["dolphinTechnology"],
                seen: ["crimsonCombine", "kelpCultivator", "tirelessCrafter"],
            },
        },
        aquamarineFusion: {
            name: "Aquamarine Fusion",
            desc:
                "The kelp papyrus things have instructions on how to make some gross thing called delphinium, so now we feel obligated to make it. Are we sure we want to do this?",
            researchedMessage:
                "Using the knowledge gained from the kelp slab things, we've figured out how to make delphinium and now we feel gross.",
            effectDesc: "Enables transmutation of a bunch of junk into delphinium.",
            cost: {
                science: 75000,
                coral: 75000,
                crystal: 50000,
            },
            required: {
                upgrades: ["delphineHistory"],
            },
        },
        automation: {
            name: "Automation",
            desc: "Using sharkonium, we can make new things to do things so we don't have to do the things!",
            cost: {
                science: 150000,
                sharkonium: 17500,
            },
        },
        engineering: {
            effectDesc: "Shark machines are twice as effective. Auto-transmuters are now possible to create.",
            cost: {
                science: 625000,
                sharkonium: 60000,
            },
        },
        recyclerDiscovery: {
            cost: {
                science: 750000,
                sharkonium: 75000,
            },
        },
        iterativeDesign: {
            cost: {
                science: 3750000,
                sharkonium: 100000,
            },
            effect: {
                incomeMultiplier: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                    autoTransmuter: 2,
                    scientist: 4,
                },
            },
        },
        dolphinTechnology: {
            name: "Dolphin Technology",
            desc: "Regardless of the uselessness of the material, the machines might be good. Probably not, though. Probably.",
            researchedMessage:
                "Dolphin technology is pretty ornate. We spent more time figuring out what parts of the machines were actually necessary than we spent actually building them.",
            effectDesc: "We've figured out some dolphin machinery. As expected, it's not the best - but it'll have to do.",
            cost: {
                science: 75000,
                delphinium: 4750,
            },
            required: {
                upgrades: ["aquamarineFusion"],
                seen: ["delphinium"],
            },
        },
        agriculture: {
            effectDesc: "Discovered agricultural methods. We'll see if this bears fruit.",
            cost: {
                science: 300,
                sand: 1000,
            },
            effect: {
                incomeMultiplier: {
                    dolphin: 2,
                },
            },
        },
        kelpHorticulture: {
            cost: {
                science: 250,
                sand: 2500,
            },
        },
        biology: {
            cost: {
                science: 1500,
            },
        },
        xenobiology: {
            effectDesc:
                "We know how to harvest sea apples twice as quickly, and we can dissect sea apples for science. Also, sea apple isn't a fruit.",
            cost: {
                seaApple: 3,
            },
            required: {
                upgrades: ["kelpHorticulture"],
                seen: ["seaApple"],
            },
        },
        rayBiology: {
            effectDesc:
                "Rays are four times as effective. We may never repair the shark-ray relations to their former state after how awkward this whole affair was.",
            cost: {
                science: 1750,
                sand: 5000,
            },
            required: {
                upgrades: ["biology"],
            },
            effect: {
                incomeMultiplier: {
                    ray: 4,
                },
            },
        },
        crabBiology: {
            name: "Crab Biology",
            desc: "Crabs are a mystery. They keep to themselves and dig up crystals or put down plants. What is even up with that? What ARE crabs??",
            cost: {
                science: 2500,
                kelp: 100,
            },
            required: {
                upgrades: ["biology", "kelpHorticulture"],
                resources: ["crab"],
            },
        },
        coralCollection: {
            name: "Coral Collection",
            desc: "The dolphins keep talking about coral and crystals and pretty artwork. All the time. What??? Why do you care??",
            researchedMessage: "So it's a cultural thing. Fine, collect your coral. See if I care.",
            effectDesc: "Dolphins can now specialize in becoming treasurers.",
            cost: {
                science: 500,
                coral: 150,
            },
            required: {
                upgrades: ["seabedGeology"],
                seen: ["dolphin"],
                totals: {
                    coral: 750,
                },
            },
        },
        dolphinBiology: {
            name: "Dolphin Biology",
            desc: "Do we really have to learn about this? We do? Alright, then.",
            researchedMessage:
                "We managed to offend the dolphins with our questions so much they decided to form their own biological research team.",
            effectDesc:
                "All dolphins are four times as effective but four times a small number is still small. Also now they can make more dolphins. <em>Hooray.</em>",
            cost: {
                science: 1500,
                coral: 1000,
            },
            required: {
                upgrades: ["biology", "coralCollection"],
                seen: ["treasurer"],
            },
            effect: {
                incomeMultiplier: {
                    dolphin: 4,
                    treasurer: 2,
                },
            },
        },
        delphineHistory: {
            name: "Delphine History",
            desc: "We keep finding all these flat pieces of kelp washing up in the current. What is with them? Why are they crunchy?!",
            researchedMessage: "A dolphin overheard us talking about it, and they came over and 'read' something from it. What?!",
            effectDesc: "Discovered the remnants of dolphin civilization in the form of kelp...papyrus. Okay then??",
            cost: {
                science: 25000,
            },
            required: {
                upgrades: ["sunObservation"],
                seen: ["treasurer"],
            },
            effect: {
                incomeMultiplier: {
                    dolphin: 2,
                    biologist: 2,
                    treasurer: 2,
                },
            },
        },
        imperialDesigns: {
            name: "Imperial Designs",
            desc:
                "Finally, with all the materials in one place, we can stop relying on shoddy copies and use the original designs for the dolphin machines.",
            researchedMessage:
                "We found the originals, but they suck! These designs will never work! Look, let's show them-- oh. Oh, apparently they do. Huh.",
            effectDesc:
                "Kelp cultivators and crimson combines are 8 times faster, and tireless crafters are twice as efficient. We begrudingly admit their quality is not entirely terrible.",
            cost: {
                science: 25000000,
                delphinium: 250000,
            },
            required: {
                upgrades: ["retroactiveRecordkeeping", "dolphinTechnology"],
                seen: ["crimsonCombine", "kelpCultivator", "tirelessCrafter"],
            },
            effect: {
                incomeMultiplier: {
                    crimsonCombine: 8,
                    kelpCultivator: 8,
                },
                incomeBoost: {
                    tirelessCrafter: 4,
                },
            },
        },
        retroactiveRecordkeeping: {
            name: "Retroactive Recordkeeping",
            desc: "We've been sitting on a massive stockpile of these kelp papyrus...things. Maybe we should actually try organizing them.",
            researchedMessage: "The dolphins were the first to volunteer with helping to organize this stuff. I GUESS we could give them a chance.",
            effectDesc: "Can now assign dolphins as historians who will help catalogue all of the information we have on these kelp things.",
            cost: {
                science: 2000000,
            },
            required: {
                totals: {
                    science: 950000,
                },
            },
            effect: {
                incomeMultiplier: {
                    scientist: 4,
                },
            },
        },
        sunObservation: {
            effectDesc:
                "Planter crabs are four times as effective. Is a suns worth many fish? We can see a sun, but where is it really? And what is it made of?",
            cost: {
                science: 4500,
            },
            required: {
                upgrades: ["kelpHorticulture"],
            },
            effect: {
                incomeMultiplier: {
                    planter: 4,
                },
            },
        },
        exploration: {
            cost: {
                science: 30000,
                fish: 50000,
            },
        },
        /* Equivalent of farExploration.. named differently for unlocks or smth I think? */
        farHavenExploration: {
            name: "Far Exploration",
            desc: "Explore the vast reaches beyond the home ocean, and look for that portal that keeps popping up in dolphin texts.",
            researchedMessage: "Crystal-rich deposits were found, as well as what appears to be the portal of dolphin legend.",
            effectDesc: "Crabs are four times as effective. Did you know oceans are actually even bigger than big? Remarkable!",
            cost: {
                science: 225000,
                fish: 1500000,
            },
            required: {
                upgrades: ["exploration", "delphineHistory"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 4,
                },
            },
        },
        whaleCommunication: {
            name: "Whale Communication",
            desc: "We can hear faint cries in the distance. What is out there?",
            researchedMessage:
                "Okay, 'whales' are out there. They're similar to dolphins, except less rude, and really big. Oh, and, they collect tons of fish.",
            effectDesc: "Whales can now be recruited.",
            cost: {
                fish: 7500000,
            },
            required: {
                upgrades: ["exploration"],
            },
        },
        whaleSong: {
            name: "The Whale Song",
            desc:
                "The whales claim to know segments of some form of ancient ethereal music that connects worlds. We can collect what they know to piece it together ourselves.",
            researchedMessage: "What we've put together is definitely a song...but something's missing. This can't be the whole thing.",
            effectDesc:
                "The whales have worked with us to put together pieces of an ancient song. We don't think it's everything, though. Whales are 4 times as effective.",
            cost: {
                fish: 750000000,
            },
            required: {
                upgrades: ["whaleCommunication"],
                seen: ["whale"],
            },
            effect: {
                incomeMultiplier: {
                    whale: 4,
                },
            },
        },
        eternalSong: {
            name: "The Eternal Song",
            desc: "The song of the whales is mentioned in dolphin texts dating back as far as we can find. I think we're onto something.",
            researchedMessage:
                "The song of the whales was only ever half of the composition. The dolphins were the key to completing it. Now we have the pieces.",
            effectDesc: "A chorus of whales and dolphins can be assembled to sing the eternal song, but we have no clue what it will do.",
            cost: {
                science: 250000000,
            },
            required: {
                upgrades: ["whaleSong", "retroactiveRecordkeeping", "farHavenExploration"],
            },
            effect: {
                incomeMultiplier: {
                    whale: 16,
                    dolphin: 16,
                    treasurer: 16,
                    biologist: 4,
                },
            },
        },
        crystallineConstruction: {
            name: "Crystalline Construction",
            desc: "The dolphins are a bunch of jerks, but maybe we can still learn from one another. Maybe.",
            researchedMessage:
                "By integrating the genius of shark design with only the good parts of dolphin design, we've managed to create a superior set of machines. Maybe we work better together than we do apart.",
            effectDesc:
                "All shark machines run eight times as fast. Holy moley! Also, shark science is way more informative now that we have more perspective.",
            cost: {
                science: 100000000,
                sharkonium: 250000,
                delphinium: 250000,
            },
            required: {
                upgrades: ["iterativeDesign"],
            },
            effect: {
                incomeMultiplier: {
                    crystalMiner: 8,
                    fishMachine: 8,
                    sandDigger: 8,
                    scientist: 16,
                },
            },
        },
    },
    frigid: {
        crystalBite: {
            cost: {
                science: 25,
                fish: 100,
            },
            required: {
                upgrades: ["civilContact"],
            },
        },
        urchinAttraction: {
            name: "Urchin Attraction",
            desc: "We can see these little spiny balls moving around on the ocean floor. What are they? Why are they everywhere?!",
            researchedMessage: "We have made two miraculous discoveries: they're sentient (barely), and they are painful to touch.",
            effectDesc:
                "We've managed to attract the attention of one of the sea urchins, and it's bringing stuff to us. I think it likes us?? Maybe???",
            cost: {
                science: 25,
            },
            required: {
                upgrades: ["civilContact"],
            },
            events: ["frigidAddUrchin"],
        },
        crystalContainer: {
            cost: {
                science: 50,
                crystal: 25,
            },
            required: {
                upgrades: ["civilContact"],
            },
        },
        statsDiscovery: {
            cost: {
                science: 50,
            },
        },
        underwaterChemistry: {
            cost: {
                science: 100,
                crystal: 25,
            },
        },
        seabedGeology: {
            researchedMessage: "Not only did we find a whole bunch of weird things, we found that there was more sand!",
            effectDesc:
                "Urchins gather sand twice as fast. Not that they understand how to do it faster, but that we've shown them better techniques to mimic.",
            cost: {
                science: 150,
                sand: 100,
            },
            required: {
                upgrades: ["urchinAttraction", "crystalContainer"],
            },
            effect: {
                sandMultiplier: {
                    urchin: 2,
                },
            },
        },
        civilContact: {
            name: "Civil Contact",
            desc: "We see a number of strange structures through the gap in the ice. What are we looking at, exactly?",
            researchedMessage: "We visited the structures, and it turns out it's an entire civilization!",
            effectDesc: "Found the squids. They can be enlisted to help catch fish. Also moved to a less frozen place.",
            cost: {
                science: 25,
            },
        },
        teamSpirit: {
            name: "Team Spirit",
            desc: "The squid seem adamant on showing us the way of teamwork, or something.",
            researchedMessage:
                "The squid said something about being efficient and cooperative and blah blah blah. It's a little pretentious, but I GUESS they have a point.",
            effectDesc: "Sharks, crabs, urchins, extraction teams, scientists, and squid production times 2.",
            cost: {
                science: 2500,
            },
            required: {
                upgrades: ["crabBiology", "squidBiology"],
                seen: ["extractionTeam"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                    crab: 2,
                    squid: 2,
                    urchin: 2,
                    scientist: 2,
                    extractionTeam: 2,
                },
            },
        },
        agriculture: {
            name: "Agriculture",
            desc: "The hunter-gatherer lifestyle seems like the only option, but maybe we could learn something more sustainable?",
            researchedMessage:
                "It sorta worked. We've had to plant kelp all over the place, since the urchins just tear through it if it's all together.",
            effectDesc: "Urchins gather kelp twice as fast. Just kelp.",
            cost: {
                science: 350,
                sand: 400,
            },
            required: {
                upgrades: ["seabedGeology"],
            },
            effect: {
                kelpMultiplier: {
                    urchin: 2,
                },
            },
        },
        assistedExtraction: {
            name: "Assisted Extraction",
            desc: "Crabs take forever to get crystals. The squid insist that working together will help. I guess it's better than nothing.",
            researchedMessage:
                "A crab can reach places a squid cannot, and a squid can help a crab get around faster. The squid were right, this is great!",
            effectDesc: "We may now organize crabs and squid into teams of 2 to expedite crystal extraction.",
            cost: {
                science: 500,
                kelp: 250,
            },
            required: {
                upgrades: ["agriculture"],
            },
        },
        biology: {
            cost: {
                science: 1000,
            },
            required: {
                upgrades: ["underwaterChemistry", "agriculture"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                },
            },
        },
        squidBiology: {
            name: "Squid Biology",
            desc: "Discover the secrets of squid reproduction.",
            researchedMessage: "",
            effectDesc: "Squid can now be assigned to breed in a collective.",
            cost: {
                science: 1250,
            },
            required: {
                upgrades: ["biology"],
            },
            effect: {
                incomeMultiplier: {
                    squid: 2,
                },
            },
        },
        crabBiology: {
            cost: {
                science: 1750,
                kelp: 2500,
            },
            required: {
                upgrades: ["biology", "sunObservation"],
            },
            effect: {
                incomeMultiplier: {
                    crab: 2,
                },
            },
        },
        urchinBiology: {
            name: "Urchin Biology",
            desc: "Discover how these little things get so numerous.",
            researchedMessage: "Indirectly, as it turns out. Ew.",
            effectDesc: "Urchins can now be assigned to go make more urchins.",
            cost: {
                science: 1250,
                kelp: 750,
            },
            required: {
                upgrades: ["biology"],
            },
            effect: {
                incomeMultiplier: {
                    urchin: 2,
                },
            },
        },
        sunObservation: {
            name: "Sun Observation",
            desc: "We must determine what is with the weird glare on the surface of the water.",
            researchedMessage: "Shark science has discovered the sun! It has also discovered that looking directly into the sun hurts.",
            effectDesc: "Is a suns worth many fish? We can see a sun, but where is it really? And what is it made of?",
            cost: {
                science: 1250,
            },
            required: {
                upgrades: ["agriculture"],
            },
            effect: {
                kelpMultiplier: {
                    urchin: 2,
                },
            },
        },
        exploration: {
            name: "Exploration",
            desc: "Swim beyond the home seas to see what can be found!",
            researchedMessage: "Found lots of fish, but also a giant wall of cracked ice. It's like a bubble around us as far as we can see!",
            effectDesc: "Sharks are twice as effective, squids are 4 times as effective. Did you know oceans are big? Fascinating!",
            cost: {
                science: 4500,
                fish: 25000,
            },
            required: {
                upgrades: ["sunObservation"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 2,
                    squid: 2,
                },
            },
        },
        glacialNavigation: {
            name: "Glacial Navigation",
            desc: "Explore the icebergs that lie beyond the warmth. Maybe we can learn something useful?",
            researchedMessage:
                "Exploring the icebergs yielded...more icebergs. It's a cold world out there, but there are untapped crystal reserves at the border.",
            effectDesc: "Extraction teams are twice as effective thanks to newly-discovered crystal deposits.",
            cost: {
                science: 6000,
                fish: 80000,
            },
            required: {
                upgrades: ["exploration"],
            },
            effect: {
                incomeMultiplier: {
                    extractionTeam: 4,
                },
            },
        },
        transmutation: {
            name: "Transmutation",
            desc: "By heating things up and doing science things to them, maybe new things can be made!",
            researchedMessage: "A new form of material has been discovered! It has been named after its discoverer, Dr. Sharkonium.",
            effectDesc: "Enables transmutation of some random junk we have lying around into sharkonium, material of the future.",
            cost: {
                science: 2750,
                crystal: 1000,
                sand: 10000,
            },
            required: {
                upgrades: ["underwaterChemistry", "seabedGeology"],
            },
        },
        automation: {
            name: "Automation",
            desc: "Using sharkonium, we can make things to do things so we don't have to do the things!",
            researchedMessage: "Now we don't have to do all the work, machines can do it for us! Future!!",
            effectDesc: "Machines can be built to supplement population duties. This is efficient.",
            cost: {
                science: 7500,
                sharkonium: 4000,
            },
            required: {
                upgrades: ["transmutation"],
            },
        },
        internalInvestigation: {
            name: "Internal Investigation",
            desc: "There's something up with that big machine. Why is it there? What does it do? Why is there a gate attached to it?",
            researchedMessage:
                "When we went to tamper with the machine, we found a secret hatch. It leads to a massive underground complex beneath the village!",
            effectDesc: "We accidentally discovered the underground complex. The squid do not seem to know we have stumbled upon it.",
            cost: {
                science: 32500,
            },
            required: {
                upgrades: ["automation"],
                seen: ["fishMachine", "crystalMiner", "sandDigger"],
            },
        },
        artificialHeating: {
            name: "Artificial Heating",
            desc: "Okay, seriously, I'm getting real sick of being cold all the time! How do we heat stuff up?",
            researchedMessage: "With machines, of course! And copious amounts of kelp for power. Don't ask.",
            effectDesc: "Developed artificial heating machines to battle the ice.",
            cost: {
                science: 25000,
                kelp: 250000,
            },
            required: {
                upgrades: ["automation"],
                seen: ["fishMachine", "crystalMiner", "sandDigger"],
            },
        },
        engineering: {
            name: "Engineering",
            desc: "The machines sort of suck. Let's make them better by learning how!",
            researchedMessage: "The machines are twice as good now! We've figured out new designs in the process, too!",
            effectDesc: "Machines are twice as effective. Auto-transmuters are now possible to create.",
            cost: {
                science: 40000,
                sharkonium: 10000,
            },
            required: {
                upgrades: ["automation"],
            },
            effect: {
                incomeMultiplier: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                },
                heaterMultiplier: {
                    heater: 2,
                },
            },
        },
        recyclerDiscovery: {
            name: "Recycler",
            desc: "Devise a system of pulverising unwanted resources into a component paste, and reusing them as something else.",
            researchedMessage:
                "Well this thing is frankly terrifying. I wouldn't swim anywhere near the input holes if I were you. Maybe it'll help though!",
            effectDesc: "Allows recycling of materials by virtue of a horrifying mechanical maw that consumes all that ventures near it. Future?",
            cost: {
                science: 150000,
                sharkonium: 40000,
            },
            required: {
                upgrades: ["engineering"],
            },
        },
        iterativeDesign: {
            name: "Iterative Design",
            desc: "The machines are useful, but they could be better. Maybe it's time we started over?",
            researchedMessage: "As it turns out, science is about learning from mistakes, or so the scientists say. About their own mistakes.",
            effectDesc: "All shark machines run twice as fast. Again!",
            cost: {
                science: 250000,
                sharkonium: 75000,
            },
            required: {
                upgrades: ["engineering"],
            },
            effect: {
                incomeMultiplier: {
                    crystalMiner: 2,
                    fishMachine: 2,
                    sandDigger: 2,
                    autoTransmuter: 2,
                    scientist: 4,
                },
                heaterMultiplier: {
                    heater: 2,
                },
            },
        },
        superprocessing: {
            name: "Superprocessing",
            desc:
                "The recycler wasn't really meant for millions of fish at once. Seeing as that transaction is fairly common, we should probably do something about it.",
            researchedMessage: "Eureka! If we make the big things bigger, and the grinders grindier, we can process way more material at once!",
            effectDesc:
                "The recycler's efficiency only starts dropping at 10 million material inserted at once, instead of 100 thousand. The base efficiency is now 100%.",
            cost: {
                science: 3e6,
                sharkonium: 250000,
                junk: 1e6,
            },
            required: {
                upgrades: ["iterativeDesign", "recyclerDiscovery"],
            },
        },
        creatureCoalition: {
            name: "Creature Coalition",
            desc: "Everyone feels it; the cold eats at us all. The squid are right, we have to cooperate to make progress.",
            researchedMessage: "",
            effectDesc: "",
            cost: {
                science: 1000000,
            },
            required: {
                upgrades: ["internalInquiry"],
            },
            effect: {
                incomeMultiplier: {
                    shark: 8,
                    crab: 8,
                    urchin: 4,
                    squid: 4,
                    scientist: 4,
                    extractionTeam: 4,
                },
            },
        },
        internalExpedition: {
            name: "Internal Expedition",
            desc: "We have the resources to launch a secret expedition into the machine. Its secrets must be known.",
            researchedMessage: "The expedition went well, but on the way out, a squid noticed us leaving the machine. I guess the jig is up.",
            effectDesc: "Discovered little more than endless hallways of unrecognizable text and rooms filled with incomprehensible control schemes.",
            cost: {
                science: 75000,
            },
            effect: {
                incomeMultiplier: {
                    scientist: 2,
                },
            },
            required: {
                upgrades: ["internalInvestigation"],
            },
        },
        internalInquiry: {
            name: "Internal Inquiry",
            desc: "We haven't spoken to the squid about what happened. Maybe we should say something.",
            researchedMessage:
                "They're not mad, just disappointed. They had hoped we would work together with them - they don't understand the controls either, as it turns out.",
            effectDesc: "Reconciled with the squids. They told us what they know about the machine's inner workings.",
            cost: {
                science: 200000,
            },
            effect: {
                incomeMultiplier: {
                    squid: 2,
                    extractionTeam: 4,
                    collective: 2,
                },
            },
            required: {
                upgrades: ["internalExpedition", "engineering"],
            },
        },
        rapidRecharging: {
            name: "Rapid Recharging",
            desc: "Replace the battery. Melt the ice. Open the gate.",
            researchedMessage:
                "A wave of heat washes over you as the switch is flipped. The ice around the village quickly vaporizes, and like magic, a giant bubble is carved in the surrounding glaciers.",
            effectDesc: "Battery has been replaced. All the nearby ice has melted and we can now begin using the gate.",
            cost: {
                science: 2500000,
                sharkonium: 250000,
            },
            required: {
                upgrades: ["internalInquiry", "iterativeDesign"],
            },
        },
    },
};
