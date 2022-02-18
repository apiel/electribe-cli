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

const event = {
    onPatternData: ({ pattern, data }) => {},
};

event.onPatternData = ({ pattern, data }) => {
    console.log(pattern);

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
};

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

const OSC = [
    { name: 'SubBeef', type: 'Kick' },
    { name: 'Lazy', type: 'Kick' },
    { name: 'Echoes', type: 'Kick' },
    { name: 'Lay', type: 'Kick' },
    { name: 'Hardstyle', type: 'Kick' },
    { name: 'Hardcore', type: 'Kick' },
    { name: 'Southpaw', type: 'Kick' },
    { name: '8BitGrime', type: 'Kick' },
    { name: 'Noiz', type: 'Kick' },
    { name: 'HiKnock', type: 'Kick' },
    { name: 'LoKnock', type: 'Kick' },
    { name: 'Tronica', type: 'Kick' },
    { name: 'HiClicky', type: 'Kick' },
    { name: 'LoClicky', type: 'Kick' },
    { name: 'Subsonic', type: 'Kick' },
    { name: 'Threed', type: 'Kick' },
    { name: 'Lololow', type: 'Kick' },
    { name: 'Risky', type: 'Kick' },
    { name: 'ShortBoom', type: 'Kick' },
    { name: 'AttackEight', type: 'Kick' },
    { name: 'PureEight', type: 'Kick' },
    { name: 'UltraEight', type: 'Kick' },
    { name: 'SnipEight', type: 'Kick' },
    { name: 'ShortNine', type: 'Kick' },
    { name: 'PureNine', type: 'Kick' },
    { name: 'BoostNine', type: 'Kick' },
    { name: 'Harder', type: 'Kick' },
    { name: 'BitBreak', type: 'Kick' },
    { name: 'Finger', type: 'Kick' },
    { name: 'Filthy', type: 'Kick' },
    { name: 'Visual', type: 'Kick' },
    { name: 'Breaker', type: 'Kick' },
    { name: 'Urban', type: 'Kick' },
    { name: 'Roomy', type: 'Kick' },
    { name: 'Studio', type: 'Kick' },
    { name: 'Twinkling', type: 'Kick' },
    { name: 'Hippy', type: 'Kick' },
    { name: 'Ringy', type: 'Kick' },
    { name: 'Womp', type: 'Kick' },
    { name: 'Hip', type: 'Kick' },
    { name: 'Jungle', type: 'Kick' },
    { name: 'EastCoast', type: 'Kick' },
    { name: 'Jazz', type: 'Kick' },
    { name: 'Rock', type: 'Kick' },
    { name: 'Warm', type: 'Kick' },
    { name: 'Breaks', type: 'Kick' },
    { name: "80'sR&B1", type: 'Kick' },
    { name: "80'sR&B2", type: 'Kick' },
    { name: "80'sR&B3", type: 'Kick' },
    { name: 'DDD1', type: 'Kick' },
    { name: 'DoncaMatic', type: 'Kick' },
    { name: 'BeatVox1', type: 'Kick' },
    { name: 'BeatVox2', type: 'Kick' },
    { name: 'BeatVox3', type: 'Kick' },
    { name: 'Reverse1', type: 'Kick' },
    { name: 'Reverse2', type: 'Kick' },
    { name: 'Aftertaste', type: 'Snare' },
    { name: 'Sharp', type: 'Snare' },
    { name: 'Toofer', type: 'Snare' },
    { name: 'Clpsnr', type: 'Snare' },
    { name: 'Bosh', type: 'Snare' },
    { name: 'Wide', type: 'Snare' },
    { name: 'BreaksLofi', type: 'Snare' },
    { name: 'Beach', type: 'Snare' },
    { name: 'Hefty', type: 'Snare' },
    { name: 'Goodie', type: 'Snare' },
    { name: 'Steady', type: 'Snare' },
    { name: 'Tech', type: 'Snare' },
    { name: 'Lay', type: 'Snare' },
    { name: 'LoNine', type: 'Snare' },
    { name: 'HiNine', type: 'Snare' },
    { name: 'CompNine', type: 'Snare' },
    { name: 'PureEight', type: 'Snare' },
    { name: 'BodyEight', type: 'Snare' },
    { name: 'TrapEight', type: 'Snare' },
    { name: 'Shortate', type: 'Snare' },
    { name: 'LeanSnare', type: 'Snare' },
    { name: 'Seventy', type: 'Snare' },
    { name: 'DDD1', type: 'Snare' },
    { name: 'Nuxx', type: 'Snare' },
    { name: 'Oldie', type: 'Snare' },
    { name: 'Bigger', type: 'Snare' },
    { name: "80'sR&B1", type: 'Snare' },
    { name: "80'sR&B2", type: 'Snare' },
    { name: 'Jazz1', type: 'Snare' },
    { name: 'Jazz2', type: 'Snare' },
    { name: 'Snappy', type: 'Snare' },
    { name: 'Ambee', type: 'Snare' },
    { name: 'Verdy', type: 'Snare' },
    { name: 'Tubeverb', type: 'Snare' },
    { name: 'Open1', type: 'Snare' },
    { name: 'Open2', type: 'Snare' },
    { name: 'Oldskool', type: 'Snare' },
    { name: 'Hoppy', type: 'Snare' },
    { name: 'Ringy', type: 'Snare' },
    { name: 'OldBreaks', type: 'Snare' },
    { name: 'Piccolo', type: 'Snare' },
    { name: 'Jungla', type: 'Snare' },
    { name: 'EastCoast', type: 'Snare' },
    { name: "D'n'B", type: 'Snare' },
    { name: 'Ambig', type: 'Snare' },
    { name: 'Juggler', type: 'Snare' },
    { name: 'DoncaMatic', type: 'Snare' },
    { name: 'Whip', type: 'Snare' },
    { name: 'Arcade', type: 'Snare' },
    { name: 'RimVox', type: 'Snare' },
    { name: 'Parched', type: 'Snare' },
    { name: 'Rimmy', type: 'Snare' },
    { name: 'AmbiRim', type: 'Snare' },
    { name: 'SnareVox', type: 'Snare' },
    { name: 'Waffle', type: 'Snare' },
    { name: 'Blast', type: 'Snare' },
    { name: 'Reverse1', type: 'Snare' },
    { name: 'Reverse2', type: 'Snare' },
    { name: 'PureEight', type: 'Clap' },
    { name: 'AmbEight', type: 'Clap' },
    { name: 'DirtySouth', type: 'Clap' },
    { name: 'PureNine', type: 'Clap' },
    { name: 'Mixed', type: 'Clap' },
    { name: 'Trap', type: 'Clap' },
    { name: 'Small', type: 'Clap' },
    { name: 'Clapper', type: 'Clap' },
    { name: 'Doubler', type: 'Clap' },
    { name: 'EastCoast', type: 'Clap' },
    { name: 'Liteclap', type: 'Clap' },
    { name: 'DDD1', type: 'Clap' },
    { name: 'Crispy', type: 'Clap' },
    { name: 'B.Boy', type: 'Clap' },
    { name: 'Crumbles', type: 'Clap' },
    { name: 'FingerSnap', type: 'Clap' },
    { name: 'NineClose1', type: 'HiHat' },
    { name: 'NineOpen1', type: 'HiHat' },
    { name: 'NineClose2', type: 'HiHat' },
    { name: 'NineOpen2', type: 'HiHat' },
    { name: 'EightClose1', type: 'HiHat' },
    { name: 'EightOpen1', type: 'HiHat' },
    { name: 'EightOpen2', type: 'HiHat' },
    { name: 'CompClose', type: 'HiHat' },
    { name: 'CompOpen', type: 'HiHat' },
    { name: 'EastClose', type: 'HiHat' },
    { name: 'EastOpen', type: 'HiHat' },
    { name: 'DDD1Close', type: 'HiHat' },
    { name: 'DDD1Open', type: 'HiHat' },
    { name: 'WarmClose', type: 'HiHat' },
    { name: 'WarmOpen', type: 'HiHat' },
    { name: 'ZeeClose', type: 'HiHat' },
    { name: 'ZeeOpen', type: 'HiHat' },
    { name: 'RoomyClose', type: 'HiHat' },
    { name: 'RoomyOpen', type: 'HiHat' },
    { name: 'RockClose', type: 'HiHat' },
    { name: 'RockOpen', type: 'HiHat' },
    { name: 'JazzClose', type: 'HiHat' },
    { name: 'JazzOpen', type: 'HiHat' },
    { name: 'HoppyClose', type: 'HiHat' },
    { name: 'HoppyOpen', type: 'HiHat' },
    { name: 'PhaseClose', type: 'HiHat' },
    { name: 'PhaseOpen', type: 'HiHat' },
    { name: 'NuHopClose', type: 'HiHat' },
    { name: 'NuHopOpen', type: 'HiHat' },
    { name: 'RightClose', type: 'HiHat' },
    { name: 'RightOpen', type: 'HiHat' },
    { name: 'NoizClose', type: 'HiHat' },
    { name: 'NoizOpen', type: 'HiHat' },
    { name: 'GranClose', type: 'HiHat' },
    { name: 'GranOpen', type: 'HiHat' },
    { name: 'Ambi', type: 'HiHat' },
    { name: 'Crackle', type: 'HiHat' },
    { name: 'Hippy', type: 'HiHat' },
    { name: 'Pump', type: 'HiHat' },
    { name: 'Voice1', type: 'HiHat' },
    { name: 'Voice2', type: 'HiHat' },
    { name: 'Reverse', type: 'HiHat' },
    { name: 'NineCym', type: 'Cymbal' },
    { name: 'Hi Cymbal', type: 'Cymbal' },
    { name: 'DoncaMatic', type: 'Cymbal' },
    { name: 'EastCoast', type: 'Cymbal' },
    { name: 'Rock', type: 'Cymbal' },
    { name: 'Synth', type: 'Cymbal' },
    { name: 'WhiteNoiz', type: 'Cymbal' },
    { name: 'RevCrash', type: 'Cymbal' },
    { name: 'NineRide', type: 'Cymbal' },
    { name: 'JazzRide1', type: 'Cymbal' },
    { name: 'JazzRide2', type: 'Cymbal' },
    { name: 'RockRide', type: 'Cymbal' },
    { name: 'ZeeRide', type: 'Cymbal' },
    { name: 'RevRide', type: 'Cymbal' },
    { name: 'Real Hi', type: 'Tom' },
    { name: 'Real MidHi', type: 'Tom' },
    { name: 'Real MidLo', type: 'Tom' },
    { name: 'Real Lo', type: 'Tom' },
    { name: 'Driven', type: 'Tom' },
    { name: 'Zee Hi', type: 'Tom' },
    { name: 'Zee Lo', type: 'Tom' },
    { name: 'OldSkool', type: 'Tom' },
    { name: 'Crunchy', type: 'Tom' },
    { name: 'E.Tom', type: 'Tom' },
    { name: 'Synth Hi1', type: 'Tom' },
    { name: 'Synth Mid1', type: 'Tom' },
    { name: 'Synth Lo1', type: 'Tom' },
    { name: 'Synth Hi2', type: 'Tom' },
    { name: 'Synth Lo2', type: 'Tom' },
    { name: 'TomEight', type: 'Tom' },
    { name: 'Conga1', type: 'Percussion' },
    { name: 'Conga2', type: 'Percussion' },
    { name: 'Conga3', type: 'Percussion' },
    { name: 'Conga4', type: 'Percussion' },
    { name: 'Conga5', type: 'Percussion' },
    { name: 'Bongo1', type: 'Percussion' },
    { name: 'Bongo2', type: 'Percussion' },
    { name: 'Bongo3', type: 'Percussion' },
    { name: 'Bongo4', type: 'Percussion' },
    { name: 'Bongo5', type: 'Percussion' },
    { name: 'Bongo6', type: 'Percussion' },
    { name: 'Djembe1', type: 'Percussion' },
    { name: 'Djembe2', type: 'Percussion' },
    { name: 'Djembe3', type: 'Percussion' },
    { name: 'Djembe4', type: 'Percussion' },
    { name: 'Darbuka1', type: 'Percussion' },
    { name: 'Darbuka2', type: 'Percussion' },
    { name: 'Darbuka3', type: 'Percussion' },
    { name: 'Darbuka4', type: 'Percussion' },
    { name: 'Timbales Hi', type: 'Percussion' },
    { name: 'Timbales Lo', type: 'Percussion' },
    { name: 'CowBell1', type: 'Percussion' },
    { name: 'CowBell2', type: 'Percussion' },
    { name: 'CowBell3', type: 'Percussion' },
    { name: 'Tambourine1', type: 'Percussion' },
    { name: 'Tambourine2', type: 'Percussion' },
    { name: 'Clave', type: 'Percussion' },
    { name: 'Guiro', type: 'Percussion' },
    { name: 'Cabasa', type: 'Percussion' },
    { name: 'Shaker', type: 'Percussion' },
    { name: 'WaveDrum1', type: 'Percussion' },
    { name: 'WaveDrum2', type: 'Percussion' },
    { name: 'WaveDrum3', type: 'Percussion' },
    { name: 'WaveDrum4', type: 'Percussion' },
    { name: 'WaveDrum5', type: 'Percussion' },
    { name: 'WaveDrum6', type: 'Percussion' },
    { name: 'WaveDrum7', type: 'Percussion' },
    { name: 'WaveDrum8', type: 'Percussion' },
    { name: 'ShakerHit', type: 'Percussion' },
    { name: 'RimPerc', type: 'Percussion' },
    { name: 'Wavestation', type: 'Percussion' },
    { name: 'RimNine', type: 'Percussion' },
    { name: 'RimEight', type: 'Percussion' },
    { name: 'SynthShake', type: 'Percussion' },
    { name: 'CowbellEight', type: 'Percussion' },
    { name: 'DoncaCongaS', type: 'Percussion' },
    { name: 'DoncaCongaL', type: 'Percussion' },
    { name: 'DoncaMaracas', type: 'Percussion' },
    { name: 'DoncaClaves', type: 'Percussion' },
    { name: 'DoncaW.block', type: 'Percussion' },
    { name: 'Synthclave', type: 'Percussion' },
    { name: 'ClickRoll', type: 'Percussion' },
    { name: 'GlitchDmg', type: 'Percussion' },
    { name: 'MouthPop', type: 'Percussion' },
    { name: 'Droplet', type: 'Percussion' },
    { name: 'Rave', type: 'Voice' },
    { name: 'Whoo', type: 'Voice' },
    { name: 'Ohooo', type: 'Voice' },
    { name: 'ComOn', type: 'Voice' },
    { name: 'Nahh', type: 'Voice' },
    { name: 'Ahaa..', type: 'Voice' },
    { name: 'Haa', type: 'Voice' },
    { name: 'Baaa', type: 'Voice' },
    { name: 'Grun', type: 'Voice' },
    { name: 'Ahaaw', type: 'Voice' },
    { name: 'Paa', type: 'Voice' },
    { name: 'Hey', type: 'Voice' },
    { name: 'Doh', type: 'Voice' },
    { name: 'GlitchEey', type: 'Voice' },
    { name: 'BotVox1', type: 'Voice' },
    { name: 'BotVox2', type: 'Voice' },
    { name: 'NoizyVox', type: 'Synth FX' },
    { name: 'Noiser', type: 'Synth FX' },
    { name: 'Botox', type: 'Synth FX' },
    { name: 'ShockSonar', type: 'Synth FX' },
    { name: 'Quark', type: 'Synth FX' },
    { name: 'ebPerc', type: 'Synth FX' },
    { name: 'Needle', type: 'Synth FX' },
    { name: 'SqueakyBum', type: 'Synth FX' },
    { name: 'SynSiren', type: 'Synth FX' },
    { name: 'Bubble', type: 'Synth FX' },
    { name: 'Burp', type: 'Synth FX' },
    { name: 'Lux', type: 'Synth FX' },
    { name: 'Squirt', type: 'Synth FX' },
    { name: 'Degraded', type: 'Synth FX' },
    { name: 'Flyby', type: 'Synth FX' },
    { name: 'SonicDrop', type: 'Synth FX' },
    { name: 'LoZap', type: 'Synth FX' },
    { name: 'SubBang', type: 'Synth FX' },
    { name: 'Stabium', type: 'Synth Hit' },
    { name: 'Futurize', type: 'Synth Hit' },
    { name: 'LilChord', type: 'Synth Hit' },
    { name: 'Ploinky', type: 'Synth Hit' },
    { name: 'Strippa', type: 'Synth Hit' },
    { name: 'BigChords', type: 'Synth Hit' },
    { name: 'StarBurst', type: 'Synth Hit' },
    { name: 'WishWash', type: 'Synth Hit' },
    { name: 'BangPop', type: 'Synth Hit' },
    { name: 'RegulatePop', type: 'Synth Hit' },
    { name: 'TigerPad', type: 'Synth Hit' },
    { name: 'LofiSynth', type: 'Synth Hit' },
    { name: 'BlastBass', type: 'Synth Hit' },
    { name: 'BenderBass', type: 'Synth Hit' },
    { name: 'RockHit1', type: 'Synth Hit' },
    { name: 'RockHit2', type: 'Synth Hit' },
    { name: 'FormantBass', type: 'Synth Hit' },
    { name: 'SynGrowl', type: 'Synth Hit' },
    { name: 'BrassHit1', type: 'Inst.Hit' },
    { name: 'BrassHit2', type: 'Inst.Hit' },
    { name: 'StringsHit1', type: 'Inst.Hit' },
    { name: 'StringsHit2', type: 'Inst.Hit' },
    { name: 'BadOrch', type: 'Inst.Hit' },
    { name: 'CarmOrch', type: 'Inst.Hit' },
    { name: 'Sho2DOrch', type: 'Inst.Hit' },
    { name: 'V2Orch', type: 'Inst.Hit' },
    { name: 'Suspended', type: 'Inst.Hit' },
    { name: 'Jazz', type: 'Inst.Hit' },
    { name: 'Jazzy', type: 'Inst.Hit' },
    { name: 'Hop', type: 'Inst.Hit' },
    { name: 'OldBrass', type: 'Inst.Hit' },
    { name: 'Record', type: 'Inst.Hit' },
    { name: 'Rave', type: 'Inst.Hit' },
    { name: 'Oldie', type: 'Inst.Hit' },
    { name: 'SAW', type: 'Synth' },
    { name: 'BOOST-SAW', type: 'Synth' },
    { name: 'PULSE', type: 'Synth' },
    { name: 'TRIANGLE', type: 'Synth' },
    { name: 'SINE', type: 'Synth' },
    { name: 'DUAL-SAW', type: 'Synth' },
    { name: 'DUAL-SQU', type: 'Synth' },
    { name: 'DUAL-TRI', type: 'Synth' },
    { name: 'DUAL-SINE', type: 'Synth' },
    { name: 'OCT-SAW', type: 'Synth' },
    { name: 'OCT-SQU', type: 'Synth' },
    { name: 'OCT-TRI', type: 'Synth' },
    { name: 'OCT-SINE', type: 'Synth' },
    { name: 'UNI-SAW', type: 'Synth' },
    { name: 'UNI-SQU', type: 'Synth' },
    { name: 'UNI-TRI', type: 'Synth' },
    { name: 'UNI-SINE', type: 'Synth' },
    { name: 'SYNC-SAW', type: 'Synth' },
    { name: 'SYNC-SQU', type: 'Synth' },
    { name: 'SYNC-TRI', type: 'Synth' },
    { name: 'SYNC-SINE', type: 'Synth' },
    { name: 'CHIP-TRI 1', type: 'Synth' },
    { name: 'CHIP-TRI 2', type: 'Synth' },
    { name: 'CHIP-PULSE', type: 'Synth' },
    { name: 'CHIP-NOISE', type: 'Synth' },
    { name: 'RING-SAW', type: 'Synth' },
    { name: 'RING-SQU', type: 'Synth' },
    { name: 'RING-TRI', type: 'Synth' },
    { name: 'RING-SINE', type: 'Synth' },
    { name: 'X-SAW 1', type: 'Synth' },
    { name: 'X-SAW 2', type: 'Synth' },
    { name: 'X-SQUARE 1', type: 'Synth' },
    { name: 'X-SQUARE 2', type: 'Synth' },
    { name: 'X-TRI 1', type: 'Synth' },
    { name: 'X-TRI 2', type: 'Synth' },
    { name: 'X-SINE 1', type: 'Synth' },
    { name: 'X-SINE 2', type: 'Synth' },
    { name: 'VPM-SAW', type: 'Synth' },
    { name: 'VPM-SQUARE', type: 'Synth' },
    { name: 'VPM-TRI', type: 'Synth' },
    { name: 'VPM-SINE 1', type: 'Synth' },
    { name: 'VPM-SINE 2', type: 'Synth' },
    { name: 'VPM-SINE 3', type: 'Synth' },
    { name: 'VPM-SINE 4', type: 'Synth' },
    { name: 'SYN-SINE 1', type: 'Synth' },
    { name: 'SYN-SINE 2', type: 'Synth' },
    { name: 'SYN-SINE 3', type: 'Synth' },
    { name: 'SYN-SINE 4', type: 'Synth' },
    { name: 'SYN-SINE 5', type: 'Synth' },
    { name: 'SYN-SINE 6', type: 'Synth' },
    { name: 'SYN-SINE 7', type: 'Synth' },
    { name: 'HPF NOISE', type: 'Synth' },
    { name: 'LPF NOISE', type: 'Synth' },
    { name: 'LOFI NOISE', type: 'Synth' },
    { name: 'RES NOISE', type: 'Synth' },
    { name: 'M1 Piano', type: 'Instrument' },
    { name: 'E.P.Roads', type: 'Instrument' },
    { name: 'E.P.Wurly', type: 'Instrument' },
    { name: 'Clav', type: 'Instrument' },
    { name: 'M1 Organ', type: 'Instrument' },
    { name: 'Brass Ens.', type: 'Instrument' },
    { name: 'Tenor Sax', type: 'Instrument' },
    { name: 'Alto Sax', type: 'Instrument' },
    { name: 'Strings Ens.', type: 'Instrument' },
    { name: 'Strings Pizz', type: 'Instrument' },
    { name: 'Vox Pop Ah', type: 'Instrument' },
    { name: 'Vox Pad', type: 'Instrument' },
    { name: 'Vox Helium', type: 'Instrument' },
    { name: 'A.Bass', type: 'Instrument' },
    { name: 'E.Bass Finger', type: 'Instrument' },
    { name: 'E.Bass Pick', type: 'Instrument' },
    { name: 'E.Bass Slap', type: 'Instrument' },
    { name: 'E.Bass Dist.', type: 'Instrument' },
    { name: 'A.Guitar', type: 'Instrument' },
    { name: 'E.Guitar1', type: 'Instrument' },
    { name: 'E.Guitar2', type: 'Instrument' },
    { name: 'Kalimba', type: 'Instrument' },
    { name: 'Metal Bell', type: 'Instrument' },
    { name: 'GamelanWave', type: 'Instrument' },
    { name: 'Bell1', type: 'Instrument' },
    { name: 'Bell2', type: 'Instrument' },
    { name: 'Bell3', type: 'Instrument' },
    { name: 'Bell4', type: 'Instrument' },
    { name: 'Audio In', type: 'Audio In' },
];

