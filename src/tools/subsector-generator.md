# Cepheus Engine Subsector Generator

This tool will generate a Cepheus Engine subsector according to the rules found in [Chapter 12: Worlds](../book3/worlds.html). The output is in [SEC format](https://travellermap.com/doc/fileformats#legacy-sec-format) and can be copy/pasted into the [Traveller Map custom data tools](https://travellermap.com/doc/custom).

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
<div id="sectorPopulation"></div>

<script src="pseudohex.js"></script>
<script src="roll.js"></script>
<script src="sector.js"></script>
<script src="world.js"></script>
<script>
    function init() {
        document.getElementById("output").value = generateSector(document.querySelector('input[name="sectorType"]:checked').value);
        document.getElementById("sectorPopulation").textContent = calculatePopulation(document.getElementById("output").value);
    }
    init();
    //TODO: Would be nice to get a map image using the API (https://travellermap.com/doc/api#poster-render-a-sector-quadrant-or-subsector) and display it under the textarea
</script>
