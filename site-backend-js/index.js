const axios = require('axios');
const Busboy = require('busboy');
const sourceMapLib = require('source-map');
const streamToString = require('stream-to-string')
const { parseStackTrace, transformFrame, stringifyStackTrace } = require('./util/stack-trace');

const parseFormData = async req => new Promise((resolve, reject) => {
  const busboy = new Busboy({ headers: req.headers });
  // This object will accumulate all the fields, keyed by their name
  const fields = {};
  // This object will accumulate all the uploaded files, keyed by their name.
  const uploads = {};

  // This code will process each non-file field in the form.
  busboy.on('field', (fieldname, val) => {
    fields[fieldname] = val;
  });

  // This code will process each file uploaded.
  const fileReadPromises = [];
  busboy.on('file', (fieldname, file, filename) => {
    fileReadPromises.push(streamToString(file).then(contents => {
      uploads[fieldname] = {
        name: filename,
        contents
      };
    }));
  });

  // Triggered once all uploaded files are processed by Busboy.
  busboy.on('finish', async () => {
    await Promise.all(fileReadPromises);
    resolve({ fields, uploads })
  });

  busboy.on('error', reject);

  busboy.end(req.rawBody);
});

exports.transform = async (req, res) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    if (req.method === "HEAD" || req.method === 'OPTIONS') {
      res.status(200).send();
      return;
    }
    try {
      const { stackTrace } = req.body;
      let sourceMapContents;
      if (req.headers['content-type'].startsWith('multipart/form-data')) {
        const parsedForm = await parseFormData(req);
      } else {
        const { sourceMap } = req.body
        sourceMapContents = (await axios.get(sourceMap)).data;
      }
      const consumer = await new sourceMapLib.SourceMapConsumer(sourceMapContents);
      const parsedStackTrace = parseStackTrace(stackTrace).map(frame => transformFrame(frame, consumer));
      res.status(200).send({ 
        trace: stringifyStackTrace(parsedStackTrace)
      });
    } catch (e) {
      res.status(400).send({ message: e.message });
    }
}
