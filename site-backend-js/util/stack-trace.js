const urlRegex = require('url-regex');

module.exports.parseStackTrace = stackTrace => stackTrace.split(' at ')
    .map(frame => { 
        let sourcePartOne = null;
        let sourcePartTwo = null;
        let line = null;
        let column = null;
        let name = null;
        const hasSource = urlRegex().test(frame);
        if (hasSource) {
            [sourcePartOne, sourcePartTwo, line, column] = /[^\s]+$/.exec(frame.trim().replace(/[()]/g, ''))[0].split(/:/);
            name = /^[^\s]+/.exec(frame.trim())[0];
        }
        return {
            raw: frame,
            source: hasSource ? [sourcePartOne, sourcePartTwo].join(':') : null,
            line: parseInt(line, 10),
            column: parseInt(column, 10),
            name: name !== frame ? name : null
        }
    });

module.exports.transformFrame = (frame, consumer) => {
    const mappedFrame = consumer.originalPositionFor({ 
        line: frame.line, 
        column: frame.column 
    });
    return {
        ...frame,
        ...mappedFrame,
        originalName: frame.name,
        originalSource: frame.source,
        originalLine: frame.line,
        originalColumn: frame.column,
    }
};

module.exports.stringifyStackTrace = stackTrace => stackTrace.map(frame => {
    const { name, raw, originalName, originalLine, originalColumn, line, column, originalSource, source } = frame;
    let stringifiedFrame = raw.replace(
        `${originalSource}:${originalLine}:${originalColumn}`,
        `${source}:${line}:${column}`
    );
    if (originalName) {
        stringifiedFrame = stringifiedFrame.replace(originalName, name)
    }
    return stringifiedFrame;
}).join('\n at ')