const FILTER = [
    { name: 'OFF', type: 'OFF' },
    { name: 'electribe LPF', type: 'LPF' },
    { name: 'MS20 LPF', type: 'LPF' },
    { name: 'MG LPF', type: 'LPF' },
    { name: 'P5 LPF', type: 'LPF' },
    { name: 'OB LPF', type: 'LPF' },
    { name: 'Acid LPF', type: 'LPF' },
    { name: 'electribe HPF', type: 'HPF' },
    { name: 'MS20 HPF', type: 'HPF' },
    { name: 'P5 HPF', type: 'HPF' },
    { name: 'OB HPF', type: 'HPF' },
    { name: 'Acid HPF', type: 'HPF' },
    { name: 'electribe BPF', type: 'BPF' },
    { name: 'MS20 BPF', type: 'BPF' },
    { name: 'P5 BPF', type: 'BPF' },
    { name: 'OB BPF', type: 'BPF' },
    { name: 'Acid BPF', type: 'BPF' },
];

const MOD = [
    {
        name: 'EG+ Filter',
        source: 'AD Envelope (positive)',
        destination: 'Filter Cutoff',
        bpmSync: false,
        keySync: false,
    },
    {
        name: 'EG+ Pitch',
        source: 'AD Envelope (positive)',
        destination: 'Oscillator Pitch',
        bpmSync: false,
        keySync: false,
    },
    {
        name: 'EG+ OSC',
        source: 'AD Envelope (positive)',
        destination: 'Oscillator Edit',
        bpmSync: false,
        keySync: false,
    },
    {
        name: 'EG+ Level',
        source: 'AD Envelope (positive)',
        destination: 'Amp Level',
        bpmSync: false,
        keySync: false,
    },
    {
        name: 'EG+ Pan',
        source: 'AD Envelope (positive)',
        destination: 'Pan',
        bpmSync: false,
        keySync: false,
    },
    {
        name: 'EG+ IFX',
        source: 'AD Envelope (positive)',
        destination: 'IFX Edit',
        bpmSync: false,
        keySync: false,
    },
    {
        name: 'EG+ BPM Filter',
        source: 'AD Envelope (positive)',
        destination: 'Filter Cutoff',
        bpmSync: true,
        keySync: false,
    },
    {
        name: 'EG+ BPM Pitch',
        source: 'AD Envelope (positive)',
        destination: 'Oscillator Pitch',
        bpmSync: true,
        keySync: false,
    },
    {
        name: 'EG+ BPM OSC',
        source: 'AD Envelope (positive)',
        destination: 'Oscillator Edit',
        bpmSync: true,
        keySync: false,
    },
    {
        name: 'EG+ BPM Level',
        source: 'AD Envelope (positive)',
        destination: 'Amp Level',
        bpmSync: true,
        keySync: false,
    },
    {
        name: 'EG+ BPM Pan',
        source: 'AD Envelope (positive)',
        destination: 'Pan',
        bpmSync: true,
        keySync: false,
    },
    {
        name: 'EG+ BPM IFX',
        source: 'AD Envelope (positive)',
        destination: 'IFX Edit',
        bpmSync: true,
        keySync: false,
    },
    {
        name: 'EG- Filter',
        source: 'AD Envelope (negative)',
        destination: 'Filter Cutoff',
        bpmSync: false,
        keySync: false,
    },
    {
        name: 'EG- Pitch',
        source: 'AD Envelope (negative)',
        destination: 'Oscillator Pitch',
        bpmSync: false,
        keySync: false,
    },
    {
        name: 'EG- OSC',
        source: 'AD Envelope (negative)',
        destination: 'Oscillator Edit',
        bpmSync: false,
        keySync: false,
    },
    {
        name: 'EG- Level',
        source: 'AD Envelope (negative)',
        destination: 'Amp Level',
        bpmSync: false,
        keySync: false,
    },
    {
        name: 'EG- Pan',
        source: 'AD Envelope (negative)',
        destination: 'Pan',
        bpmSync: false,
        keySync: false,
    },
    {
        name: 'EG- IFX',
        source: 'AD Envelope (negative)',
        destination: 'IFX Edit',
        bpmSync: false,
        keySync: false,
    },
    {
        name: 'EG- BPM Filter',
        source: 'AD Envelope (negative)',
        destination: 'Filter Cutoff',
        bpmSync: true,
        keySync: false,
    },
    {
        name: 'EG- BPM Pitch',
        source: 'AD Envelope (negative)',
        destination: 'Oscillator Pitch',
        bpmSync: true,
        keySync: false,
    },
    {
        name: 'EG- BPM OSC',
        source: 'AD Envelope (negative)',
        destination: 'Oscillator Edit',
        bpmSync: true,
        keySync: false,
    },
    {
        name: 'EG- BPM Level',
        source: 'AD Envelope (negative)',
        destination: 'Amp Level',
        bpmSync: true,
        keySync: false,
    },
    {
        name: 'EG- BPM Pan',
        source: 'AD Envelope (negative)',
        destination: 'Pan',
        bpmSync: true,
        keySync: false,
    },
    {
        name: 'EG- BPM IFX',
        source: 'AD Envelope (negative)',
        destination: 'IFX Edit',
        bpmSync: true,
        keySync: false,
    },
    {
        name: 'LFOTri Filter',
        source: 'LFO (triangle)',
        destination: 'Filter Cutoff',
        bpmSync: false,
        keySync: false,
    },
    {
        name: 'LFOTri Pitch',
        source: 'LFO (triangle)',
        destination: 'Oscillator Pitch',
        bpmSync: false,
        keySync: false,
    },
    {
        name: 'LFOTri OSC',
        source: 'LFO (triangle)',
        destination: 'Oscillator Edit',
        bpmSync: false,
        keySync: false,
    },
    {
        name: 'LFOTri Level',
        source: 'LFO (triangle)',
        destination: 'Amp Level',
        bpmSync: false,
        keySync: false,
    },
    {
        name: 'LFOTri Pan',
        source: 'LFO (triangle)',
        destination: 'Pan',
        bpmSync: false,
        keySync: false,
    },
    {
        name: 'LFOTri IFX',
        source: 'LFO (triangle)',
        destination: 'IFX Edit',
        bpmSync: false,
        keySync: false,
    },
    {
        name: 'LFOTriB Filter',
        source: 'LFO (triangle)',
        destination: 'Filter Cutoff',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'LFOTriB Pitch',
        source: 'LFO (triangle)',
        destination: 'Oscillator Pitch',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'LFOTriB OSC',
        source: 'LFO (triangle)',
        destination: 'Oscillator Edit',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'LFOTriB Level',
        source: 'LFO (triangle)',
        destination: 'Amp Level',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'LFOTriB Pan',
        source: 'LFO (triangle)',
        destination: 'Pan',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'LFOTriB IFX',
        source: 'LFO (triangle)',
        destination: 'IFX Edit',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SawUpB Filter',
        source: 'LFO (up-saw)',
        destination: 'Filter Cutoff',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SawUpB Pitch',
        source: 'LFO (up-saw)',
        destination: 'Oscillator Pitch',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SawUpB OSC',
        source: 'LFO (up-saw)',
        destination: 'Oscillator Edit',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SawUpB Level',
        source: 'LFO (up-saw)',
        destination: 'Amp Level',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SawUpB Pan',
        source: 'LFO (up-saw)',
        destination: 'Pan',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SawUpB IFX',
        source: 'LFO (up-saw)',
        destination: 'IFX Edit',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SawDwnB Filter',
        source: 'LFO (down-saw)',
        destination: 'Filter Cutoff',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SawDwnB Pitch',
        source: 'LFO (down-saw)',
        destination: 'Oscillator Pitch',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SawDwnB OSC',
        source: 'LFO (down-saw)',
        destination: 'Oscillator Edit',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SawDwnB Level',
        source: 'LFO (down-saw)',
        destination: 'Amp Level',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SawDwnB Pan',
        source: 'LFO (down-saw)',
        destination: 'Pan',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SawDwnB IFX',
        source: 'LFO (down-saw)',
        destination: 'IFX Edit',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SquUpB Filter',
        source: 'LFO (up-square)',
        destination: 'Filter Cutoff',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SquUpB Pitch',
        source: 'LFO (up-square)',
        destination: 'Oscillator Pitch',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SquUpB OSC',
        source: 'LFO (up-square)',
        destination: 'Oscillator Edit',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SquUpB Level',
        source: 'LFO (up-square)',
        destination: 'Amp Level',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SquUpB Pan',
        source: 'LFO (up-square)',
        destination: 'Pan',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SquUpB IFX',
        source: 'LFO (up-square)',
        destination: 'IFX Edit',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SquDwnB Filter',
        source: 'LFO (down-square)',
        destination: 'Filter Cutoff',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SquDwnB Pitch',
        source: 'LFO (down-square)',
        destination: 'Oscillator Pitch',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SquDwnB OSC',
        source: 'LFO (down-square)',
        destination: 'Oscillator Edit',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SquDwnB Level',
        source: 'LFO (down-square)',
        destination: 'Amp Level',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SquDwnB Pan',
        source: 'LFO (down-square)',
        destination: 'Pan',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'SquDwnB IFX',
        source: 'LFO (down-square)',
        destination: 'IFX Edit',
        bpmSync: true,
        keySync: true,
    },
    {
        name: 'S&HBPM Filter',
        source: 'LFO (sample & hold)',
        destination: 'Filter Cutoff',
        bpmSync: true,
        keySync: false,
    },
    {
        name: 'S&HBPM Pitch',
        source: 'LFO (sample & hold)',
        destination: 'Oscillator Pitch',
        bpmSync: true,
        keySync: false,
    },
    {
        name: 'S&HBPM OSC',
        source: 'LFO (sample & hold)',
        destination: 'Oscillator Edit',
        bpmSync: true,
        keySync: false,
    },
    {
        name: 'S&HBPM Level',
        source: 'LFO (sample & hold)',
        destination: 'Amp Level',
        bpmSync: true,
        keySync: false,
    },
    {
        name: 'S&HBPM Pan',
        source: 'LFO (sample & hold)',
        destination: 'Pan',
        bpmSync: true,
        keySync: false,
    },
    {
        name: 'S&HBPM IFX',
        source: 'LFO (sample & hold)',
        destination: 'IFX Edit',
        bpmSync: true,
        keySync: false,
    },
    {
        name: 'Random Filter',
        source: 'LFO (random)',
        destination: 'Filter Cutoff',
        bpmSync: false,
        keySync: false,
    },
    {
        name: 'Random Pitch',
        source: 'LFO (random)',
        destination: 'Oscillator Pitch',
        bpmSync: false,
        keySync: false,
    },
    {
        name: 'Random OSC',
        source: 'LFO (random)',
        destination: 'Oscillator Edit',
        bpmSync: false,
        keySync: false,
    },
    {
        name: 'Random Level',
        source: 'LFO (random)',
        destination: 'Amp Level',
        bpmSync: false,
        keySync: false,
    },
    {
        name: 'Random Pan',
        source: 'LFO (random)',
        destination: 'Pan',
        bpmSync: false,
        keySync: false,
    },
    {
        name: 'Random IFX',
        source: 'LFO (random)',
        destination: 'IFX Edit',
        bpmSync: false,
        keySync: false,
    },
];

