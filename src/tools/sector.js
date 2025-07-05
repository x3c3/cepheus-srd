/**
 * Generates a Cepheus Engine subsector, quadrant or sector.
 *
 * @param {number} [target=4] - A dice target number for a world to be present. Defaults to 4 if not provided.
 * @param {number} [subsectors=1] - How many subsectors to generate. Defaults to 1 if not provided.
 * @returns {string} The complete generated sector in SEC format (see https://travellermap.com/doc/fileformats#sec).
 */
function generateSector(target = 4, subsectors = 1) {
    let width = 8;
    let height = 10;
    const wGen = worldGenerator();
    const sectorName = "Unnamed"; // placeholder
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
    for (let i = 1; i <= width * Math.sqrt(subsectors); ++i) {
        for (let j = 1; j <= height * Math.sqrt(subsectors); ++j) {
            if (roll(1) >= target) {
                let w = wGen.next().value;
                r += `${w.name.padEnd(13, " ")} ${i.toString().padStart(2, 0) + j.toString().padStart(2, 0)} ${w.uwp} ${w.bases} ${w.remarks.padEnd(16, " ")} ${w.travelZone}  ${w.pbg} ${w.allegiance} ${w.stellarData}\n`;
            }
        }
    }
    return r;
}

// Calculates the population of a sector given SEC data input
function calculatePopulation(sectorData) {
    if (sectorData === undefined) {
        console.error("Error! No SEC data provided.");
        return;
    }
    let total = 0;
    let lines = sectorData.split("\n");
    lines.forEach(line => {
        const uwp = line.match(/[ABCDEX][0-9A-Z]{6}-[0-9A-Z]/);
        const pbg = line.match(/\s\s(\d[0-9A-F][0-9A-F])\s/);
        if (uwp && pbg)
            total += pseudoHex(pbg[1][0]) * Math.pow(10, pseudoHex(uwp[0][4]));
    });
    return `Subsector Population: ${total.toLocaleString("en")}`;
}

/**
 * Gets a subsector, quadrant or sector map image from the TravellerMap API.
 *
 * @param {number} subsectors - Specify how many subsectors to generate. Expects 1 (subsector), 4 (quadrant) or 16 (sector).
 * @param {string} sectorData - Sector data in SEC format.
 * @returns {string} HTML code pointing to the map image.
 */
async function getSectorMap(subsectors, sectorData) {
    subsectors = parseInt(subsectors);
    if (isNaN(subsectors) || ![1, 4, 16].includes(subsectors)) {
        console.error("Error! Invalid number of subsectors provided.");
        return;
    }
    let apiUrl = "https://travellermap.com/api/poster?style=print";
    switch (subsectors) {
        case 1:
            apiUrl += "&subsector=A";
            break;
        case 4:
            apiUrl += "&quadrant=Alpha";
            break;
    }
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
                "Accept": "image/png"
            },
            body: sectorData
        });
        if (!response.ok)
            throw new Error("Error! Could not retrieve sector image: " + response.statusText);
        const blob = await response.blob();
        if (!blob)
            throw new Error("Error! Got no sector image.");
        img = URL.createObjectURL(blob);
        return `<a href="${img}" target="_blank"><img src="${img}"></a>`;
    } catch (error) {
        return null;
    }
}
