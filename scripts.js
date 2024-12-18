let sgpas = [];
let nRemoval = 0;

function toggleVisibility(elementId, show = true) {
    const element = document.getElementById(elementId);
    if (show) {
        element.classList.remove('hidden');
        element.classList.add('show');
    } else {
        element.classList.add('hidden');
        element.classList.remove('show');
    }
}

function addSemestersInputs() {
  const regularSems = parseInt(document.getElementById('regular-sems').value) || 0;
  const summerSems = parseInt(document.getElementById('summer-sems').value) || 0;
  const totalSems = regularSems + summerSems;

  const container = document.getElementById('semesters-inputs');
  container.innerHTML = '';

  for (let i = 1; i <= totalSems; i++) {
      const labelType = i <= regularSems ? `Semester ${i}` : `Summer Semester ${i - regularSems}`;

      container.innerHTML += `
          <div class="semester-row">
              <div class="form-group">
                  <label for="sgpa-sem-${i}">${labelType} SGPA:</label>
                  <input type="number" id="sgpa-sem-${i}" min="0" max="10" step="0.01" placeholder="Eg: 9.0" required>
              </div>
              <div class="form-group">
                  <label for="credits-sem-${i}"># Graded Credits:</label>
                  <input type="number" id="credits-sem-${i}" min="0" placeholder="Eg: 20" required>
              </div>
          </div>
      `;
  }
}


function calculateCGPA() {
    const regularSems = parseInt(document.getElementById('regular-sems').value) || 0;
    const summerSems = parseInt(document.getElementById('summer-sems').value) || 0;
    const totalSems = regularSems + summerSems;
    const ocCreds = parseInt(document.getElementById('oc-creds').value) || 0;

    sgpas = [];
    for (let i = 1; i <= totalSems; i++) {
        const sgpa = parseFloat(document.getElementById(`sgpa-sem-${i}`).value) || 0;
        const credits = parseFloat(document.getElementById(`credits-sem-${i}`).value) || 0;
        sgpas.push([sgpa, credits]);
    }

    let gradedCredits = sgpas.reduce((sum, [_, creds]) => sum + creds, 0);
    let baseline = 0;
    if (regularSems > 5) {
        baseline = regularSems === 6 ? 116 : regularSems === 7 ? 136 : 156;
    }
    let totalCredits = gradedCredits + ocCreds;

    let N = Math.max(0, totalCredits - baseline);
    nRemoval = Math.min(8, N);

    if (regularSems <= 5) {
        nRemoval = 0;
    }

    const worstGradesContainer = document.getElementById('worst-grades-container');
    worstGradesContainer.innerHTML = '';

    for (let i = 0; i < Math.ceil(nRemoval / 4); i++) {
        worstGradesContainer.innerHTML += `
          <div class="semester-row">
            <div class="form-group">
                <label for="worst-grade-${i}">Worst Grade ${i + 1}:</label>
                <input type="number" id="worst-grade-${i}" min="0" max="10" step="0.01" placeholder="Eg: 7" required>
            </div>
            <div class="form-group">
                <label for="worst-credits-${i}">Credits for Worst Grade ${i + 1}:</label>
                <input type="number" id="worst-credits-${i}" min="0" placeholder="Eg: 7" required>
            </div>
          </div>
        `;
    }

    toggleVisibility('worst-grades-inputs', true);
}

function finalizeCGPA() {
    const regularSems = parseInt(document.getElementById('regular-sems').value) || 0;
    const ocCreds = parseInt(document.getElementById('oc-creds').value) || 0;

    let numerator = sgpas.reduce((sum, [grade, creds]) => sum + grade * creds, 0);

    for (let i = 0; i < Math.ceil(nRemoval / 4); i++) {
        const grade = parseFloat(document.getElementById(`worst-grade-${i}`).value) || 0;
        const credits = parseFloat(document.getElementById(`worst-credits-${i}`).value) || 0;
        numerator -= grade * credits;
    }

    let baseline = 0;
    if (regularSems > 5) {
        baseline = regularSems === 6 ? 116 : regularSems === 7 ? 136 : 156;
    }

    let nExtra = Math.max(0, sgpas.reduce((sum, [_, creds]) => sum + creds, 0) + ocCreds - baseline - nRemoval);
    let denominator = baseline - ocCreds + nExtra;

    let cgpa = numerator / denominator;

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h2><strong>CGPA:</strong> ${cgpa.toFixed(2)}</h2>
        <br>
        <h2>More Information:</h3>
        <p><strong>Total Credits (excluding SG/CW):</strong> ${sgpas.reduce((sum, [_, creds]) => sum + creds, 0) + ocCreds}</p>
        <p><strong>Graded Credits:</strong> ${sgpas.reduce((sum, [_, creds]) => sum + creds, 0)}</p>
        <p><strong>Baseline:</strong> ${baseline}</p>
        <p><strong>Credits being removed:</strong> ${nRemoval}</p>
        <p><strong>Extra credits beyond removal:</strong> ${nExtra}</p>
    `;

    toggleVisibility('results', true);
    toggleVisibility('worst-grades-inputs', false);
}