const IFX = [
    'Punch',
    'Overdrive',
    'Distortion',
    'Decimator',
    'Bit Crusher',
    'Ring Modulator',
    'Sustainer',
    'Limiter',
    'Low EQ',
    'Mid EQ',
    'High EQ',
    'Radio EQ',
    'Exciter',
    'Low Pass Filter',
    'High Pass Filter',
    'Band Plus Filter',
    'Talk Filter',
    'Delay 1/4',
    'Delay 3/16',
    'Delay 1/8',
    'Delay 1/16',
    'Roller 1/32',
    'One Delay',
    'Short Delay',
    'Ring Delay 1',
    'Ring Delay 2',
    'Chorus',
    'Flanger LFO',
    'Flanger +',
    'Flanger -',
    'Phaser LFO 1',
    'Phaser LFO 2',
    'Phaser Manual',
    'Tremolo',
    'Off Beater',
    'Pumper',
    'Repeater',
    'Slicer',
];

function parsePattern(rawData) {
    const data = [...rawData];

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
        mfxId: data[77] + 1,
        alternate13_14: !!data[85],
        alternate15_16: !!data[86],
        chainTo: data[17269] + (data[17263] && 128),
        chainRepeat: data[17272],
        mfxHold: !!data[82],
        // last step is per part
        // groove is per s
    };

    event.onPatternData({ pattern, data });

    for (let partId = 0; partId < 16; partId++) {
        const part = parsePart(data, partId);
        // console.log({ part });
        // console.log(`part ${partId}`, part.osc);
        // console.log(`part ${partId}`, part.cutoff);
        // console.log(`part ${partId}`, part.ifx);
    }

    // console.log(parsePart(data, 1));
    console.log(parsePart(data, 7));

    return pattern;
}

