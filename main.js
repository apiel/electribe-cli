const midi = require("midi");

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
input.on("message", (deltaTime, message) => {
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
output.sendMessage([0xf0, 0x42, 0x30, 0, 1, 0x23, 0x10,0xf7]);

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

function parsePattern(rawData) {
  const data = [...rawData];
  const name = data
      .slice(26, 43)
      .filter((c, k) => c && k != 13) // data[39], here 13, is used for tempo ? kind of weird...
      .map((c) => String.fromCharCode(c))
      .join('');

  const tempo = data[46] + data[48] * 256 + (data[39] ? 128 : 0);
  console.log({
      name,
      tempo,
  });
}
