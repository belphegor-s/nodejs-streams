import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 8080;

import http from "http";
import fs from "fs";
import path from "path";
import { Transform, pipeline } from "stream";

const server = http.createServer((req, res) => {
    const file = fs.readFileSync(path.join(__dirname, "data", "sample.txt"), 'utf-8');

    if(req.url === '/') {
        res.end('Server is live')
    } else if(req.url === '/file') {
        // res.end(file)
        const readableStream = fs.createReadStream(path.join(__dirname, "data", "sample.txt"), 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        readableStream.pipe(res)
    }

    // Copy Big Files ->
    const readStream = fs.createReadStream(path.join(__dirname, "data", "sample.txt"), 'utf-8');
    const writeStream = fs.createWriteStream(path.join(__dirname, "data", "output.txt"), 'utf-8');

    readStream.on('data', (chunk) => {
        // console.log(chunk);
        // writeStream.write(chunk);
    })

    // String Processing
    const sampleFileStream = fs.createReadStream(path.join(__dirname, "data", "sample.txt"), 'utf-8')
    const outputWritableStream = fs.createWriteStream(path.join(__dirname, "data", "output-processed.txt"), 'utf-8')


    // sampleFileStream.on('data', (chunk) => {
    //     console.log(`Received Data -> ${chunk}`);

    //     // Process
    //     const upperCaseString = chunk.toString().toUpperCase();
    //     const finalString = upperCaseString.replace(/ipsum/gi, 'SECRET');

    //     // Writable Straem write
    //     outputWritableStream.write(finalString);
    // })

    // OR transform method ->
    const transformStream = new Transform({
        transform(chunk, encoding, callback) {
            // Custom Error Simulation 👇
            // transformStream.emit('error', new Error(`Something went wrong!`))
            
            // console.log('Chunk -> ', chunk.toString());
            const finalString = chunk.toString().replace(/ipsum/gi, 'SECRET');
            callback(null, finalString); // 1st param is error since no error -> null
        }
    })

    


    // One Way
    // sampleFileStream.pipe(transformStream).on('error', (err) => {
    //     console.log(err)
    // }).pipe(outputWritableStream).on('error', (err) => {
    //     console.log(err)
    // })

    // Better Approach
    pipeline(sampleFileStream, transformStream, outputWritableStream, (err) => {
        if(err) {
            console.log(`Error Occured -> ${err}`)
        }
    })
    sampleFileStream.pipe(transformStream).pipe(outputWritableStream)
});

server.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));