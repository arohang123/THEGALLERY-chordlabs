// ===============================
// CHORDLAB - CHORD ENGINE
// ===============================

const keySelect = document.getElementById("keySelect");
const scaleSelect = document.getElementById("scaleSelect");
const moodSelect = document.getElementById("moodSelect");

const chordList = document.getElementById("chordList");
const progression = document.getElementById("progression");

const clearBtn = document.getElementById("clearBtn");
const generateBtn = document.getElementById("generateBtn");


// Notes in a chromatic scale
const notes = [
    "C", "C#", "D", "D#", "E", "F",
    "F#", "G", "G#", "A", "A#", "B"
];


// Major scale intervals
const majorIntervals = [
    0, 2, 4, 5, 7, 9, 11
];


// Minor scale intervals
const minorIntervals = [
    0, 2, 3, 5, 7, 8, 10
];


// Roman numerals
const majorDegrees = [
    "I", "ii", "iii", "IV", "V", "vi", "vii°"
];

const minorDegrees = [
    "i", "ii°", "III", "iv", "v", "VI", "VII"
];


// Chord qualities
const majorQualities = [
    "major",
    "minor",
    "minor",
    "major",
    "major",
    "minor",
    "dim"
];

const minorQualities = [
    "minor",
    "dim",
    "major",
    "minor",
    "minor",
    "major",
    "major"
];


// --------------------------------
// Find note index
// --------------------------------

function getNoteIndex(note) {

    return notes.indexOf(note);

}


// --------------------------------
// Get scale notes
// --------------------------------

function getScaleNotes(key, scale) {

    const rootIndex = getNoteIndex(key);

    const intervals =
        scale === "major"
            ? majorIntervals
            : minorIntervals;

    return intervals.map(interval => {

        return notes[
            (rootIndex + interval) % 12
        ];

    });

}


// --------------------------------
// Create chord name
// --------------------------------

function createChordName(note, quality) {

    if (quality === "minor") {
        return note + "m";
    }

    if (quality === "dim") {
        return note + "dim";
    }

    return note;
}


// --------------------------------
// Display available chords
// --------------------------------

function displayChords() {

    const key = keySelect.value;
    const scale = scaleSelect.value;

    const scaleNotes =
        getScaleNotes(key, scale);

    const degrees =
        scale === "major"
            ? majorDegrees
            : minorDegrees;

    const qualities =
        scale === "major"
            ? majorQualities
            : minorQualities;


    chordList.innerHTML = "";


    scaleNotes.forEach((note, index) => {

        const chordName =
            createChordName(
                note,
                qualities[index]
            );


        const chord =
            document.createElement("div");

        chord.className = "chord";


        chord.innerHTML = `
            <div class="name">
                ${chordName}
            </div>

            <div class="degree">
                ${degrees[index]}
            </div>
        `;


        chord.addEventListener(
            "click",
            () => {

                addChord(chordName);

            }
        );


        chordList.appendChild(chord);

    });

}


// --------------------------------
// Add chord to progression
// --------------------------------

function addChord(chordName) {

    const empty =
        progression.querySelector(".empty");


    if (empty) {
        empty.remove();
    }


    const chord =
        document.createElement("div");

    chord.className =
        "progression-chord";

    chord.textContent =
        chordName;
chord.addEventListener("click", () => {
    playChord(chordName);
});

    progression.appendChild(chord);

}


// --------------------------------
// Clear progression
// --------------------------------

clearBtn.addEventListener(
    "click",
    () => {

        progression.innerHTML = `
            <span class="empty">
                Click chords above to build your progression
            </span>
        `;

    }
);


// --------------------------------
// Generate progression
// --------------------------------

const progressions = {

    happy: [
        [0, 3, 4, 0],
        [0, 4, 5, 3]
    ],

    sad: [
        [0, 5, 3, 4],
        [0, 3, 6, 0]
    ],

    emotional: [
        [0, 5, 3, 4],
        [0, 3, 4, 5]
    ],

    dark: [
        [0, 5, 6, 4],
        [0, 3, 6, 5]
    ],

    romantic: [
        [0, 3, 5, 4],
        [0, 5, 3, 4]
    ],

    epic: [
        [0, 3, 4, 5],
        [0, 4, 5, 3]
    ]

};


generateBtn.addEventListener(
    "click",
    () => {

        const scale =
            scaleSelect.value;

        const mood =
            moodSelect.value;


        const scaleNotes =
            getScaleNotes(
                keySelect.value,
                scale
            );


        const qualities =
            scale === "major"
                ? majorQualities
                : minorQualities;


        const available =
            progressions[mood];


        const pattern =
            available[
                Math.floor(
                    Math.random() *
                    available.length
                )
            ];


        clearBtn.click();


        pattern.forEach(index => {

            const chord =
                createChordName(
                    scaleNotes[index],
                    qualities[index]
                );


            addChord(chord);

        });

    }
);


// --------------------------------
// Update chords when key changes
// --------------------------------

keySelect.addEventListener(
    "change",
    displayChords
);


scaleSelect.addEventListener(
    "change",
    displayChords
);


// --------------------------------
// Start application
// --------------------------------

displayChords();
// ===============================
// PIANO SOUND ENGINE
// ===============================

let audioContext = null;


// Piano note frequencies

