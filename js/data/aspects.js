"use strict";
/**
 * @type {Record<string, {
 *     requiredBy: string[] | undefined
 *     eventSprite: boolean // Whether to use the event spritesheet
 *     icon: string
 *     posX: number
 *     posY: number
 *     width: number
 *     height: number
 *     level: number
 *     prerequisites: string[]
 *     getCost(level: number): number
 *     getEffect(level: number): string
 *     getUnlocked(): string // tells you if miscellaneous requirements have been met. if they have, returns nothing. if they have not, returns a message stating why not.
 *     clicked(): void
 *     apply(time: string): void
 * }>
 */
// idea: aspect which helps to reveal more of the tree
SharkGame.Aspects = {
    apotheosis: {
        posX: 380,
        posY: 550,
        width: 40,
        height: 40,

        max: 4,
        level: 0,
        name: "Apotheosis",
        description: "The path begins here.",
        getCost(level) {
            return (level + 1) ** 2;
        },
        getEffect(level) {
            return "Manual resource collection x" + (level > 0 ? level * 4 : 1) + ".";
        },
        getUnlocked() {},
        prerequisites: [],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    pathOfIndustry: {
        posX: 690,
        posY: 350,
        width: 40,
        height: 40,

        max: 5,
        level: 0,
        name: "Path of Industry",
        description: "Unlock the potential of those around you.",
        getCost(level) {
            return level * 2 + 2;
        },
        getEffect(level) {
            return (
                res.getResourceName("shark", false, 69) +
                " collect " +
                res.getResourceName("fish") +
                " " +
                (level > 0 ? level + 1 : 1) +
                " times faster."
            );
        },
        getUnlocked() {},
        prerequisites: ["apotheosis"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
        apply(when) {
            if (when === "init") {
                res.applyModifier("pathOfIndustry", "shark", this.level);
            }
        },
    },
    pathOfEnlightenment: {
        posX: 380,
        posY: 350,
        width: 40,
        height: 40,

        max: 4,
        level: 0,
        name: "Path of Enlightenment",
        description: "Unlock the potential of yourself.",
        getCost(level) {
            return (level + 1) ** 2 + 1;
        },
        getEffect(level) {
            switch (level) {
                case 1:
                    return "Reveals information about a world before you choose to visit it.";
                case 2:
                    return "Reveals information about a world and the resources and animals it has before you choose to visit it.";
                case 3:
                    return "Reveals information about a world, its resources, and its animals, and grants additional insight before you choose to visit it.";
            }
        },
        getUnlocked() {},
        prerequisites: ["apotheosis"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    patience: {
        posX: 300,
        posY: 250,
        width: 40,
        height: 40,

        max: 3,
        level: 0,
        name: "Patience",
        description: "They say that good things come to those who wait.",
        getCost(level) {
            return (level + 2) ** 2;
        },
        getEffect(level) {
            return "Gain nothing now. After beating 3 more worlds, gain " + 2 * (level + 1) ** 2 + " essence.";
        },
        getUnlocked() {
            return "Not useful as of now, locked until next update.";
        },
        prerequisites: ["pathOfEnlightenment"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    pathOfTime: {
        posX: 70,
        posY: 350,
        width: 40,
        height: 40,

        max: 5,
        level: 0,
        name: "Path of Time",
        description: "Begin each journey with swiftness.",
        getCost(level) {
            return (level + 1) ** 2 + 1;
        },
        getEffect(level) {
            return "Start with " + 20 * level ** 2 + " crabs (if possible).";
        },
        getUnlocked() {},
        prerequisites: ["apotheosis"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
        apply(when) {
            if (when === "init") {
                SharkGame.Resources.changeResource("crab", 10 * SharkGame.Aspects.pathOfTime.level ** 3);
            }
        },
    },
    adjustedAquadynamics: {
        posX: 610,
        posY: 250,
        width: 40,
        height: 40,

        max: 4,
        level: 0,
        name: "Adjusted Aquadynamics",
        description: "A thin layer of essence greatly reduces drag, improving hunting profiency.",
        getCost(level) {
            return 2 * level + 1;
        },
        getEffect(level) {
            return (
                res.getResourceName("ray", false, 69) + " hunt " + res.getResourceName("fish", false, 69) + " " + 2 ** (level - 1) * 2.5 + "x faster."
            );
        },
        getUnlocked() {},
        prerequisites: ["pathOfIndustry"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
        apply(when) {
            if (when === "init") {
                res.applyModifier("adjustedAquadynamics", "ray", this.level);
            }
        },
    },
    clawSharpening: {
        posX: 690,
        posY: 150,
        width: 40,
        height: 40,

        max: 4,
        level: 0,
        name: "Claw Sharpening",
        get description() {
            return "Perhaps " + res.getResourceName("crab", false, 69) + " could collect more than crystal if they were better equipped for hunting.";
        },
        getCost(level) {
            return 2 * level + 2;
        },
        getEffect(level) {
            return (
                res.getResourceName("crab", false, 69) + " hunt " + res.getResourceName("fish", false, 69) + " at " + 0.01 * 2 ** (level - 1) + "/s."
            );
        },
        getUnlocked() {},
        prerequisites: ["adjustedAquadynamics"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
        apply(when) {
            if (when === "init") {
                res.applyModifier("clawSharpening", "crab", this.level);
            }
        },
    },
    crustaceanAptitute: {
        posX: 690,
        posY: 50,
        width: 40,
        height: 40,

        max: 4,
        level: 0,
        name: "Crustacean Aptitude",
        get description() {
            return "Perhaps " + res.getResourceName("crab", false, 69) + " could collect more than crystal if they were better equipped for hunting.";
        },
        getCost(level) {
            return 2 * level + 4;
        },
        getEffect(level) {
            return res.getResourceName("crab", false, 69) + " and their professions collect world-specific resources " + level + 1 + "x faster.";
        },
        getUnlocked() {},
        prerequisites: ["adjustedAquadynamics"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
        apply(when) {
            if (when === "init") {
                res.applyModifier("crustaceanAptitute", "crab", this.level);
            }
        },
    },
    constructedConception: {
        posX: 530,
        posY: 150,
        width: 40,
        height: 40,

        max: 4,
        level: 0,
        name: "Constructed Conception",
        description: "Making new sharks and crabs could be more efficient. It doesn't hurt to use a little essence to help out.",
        getCost(level) {
            return 2 * level + 3;
        },
        getEffect(level) {
            return res.getResourceName("nurse", false, 69) + " and " + res.getResourceName("maker", false, 69) + " are " + 2 * level + "x faster.";
        },
        getUnlocked() {},
        prerequisites: ["adjustedAquadynamics"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
        apply(when) {
            if (when === "init") {
                res.applyModifier("adjustedAquadynamics", "ray", this.level);
            }
        },
    },
    destinyGamble: {
        posX: 460,
        posY: 250,
        width: 40,
        height: 40,

        max: 5,
        level: 0,
        name: "Destiny Gamble",
        description: "Where we end up is all luck, but sometimes, we can stack the deck.",
        getCost(level) {
            switch (level) {
                case 0:
                    return 1;
                default:
                    return 3 * level;
            }
        },
        getEffect(level) {
            return "Between worlds, have the opportunity to reroll your world selection up to " + level + " time" + (level > 0 ? "s" : "") + ".";
        },
        getUnlocked() {
            return "Not useful as of now, locked until next update.";
        },
        prerequisites: ["pathOfEnlightenment"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    syntheticTransmutation: {
        posX: 770,
        posY: 250,
        width: 40,
        height: 40,

        max: 4,
        level: 0,
        name: "Synthetic Transmutation",
        description: "Sharkonium is naturally unaffected by small impurities. Perhaps we can cheat a little.",
        getCost(level) {
            return 2 * level + 4;
        },
        getEffect(level) {
            return "Sharkonium is " + 20 * level + "% cheaper to produce.";
        },
        getUnlocked() {},
        prerequisites: ["pathOfIndustry"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    crystallineSkin: {
        posX: 0,
        posY: 150,
        width: 40,
        height: 40,

        max: 3,
        level: 0,
        name: "Crystalline Skin",
        description: "Become one with the lattice.",
        getCost(level) {
            return 2 * level + 3;
        },
        getEffect(level) {
            return "Start with " + 20 * level ** 2 + " crystals. If they do not exist, start with an equivalent.";
        },
        getUnlocked() {},
        prerequisites: ["theMinuteHand"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    keenEyesight: {
        posX: 0,
        posY: 50,
        width: 40,
        height: 40,

        max: 10,
        level: 0,
        name: "Keen Eyesight",
        description: "Learn to stop overlooking the small stuff.",
        getCost(level) {
            return 3 * level + 5;
        },
        getEffect(level) {
            return (
                "Unlocks a button to manually gather " +
                res.getResourceName("crystal", false, 420) +
                ". " +
                0.01 * level * SharkGame.Aspects.apotheosis.level +
                " " +
                res.getResourceName("crystal", false, 420) +
                " per click."
            );
        },
        getUnlocked() {
            //return SharkGame.Gateway.completedWorlds.includes("tempestuous") ? "" : "Complete the Tempestuous worldtype to unlock this aspect.";
        },
        prerequisites: ["crystallineSkin"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    theMinuteHand: {
        posX: 0,
        posY: 250,
        width: 40,
        height: 40,

        max: 5,
        level: 0,
        name: "The Minute Hand",
        description: "Time is relative.",
        getCost(level) {
            return 1 * level + 3;
        },
        getEffect(level) {
            return "For the first minute after arriving in a world, gain x" + 10 * level + " production.";
        },
        getUnlocked() {},
        prerequisites: ["pathOfTime"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    internalCalculator: {
        posX: 140,
        posY: 250,
        width: 40,
        height: 40,

        max: 2,
        level: 0,
        name: "Internal Calculator",
        description: "Shark science gets started a lot faster when we don't need to use an abacus. Also, what's a calculator?",
        getCost(level) {
            return 3 + 2 * level;
        },
        getEffect(level) {
            if (level === 1) {
                return "If a research costs 150 science or less, then its science cost is halved.";
            } else {
                return "If a research costs 150 science or less, then all its costs are halved.";
            }
        },
        getUnlocked() {
            return SharkGame.Gateway.completedWorlds.includes("abandoned") ? "" : "Complete the Abandoned worldtype to unlock this aspect.";
        },
        prerequisites: ["pathOfTime"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    extensiveOrganization: {
        posX: 140,
        posY: 150,
        width: 40,
        height: 40,

        max: 2,
        level: 0,
        name: "Extensive Organization",
        description: "Be prepared. Organize. No wasted time.",
        getCost(level) {
            return 2 + level;
        },
        getEffect(level) {
            if (level === 1) {
                return "Start with the grotto already unlcoked.";
            } else {
                return "Start with the grotto and the laboratory already unlocked.";
            }
        },
        getUnlocked() {
            //return SharkGame.Gateway.completedWorlds.includes("tempestuous") ? "" : "Complete the Tempestuous worldtype to unlock this aspect.";
        },
        prerequisites: ["internalCalculator"],
        clicked(_event) {
            tree.increaseLevel(this);
        },
    },
    // remember to add upgrade which adds manual crystal button, locked behind shrouded worldtype

    //        name: "The Plan",
    //description: "Professionals have standards. Have a plan to recruit everyone you meet.",
    //
};