function parsePart(data, partId) {
    // part2 many stuff wrong
    // part4

    const START_POS = [
        [2357, 2360, {}], // part 1
        [
            3290,
            3293,
            {
                oscEditPos: 0,
                filterPos: 1,
                modPos: 6,
                modDepthPos: 8,
                modSpeedPos: 7,
                ampEGpos: 17,
                levelPos: 15,
                ifxOnPos: 24,
                ifxPos: 25,
            },
        ], // part 2
        [4222, 4225, { modPos: 7 }], // part 3
        [
            5155,
            5158,
            { modDepthPos: 8, modSpeedPos: 7, levelPos: 15, ifxOnPos: 24 },
        ], // part 4
        [6088, 6090, { glidePos: 31, pitchPos: 30, egInt: 6, modPos: 7 }], // part 5
        [7020, 7023, { modPos: 6, modSpeedPos: 7, levelPos: 15 }], // part 6
        [
            7953,
            7955,
            {
                pitchPos: 30,
                glidePos: 31,
                resPos: 5,
                egInt: 6,
                modPos: 7,
                decayReleasePos: 13,
            },
        ], // part 7
        [8885, 8888, { modPos: 6 }], // part 8
        [9818, 9821, {}], // part 9
        [10750, 10753, {}], // part 10
        [11683, 11686, {}], // part 11
        [12616, 12618, {}], // part 12
        [13548, 13551, {}], // part 13
        [14481, 14483, {}], // part 14
        [15413, 15416, {}], // part 15
        [16346, 16349, {}], // part 16
    ];

    const WEIRD_OSC_POS = [
        [32, -6, 1],
        [4, -3, 1],
        [64, -7, 2],
        [8, -4, 1],
        [1, -1, 1],
        [16, -5, 1],
        [2, -2, 1],
    ];
    const [, weirdoA, weirdoB] = WEIRD_OSC_POS[partId % 7];

    const [
        oscPos,
        pos,
        {
            oscEditPos = 1,
            modPos = 10,
            modDepthPos = 9,
            modSpeedPos = 8,
            levelPos = 16,
            ifxOnPos = 25,
            ifxPos = 26,
            ifxEditPos = 27,
            filterPos = 2,
            ampEGpos = 18,
            glidePos = 30,
            pitchPos = 29,
            egInt = 5,
            resPos = 4,
            decayReleasePos = 12,
        },
    ] = START_POS[partId];
    // console.log('part', partId, ':', pos + modPos);

    const oscId =
        data[oscPos] +
        (data[oscPos + weirdoA] && 128) +
        (data[oscPos + weirdoB] && 256);
    const part = {
        name: `part ${partId + 1}`,
        oscId: oscId + 1,
        osc: OSC[oscId],
        oscEdit: data[pos + oscEditPos],
        pitch:
            data[pos + pitchPos] > 64
                ? data[pos + pitchPos] - 128
                : data[pos + pitchPos],
        glide: data[pos + glidePos],
        filterId: data[pos + filterPos],
        filter: FILTER[data[pos + filterPos]],
        cutoff: data[pos + 3],
        resonance: data[pos + resPos],
        egInt:
            data[pos + egInt] > 64
                ? data[pos + egInt] - 128
                : data[pos + egInt],
        modulationId: data[pos + modPos] + 1,
        modulation: MOD[data[pos + modPos]],
        modSpeed: data[pos + modSpeedPos],
        modDepth: data[pos + modDepthPos],
        mfxSend: !!data[pos + 19],
        ampEG: !!data[pos + ampEGpos],
        level: data[pos + levelPos],
        pan:
            data[pos + 17] === 0
                ? 'center'
                : data[pos + 17] > 64
                ? `L ${data[pos + 17] * -1 + 128}`
                : `R ${data[pos + 17]}`,
        attack: data[pos + 11],
        decayRelease: data[pos + decayReleasePos],
        ifxOn: !!data[pos + ifxOnPos],
        ifxId: data[pos + ifxPos] + 1,
        ifx: IFX[data[pos + ifxPos]],
        ifxEdit: data[pos + ifxEditPos],
    };

    return part;
}
