const axios = require('axios');
const sourceMapLib = require('source-map');
const { parseStackTrace, transformFrame, stringifyStackTrace } = require('./util/stack-trace');

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
      const { stackTrace, sourceMap } = req.body;
      const { data } = await axios.get(sourceMap);
      const consumer = await new sourceMapLib.SourceMapConsumer(data);
      const parsedStackTrace = parseStackTrace(stackTrace).map(frame => transformFrame(frame, consumer));
      res.status(200).send({ 
        trace: stringifyStackTrace(parsedStackTrace)
      });
    } catch (e) {
      res.status(400).send({ message: e.message });
    }
}
