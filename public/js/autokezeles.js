// A fetch-függvény aszinkron.
async function feltolt(e) {
    e.preventDefault();

    const marka = document.getElementById('marka').value;
    const tipus = document.getElementById('tipus').value;
    const ar = document.getElementById('ar').value;
    const kep = document.getElementById('kep').value;

    const result = await fetch('/feltolt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ marka, tipus, ar, kep }),
    });

    if (result.ok) {
        window.location = '/';
    } else {
        window.alert('Valami hiba történt!');
    }
}

async function modosit(e) {
    e.preventDefault();

    const azon = document.getElementById('azon').value;
    const marka = document.getElementById('marka').value;
    const tipus = document.getElementById('tipus').value;
    const ar = document.getElementById('ar').value;
    const kep = document.getElementById('kep').value;

    const result = await fetch('/modosit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ azon, marka, tipus, ar, kep }),
    });

    if (result.ok) {
        window.location = '/';
    } else {
        window.alert('Valami hiba történt!');
    }
}

function szures(e) {
    e.preventDefault();
    let cars = document.getElementById('cars');
    let valasztott = cars.value;
    console.log(valasztott);

    if (valasztott === '') {
        window.location = `/`;
    } else {
        window.location = `/?marka=${valasztott}`;
    }
}
