const midi = require('midi');
const fs = require('fs');

// Set up a new input.
const input = new midi.Input();
const output = new midi.Output();

const inputPortCount = input.getPortCount();
const outputPortCount = output.getPortCount();
// Count the available input ports.
console.log({ inputPortCount, outputPortCount });

console.log('input:');
for (var i = 0; i < inputPortCount; i++) {
    // Get the name of a specified input port.
    console.log(i, input.getPortName(i));
}

console.log('output:');
for (var i = 0; i < outputPortCount; i++) {
    // Get the name of a specified input port.
    console.log(i, output.getPortName(i));
}

const port = 1;

// Configure a callback.
input.on('message', (deltaTime, message) => {
    // The message is an array of numbers corresponding to the MIDI bytes:
    //   [status, data1, data2]
    // https://www.cs.cf.ac.uk/Dave/Multimedia/node158.html has some helpful
    // information interpreting the messages.

    // console.log(`m: ${message} d: ${deltaTime}`);

    parseMessage(message);
});

// Open the first available input port.
input.openPort(port);
// Order: (Sysex, Timing, Active Sensing)
// For example if you want to receive only MIDI Clock beats
// you should use
// input.ignoreTypes(true, false, true)
input.ignoreTypes(false, true, false);

output.openPort(port);
// output.sendMessage([176,22,1]);

// read pattern
output.sendMessage([0xf0, 0x42, 0x30, 0, 1, 0x23, 0x10, 0xf7]);

// // go to pattern 139
// output.sendMessage([0xb0,0,0]);
// // 0 from 1, 1 from 129
// output.sendMessage([0xb0,0x20,1]);
// // 129+10
// output.sendMessage([0xc0, 0,10]);

function parseMessage(data) {
    const headers = data.slice(0, 7).toString();
    switch (headers) {
        case '240,66,48,0,1,34,64': // e2s ?
        case '240,66,48,0,1,35,64': // e2
            console.log('Received pattern', data);
            parsePattern(data);
            break;

        default:
            console.log('MIDI data', headers, data);
            break;
    }
}

const BEAT = ['16', '32', '8 Tri', '16 Tri'];
const MFX = [
    'Mod Delay',
    'Tape Delay',
    'High Pass Delay',
    'Hall Reverb',
    'Room Reverb',
    'Wet Reverb',
    'Looper',
    'Pitch Lopper',
    'Step Shifter',
    'Slicer',
    'Jag Filter',
    'Grain Shifter',
    'Vinyl Break',
    'Seq Reverse',
    'Seq Doubler',
    'Odd Stepper',
    'Even Stepper',
    'Low Pass Filter',
    'High Pass Filter',
    'Band Plus Filter',
    'Touch Wah',
    'Tube EQ',
    'Decimator',
    'Distortion',
    'Compressor',
    'Limiter',
    'Chorus',
    'XY Flanger',
    'LFO Flanger',
    'XY Phaser',
    'LFO Phaser',
    'Auto Pan',
];

const KEY = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const SCALE = [
    'Chromatic',
    'Ionian',
    'Dorian',
    'Phrygian',
    'Lydian',
    'Mixolidian',
    'Aeolian',
    'Locrian',
    'Harm minor',
    'Melo minor',
    'Major Blues',
    'minor Blues',
    'Diminished',
    'Com.Dim',
    'Major Penta',
    'minor Penta',
    'Raga 1',
    'Raga 2',
    'Raga 3',
    'Arabic',
    'Spanish',
    'Gypsy',
    'Egyptian',
    'Hawaiian',
    'Pelog',
    'Japanese',
    'Ryuku',
    'Chinese',
    'Bass Line',
    'Whole Tone',
    'minor 3rd',
    'Major 3rd',
    '4th Interval',
    '5th Interval',
    'Octave',
];

function parsePattern(rawData) {
    const data = [...rawData];

    cmpLog(data);

    const name = data
        .slice(26, 43)
        .filter((c, k) => c && k != 13) // data[39], here 13, is used for tempo ? kind of weird...
        .map((c) => String.fromCharCode(c))
        .join('');

    const pattern = {
        name,
        tempo: data[46] + data[48] * 256 + (data[39] ? 128 : 0),
        swing: data[49] > 50 ? data[49] - 128 : data[49], // 48 is displayed 50 and -48 -> -50 but fuck it :p
        length: data[50] + 1,
        beat: BEAT[data[51]],
        key: KEY[data[52]],
        keyId: data[52],
        scale: SCALE[data[53]],
        scaleId: data[53],
        chordSet: data[54] + 1,
        level: 127 - data[56],
        gateArp: data[64] + 1,
        mfx: MFX[data[77]],
        mfxId: data[77],
        alternate13_14: !!data[85],
        alternate15_16: !!data[86],
        chainTo: data[17269] + (data[17263] && 128),
        chainRepeat: data[17272]
    };

    console.log(pattern);
}

function cmpLog(data) {
    const output = fs.readFileSync('log.json');
    if (output) {
        const pre = JSON.parse(output);
        // console.log('output', pre);
        data.forEach((value, index) => {
            if (pre[index] !== value) {
                console.log(`> (${index}) ${pre[index]} <=> ${value}`);
            }
        });
    }
    fs.writeFileSync('log.json', JSON.stringify(data));
}
