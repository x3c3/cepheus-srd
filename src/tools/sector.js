/**
 * Generates a Cepheus Engine subsector, quadrant or sector.
 *
 * @param {number} [target=4] - A dice target number for a world to be present. Defaults to 4 if not provided.
 * @param {number} [subsectors=1] - How many subsectors to generate. Defaults to 1 if not provided.
 * @returns {string} The complete generated sector in SEC format (see https://travellermap.com/doc/fileformats#sec).
 */
function generateSector(target = 4, subsectors = 1) {
    if (subsectors != 1)
        subsectors == 1; // TODO: this is a temporary guard - the world generator exhausts its names too quickly
    let width = 8;
    let height = 10;
    let wGen = worldGenerator();
    let sectorName = "Unnamed"; // placeholder
    let r = sectorName + " Sector \n" +
        " 1-13: Name\n" +
        "15-18: HexNbr\n" +
        "20-28: UWP\n" +
        "   31: Bases\n" +
        "33-47: Codes & Comments\n" +
        "   49: Zone\n" +
        "52-54: PBG\n" +
        "56-57: Allegiance\n" +
        "59-74: Stellar Data\n\n" +
        "....+....1....+....2....+....3....+....4....+....5....+....6....+....7....+....8\n\n";
    for (let i = 1; i <= width * subsectors; ++i) {
        for (let j = 1; j <= height * subsectors; ++j) {
            if (roll(1) >= target) {
                let w = wGen.next().value;
                r += `${w.name.padEnd(13, " ")} ${i.toString().padStart(2, 0) + j.toString().padStart(2, 0)} ${w.uwp} ${w.bases} ${w.remarks.padEnd(16, " ")} ${w.travelZone}  ${w.pbg} ${w.allegiance} ${w.stellarData}\n`;
            }
        }
    }
    return r;
}

// Calculates the population of a sector given SEC data input
function calculatePopulation(sec) {
    if (sec === undefined)
        console.error("Error! No SEC data provided.");
    let total = 0;
    let lines = sec.split("\n");
    lines.forEach(line => {
        let uwp = line.match(/[ABCDEX][0-9A-Z]{6}-[0-9A-Z]/);
        let pbg = line.match(/\s\s(\d[0-9A-F][0-9A-F])\s/);
        if (uwp && pbg)
            total += pseudoHex(pbg[1][0]) * Math.pow(10, pseudoHex(uwp[0][4]));
    });
    return `Subsector Population: ${total.toLocaleString('en')}`;
}
