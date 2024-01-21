// Környezeti változók (.env) kezelése.
import 'dotenv/config';

// Szükséges npm csomagok kezelése.
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Szerver beállítása.
const PORT = process.env.PORT || 3500;
const app = express();

// Statikus mappa (public) beállítása.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Megjelenítő motor beállítása.
app.set('view engine', 'ejs');

// Adatbáziscsatlakozás kezelése.
import connection from './database.js';

// POST lekérdezések kezelése.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// root-route kezelése.
app.get('/', async (req, res) => {
    try {
        const { marka, sort } = req.query;
        let ures = true;
        let autok = null;
        if (marka) {
            if (sort === 'asc') {
                autok = await connection.query(
                    `
            SELECT * FROM duduk 
            WHERE marka = ?
            ORDER BY ar ASC
            `,
                    [marka]
                );
                ures = false;
            } else if (sort === 'desc') {
                autok = await connection.query(
                    `
            SELECT * FROM duduk 
            WHERE marka = ?
            ORDER BY ar DESC
            `,
                    [marka]
                );
                ures = false;
            } else {
                autok = await connection.query(
                    `
            SELECT * FROM duduk 
            WHERE marka = ?
            `,
                    [marka]
                );
                ures = false;
            }
        } else {
            if (sort === 'asc') {
                autok = await connection.query(
                    'SELECT * FROM duduk ORDER by ar ASC'
                );
            } else if (sort === 'desc') {
                autok = await connection.query(
                    'SELECT * FROM duduk ORDER by ar DESC'
                );
            } else {
                autok = await connection.query('SELECT * FROM duduk');
            }
        }
        return res
            .status(200)
            .render('index', { duduk: autok[0], ures: ures, marka: marka });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

// egyedi-route kezelése.
app.get('/egyedi/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const lekertAuto = await connection.query(
            `
        SELECT * FROM duduk 
        WHERE id = ?
        `,
            [parseInt(id)]
        );
        return res.status(200).render('egyedi.ejs', { dudu: lekertAuto[0] });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

// torol-route kezelése.
app.get('/torol/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await connection.query(
            `
        DELETE FROM duduk
        WHERE id = ?
        `,
            [parseInt(id)]
        );
        return res.status(302).redirect('/');
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

// modosit-route kezelése.
app.get('/modosit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const modositottAuto = await connection.query(
            `
        SELECT * FROM duduk
        WHERE id = ?
        `,
            [parseInt(id)]
        );
        return res
            .status(200)
            .render('modosit.ejs', { dudu: modositottAuto[0] });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

app.post('/modosit', async (req, res) => {
    try {
        const { azon, marka, tipus, ar, kep } = req.body;
        const modositottAuto = await connection.query(
            `
        UPDATE duduk
        SET marka = ?, tipus = ?, ar = ?, kep = ?
        WHERE id = ?
        `,
            [marka, tipus, parseInt(ar), kep, parseInt(azon)]
        );
        return res.status(201).json({ msg: 'Minden oké!' });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

// feltolt-route kezelése.
app.get('/feltolt', async (req, res) => {
    try {
        return res.status(200).render('feltolt.ejs');
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

app.post('/feltolt', async (req, res) => {
    try {
        const { marka, tipus, ar, kep } = req.body;
        const feltoltottAuto = await connection.query(
            `
        INSERT INTO duduk (marka, tipus, ar, kep)
        VALUE (?, ?, ?, ?)
        `,
            [marka, tipus, parseInt(ar), kep]
        );
        return res.status(201).json({ msg: 'Minden oké!' });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

// Szerver futtatása.
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
