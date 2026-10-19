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

const scaleIntervals = {

    major: [0, 2, 4, 5, 7, 9, 11],

    minor: [0, 2, 3, 5, 7, 8, 10],

    harmonicMinor: [0, 2, 3, 5, 7, 8, 11],

    melodicMinor: [0, 2, 3, 5, 7, 9, 11],

    majorPentatonic: [0, 2, 4, 7, 9],

    minorPentatonic: [0, 3, 5, 7, 10],

    blues: [0, 3, 5, 6, 7, 10],

    dorian: [0, 2, 3, 5, 7, 9, 10],

    phrygian: [0, 1, 3, 5, 7, 8, 10],

    lydian: [0, 2, 4, 6, 7, 9, 11],

    mixolydian: [0, 2, 4, 5, 7, 9, 10],

    locrian: [0, 1, 3, 5, 6, 8, 10],

    chromatic: [
        0, 1, 2, 3, 4, 5,
        6, 7, 8, 9, 10, 11
    ]

};


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
        scaleIntervals[scale] ||
        scaleIntervals.major;

    return intervals.map(interval => {

        return notes[
            (rootIndex + interval) % 12
        ];

    });
}

function getScaleChords(scaleNotes) {

    const chords = [];

    // Major 3rd = 4 semitones
    // Minor 3rd = 3 semitones
    // Diminished = 3 + 3

    scaleNotes.forEach((root, index) => {

        const third =
            scaleNotes[(index + 2) % scaleNotes.length];

        const fifth =
            scaleNotes[(index + 4) % scaleNotes.length];

        const rootIndex = getNoteIndex(root);
        const thirdIndex = getNoteIndex(third);
        const fifthIndex = getNoteIndex(fifth);

        const thirdDistance =
            (thirdIndex - rootIndex + 12) % 12;

        const fifthDistance =
            (fifthIndex - rootIndex + 12) % 12;

        let quality = "major";

        if (
            thirdDistance === 3 &&
            fifthDistance === 6
        ) {
            quality = "dim";
        }

        else if (
            thirdDistance === 3
        ) {
            quality = "minor";
        }

        chords.push({
            root: root,
            quality: quality
        });

    });

    return chords;
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
function getRomanNumeral(index) {

    const numerals = [
        "I",
        "II",
        "III",
        "IV",
        "V",
        "VI",
        "VII"
    ];

    return numerals[index] || "";
}

function displayChords() {

    const key = keySelect.value;
    const scale = scaleSelect.value;

    const scaleNotes = getScaleNotes(key, scale);

    const scaleChords =
        getScaleChords(scaleNotes);

    chordList.innerHTML = "";

    scaleChords.forEach((chordData, index) => {

        const chordName =
            createChordName(
                chordData.root,
                chordData.quality
            );

        const chord =
            document.createElement("div");

        chord.className = "chord";

        chord.innerHTML = `
            <div class="name">
                ${chordName}
            </div>

           <div class="degree">
    ${scale === "major"
        ? majorDegrees[index]
        : scale === "minor"
            ? minorDegrees[index]
            : getRomanNumeral(index)}
</div> 
        `;

        chord.addEventListener("click", () => {
            addChord(chordName);
        });

        chordList.appendChild(chord);

    });


const scaleNotesDisplay =
    document.getElementById("scaleNotes");

if (scaleNotesDisplay) {
    scaleNotesDisplay.innerHTML = scaleNotes
        .map(note => `<span class="scale-note">${note}</span>`)
        .join("");
}
  

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
        [0, 4, 5, 3],
        [0, 5, 3, 4],
        [0, 3, 5, 4],
        [0, 4, 0, 5],
        [0, 5, 4, 0],
        [0, 3, 4, 5],
        [0, 4, 3, 5]
    ],

    sad: [
        [0, 5, 3, 4],
        [0, 3, 6, 0],
        [5, 3, 0, 4],
        [0, 5, 4, 3],
        [0, 3, 5, 4],
        [5, 4, 3, 0],
        [0, 6, 3, 4],
        [0, 5, 6, 3]
    ],

    emotional: [
        [0, 5, 3, 4],
        [0, 3, 4, 5],
        [0, 5, 4, 3],
        [0, 3, 5, 4],
        [5, 3, 0, 4],
        [0, 6, 4, 5],
        [0, 5, 3, 6],
        [3, 5, 0, 4]
    ],

    dark: [
        [0, 5, 6, 4],
        [0, 3, 6, 5],
        [0, 6, 5, 4],
        [0, 5, 3, 6],
        [6, 5, 3, 0],
        [0, 6, 3, 5],
        [5, 3, 6, 0],
        [0, 3, 5, 6]
    ],

    romantic: [
        [0, 3, 5, 4],
        [0, 5, 3, 4],
        [0, 4, 5, 3],
        [0, 3, 4, 5],
        [5, 3, 4, 0],
        [0, 5, 4, 3],
        [3, 5, 0, 4],
        [0, 4, 3, 5]
    ],

    epic: [
        [0, 3, 4, 5],
        [0, 4, 5, 3],
        [0, 5, 3, 4],
        [0, 3, 5, 4],
        [0, 4, 3, 5],
        [5, 3, 4, 0],
        [0, 5, 4, 3],
        [3, 4, 5, 0]
    ]
};



generateBtn.addEventListener("click", () => {

    const scale = scaleSelect.value;
    const mood = moodSelect.value;

    const scaleNotes = getScaleNotes(
        keySelect.value,
        scale
    );

    const scaleChords = getScaleChords(scaleNotes);

    if (scaleChords.length < 4) {
        alert("Progression banauna kamti ma 4 ota notes chahinchha!");
        return;
    }

    // Mood anusar progression ko style
    const moodPatterns = {
        happy: [0, 2, 3, 4],
        sad: [0, 5, 3, 4],
        emotional: [0, 5, 2, 3],
        dark: [0, 2, 5, 3],
        romantic: [0, 3, 5, 4],
        epic: [0, 3, 4, 5]
    };

    const pattern = moodPatterns[mood] || [0, 3, 4, 0];

    // Scale ko length anusar index adjust
    const length = scaleChords.length;

    const progressionIndexes = pattern.map(index =>
        index % length
    );

    // Eutai pattern sadhai naaaos bhanera shuffle
    for (let i = progressionIndexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [progressionIndexes[i], progressionIndexes[j]] =
            [progressionIndexes[j], progressionIndexes[i]];
    }

    clearBtn.click();

    progressionIndexes.forEach(index => {

        const chordData = scaleChords[index];

        const chordName = createChordName(
            chordData.root,
            chordData.quality
        );

        addChord(chordName);

    });

});



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
