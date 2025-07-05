# Cepheus Engine Subsector Generator

This tool will generate a Cepheus Engine subsector according to the rules found in [Chapter 12: Worlds](../book3/worlds.html). The output is in [SEC format](https://travellermap.com/doc/fileformats#legacy-sec-format) and can be copy/pasted into the [Traveller Map custom data tools](https://travellermap.com/doc/custom).

<div>
    <center>
        Map type:
        <input type="radio" id="mapSubsector" name="mapType" value="1" checked onclick="init()">
        <label for="mapSubsector">Subsector</label>
        <input type="radio" id="mapQuadrant" name="mapType" value="4" onclick="init()">
        <label for="mapQuadrant">Quadrant</label>
        <input type="radio" id="mapSector" name="mapType" value="16" onclick="init()">
        <label for="mapSector">Sector</label>
    </center>
</div>

<div>
    <center>
        Sector type:
        <input type="radio" id="sectorStandard" name="sectorType" value="4" checked onclick="init()">
        <label for="sectorStandard">Standard</label>
        <input type="radio" id="sectorRift" name="sectorType" value="6" onclick="init()">
        <label for="sectorRift">Rift</label>
        <input type="radio" id="sectorSparse" name="sectorType" value="5" onclick="init()">
        <label for="sectorSparse">Sparse</label>
        <input type="radio" id="sectorDense" name="sectorType" value="3" onclick="init()">
        <label for="sectorDense">Dense</label>
    </center>
</div>

<!-- <pre id="output" style="border: 1px solid"></pre> -->
<textarea id="output" rows="12" style="min-width: 100%; max-width: 100%"></textarea>
<div>
    <span id="sectorPopulation"></span>
    <button id="mapButton" style="float: right" onclick="generateMap()">Generate Map</button>
</div>

<div id="sectorMap" style="display:flex; justify-content: center"></div>

<script src="pseudohex.js"></script>
<script src="roll.js"></script>
<script src="sector.js"></script>
<script src="world.js"></script>
<script>
    async function generateMap() {
        const mapType = document.querySelector('input[name="mapType"]:checked').value;
        document.getElementById("mapButton").disabled = true;
        const mapImage = await getSectorMap(mapType, document.getElementById("output").value);
        document.getElementById("sectorMap").innerHTML = mapImage;
    }
    function init() {
        const mapType = document.querySelector('input[name="mapType"]:checked').value;
        const sectorType = document.querySelector('input[name="sectorType"]:checked').value;
        document.getElementById("output").value = generateSector(sectorType, mapType);
        document.getElementById("sectorPopulation").textContent = calculatePopulation(document.getElementById("output").value);
        document.getElementById("mapButton").disabled = false;
    }
    init();
    //TODO: Would be nice to get a map image using the API (https://travellermap.com/doc/api#poster-render-a-sector-quadrant-or-subsector) and display it under the textarea
</script>
