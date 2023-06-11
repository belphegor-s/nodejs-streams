# Streams

Streams are used for efficient data transfer such that the program uses RAM efficiently. Consider an example of sending a super big file and you have limited amount of RAM, sending that much big file will lead to quickly fill up the memory.

`Sender -> Memory <- Receiver`

Streams divide the data into small chunks (by creating a readable stream), and loads it into buffer.

**Buffer →** A small chunk of memory, pauses the stream if the buffer is full.

### Downloading big files →

**************************Wrong way →**************************

```tsx
if(req.url === '/') {
	res.end('Server is live');
} if(req.url === '/file') {
	res.end(file);

	// Good Way
	const readableStream = fs.createReadStream(path.join(__dirname, "data", "sample.txt"), 'utf-8');
  readableStream.pipe(res)
}
```

`req` → request (Readable Stream)

`res` → response (Writable Stream)

**********************************Piping →********************************** `readbableStream` → `writableStream`

```tsx
// Copy Big Files ->
const readStream = fs.createReadStream(path.join(__dirname, "data", "sample.txt"), 'utf-8');
const writeStream = fs.createWriteStream(path.join(__dirname, "data", "output.txt"), 'utf-8');

readStream.on('data', (chunk) => {
    // console.log(chunk);
    writeStream.write(chunk);
})
```

### Custom Streams →

************************Readable →************************

```tsx
import { Readable } from "stream";

const readableStream = new Readable({
    highWaterMark: 2, // in bytes -> act as threshold after 2 bytes it will work but in optimised way, default is 64KB size
    read() {}
});

readableStream.on('data', (chunk) => {
    console.log('Data Buffer -> ', chunk);
    console.log('Data String -> ', chunk.toString());
})

console.log(readableStream.push('nincompoop')) // since input is greater than 2 bytes above highwater mark will return --> false

// ☝️ Comment above
console.log(readableStream.push('a'))
// if the input string is less than 2 bytes will return --> true
```

************************Writable →************************

```tsx
import { Writable } from "stream";

const writableStream = new Writable({
    write(s: string) {
        console.log(`Writing -> ${s}`);
    }
    // or write: function() {}
})

writableStream.write('hello') // can use inside readable stream on data
```

### String Processing →

```tsx
// String Processing
const sampleFileStream = fs.createReadStream(path.join(__dirname, "data", "sample.txt"), 'utf-8')
const outputWritableStream = fs.createWriteStream(path.join(__dirname, "data", "output-processed.txt"), 'utf-8')

sampleFileStream.on('data', (chunk) => {
    console.log(`Received Data -> ${chunk}`);

    // Process
    const upperCaseString = chunk.toString().toUpperCase();
    const finalString = upperCaseString.replace(/ipsum/gi, 'SECRET');

    // Writable Straem write
    outputWritableStream.write(finalString);
})
```

****************************************Transform Stream →****************************************

```tsx
import { Transform } from "stream";

// OR transform method ->
const transformStream = new Transform({
    transform(chunk, encoding, callback) {
        console.log('Chunk -> ', chunk.toString());
        const finalString = chunk.toString().replace(/ipsum/gi, 'SECRET');
        callback(null, finalString); // 1st param is error since no error -> null
    }
})

sampleFileStream.pipe(transformStream).pipe(outputWritableStream)
```

******************************************Error Handling via `pipeline` →**

```tsx
import { pipeline } from "stream";

pipeline(sampleFileStream, transformStream, outputWritableStream, (err) => {
    if(err) {
        console.log(`Error Occured -> ${err}`)
    }
})
```

********************************************Object Mode in Streams →********************************************

```tsx
const readableStream = new Readable({
    highWaterMark: 2, // in bytes -> act as threshold after 2 bytes it will work but in optimised way, default is 64KB size
    read() {},
    objectMode: true // (if true can push objects and highWaterMark is now defined as number of max threshold objects)
});
```