const frequencies = {

    "C": 261.63,
    "C#": 277.18,
    "D": 293.66,
    "D#": 311.13,
    "E": 329.63,
    "F": 349.23,
    "F#": 369.99,
    "G": 392.00,
    "G#": 415.30,
    "A": 440.00,
    "A#": 466.16,
    "B": 493.88,
    "C2": 523.25

};


// Play piano note

function playNote(note) {

    // Create audio system
    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }


    // Resume audio if browser paused it

    if (audioContext.state === "suspended") {

        audioContext.resume();

    }


    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();


    oscillator.type = "triangle";


    oscillator.frequency.value =
        frequencies[note];


    // Start quiet

    gain.gain.setValueAtTime(
        0,
        audioContext.currentTime
    );


    // Attack

    gain.gain.linearRampToValueAtTime(
        0.7,
        audioContext.currentTime + 0.02
    );


    // Release

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 1.2
    );


    oscillator.connect(gain);

    gain.connect(
        audioContext.destination
    );


    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 1.2
    );

}


// ===============================
// CONNECT PIANO KEYS
// ===============================

const pianoKeys =
    document.querySelectorAll(
        ".white-key, .black-key"
    );


pianoKeys.forEach(key => {

    key.addEventListener(
        "click",
        () => {

            const note =
                key.dataset.note;

            playNote(note);

        }
    );

});
// ===============================
// PLAY FULL CHORD
// ===============================

const chordNotes = {
    "C": ["C", "E", "G"],
    "Dm": ["D", "F", "A"],
    "Em": ["E", "G", "B"],
    "F": ["F", "A", "C"],
    "G": ["G", "B", "D"],
    "Am": ["A", "C", "E"],
    "Bdim": ["B", "D", "F"],

    "D": ["D", "F#", "A"],
    "Em": ["E", "G", "B"],
    "F#m": ["F#", "A", "C#"],
    "G": ["G", "B", "D"],
    "A": ["A", "C#", "E"],
    "Bm": ["B", "D", "F#"],
    "C#dim": ["C#", "E", "G"],

    "E": ["E", "G#", "B"],
    "F#m": ["F#", "A", "C#"],
    "G#m": ["G#", "B", "D#"],
    "A": ["A", "C#", "E"],
    "B": ["B", "D#", "F#"],
    "C#m": ["C#", "E", "G#"],
    "D#dim": ["D#", "F#", "A"],

    "F": ["F", "A", "C"],
    "Gm": ["G", "A#", "D"],
    "Am": ["A", "C", "E"],
    "A#": ["A#", "D", "F"],
    "Dm": ["D", "F", "A"],

    "B": ["B", "D#", "F#"]
};

function playChord(chordName) {

    console.log("Playing chord:", chordName);

    const notesToPlay = chordNotes[chordName];

    if (!notesToPlay) {
        console.log("Chord not found:", chordName);
        return;
    }

    notesToPlay.forEach(note => {
        playNote(note);
    });
}


// Play multiple notes together
function playChord(chordName) {

    const notesToPlay =
        chordNotes[chordName];

    if (!notesToPlay) {
        return;
    }

    // Piano मा chord notes highlight
    highlightChordOnPiano(chordName);

    // Chord बजाउने
    notesToPlay.forEach(note => {
        playNote(note);
    });
}
// ===============================
// PLAY PROGRESSION - FIXED
// ===============================

let isPlaying = false;
let playTimer = null;

const playBtn = document.getElementById("playProgressionBtn");
const stopBtn = document.getElementById("stopProgressionBtn");

playBtn.addEventListener("click", () => {

    const chords =
        document.querySelectorAll(".progression-chord");

    if (chords.length === 0) {
        alert("Add some chords first!");
        return;
    }

    stopPlayback();

    isPlaying = true;

    let index = 0;

    function playNext() {

        if (!isPlaying) return;

        // Remove previous highlight
        chords.forEach(chord => {
            chord.classList.remove("playing");
        });

        const chord = chords[index];

        // Highlight
        chord.classList.add("playing");

        // Play chord
        playChord(chord.textContent.trim());

        // BPM
        const bpmElement =
            document.querySelector('input[type="number"]');

        const bpm =
            bpmElement
                ? Number(bpmElement.value) || 90
                : 90;

        // 4 beats per chord
        const duration =
            (60000 / bpm) * 4;

        index++;

        if (index >= chords.length) {
            index = 0;
        }

        playTimer =
            setTimeout(playNext, duration);
    }

    playNext();
});


stopBtn.addEventListener("click", stopPlayback);


function stopPlayback() {

    isPlaying = false;

    if (playTimer) {
        clearTimeout(playTimer);
        playTimer = null;
    }

    document
        .querySelectorAll(".progression-chord")
        .forEach(chord => {
            chord.classList.remove("playing");
        });
}
// ===============================
// HIGHLIGHT CHORD NOTES ON PIANO
// ===============================

function highlightChordOnPiano(chordName) {

    // सबै piano keys reset
    pianoKeys.forEach(key => {
        key.classList.remove("chord-note");
    });

    const notesToHighlight = chordNotes[chordName];

    if (!notesToHighlight) {
        return;
    }

    pianoKeys.forEach(key => {

        let note = key.dataset.note;

        // C2 लाई C मान्ने
        if (note === "C2") {
            note = "C";
        }

        if (notesToHighlight.includes(note)) {
            key.classList.add("chord-note");
        }
    });
}