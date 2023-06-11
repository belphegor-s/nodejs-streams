import { Readable, Writable } from "stream";

const readableStream = new Readable({
    highWaterMark: 2, // in bytes -> act as threshold after 2 bytes it will work but in optimised way, default is 64KB size
    read() {},
    // objectMode: true (if true can push objects and highWaterMark is now defined as number of max threshold objects)
});

readableStream.on('data', (chunk) => {
    console.log('Data Buffer -> ', chunk);
    console.log('Data String -> ', chunk.toString());
})

console.log(readableStream.push('nincompoop')) // since input is greater than 2 bytes above highwater mark will return --> false

console.log(readableStream.push({
    name: 'ayush'
}))

// ☝️ Comment above
console.log(readableStream.push('a'))
// if the input string is less than 2 bytes will return --> true

const writableStream = new Writable({
    write(s: string) {
        console.log(`Writing -> ${s}`);
    }
    // or write: function() {}
})

writableStream.write('hello') // can use inside readable stream on data

