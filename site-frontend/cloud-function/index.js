const fs = require('fs');

exports.static = (req, res) => {
    let path = `.${req.path}`;
    if (!fs.existsSync(path) || path === '/index.js') {
        res.status(404).send('Resource not found');
        return;
    }
    const stat = fs.lstatSync(path);
    if (stat.isDirectory()) {
        path += 'index.html';
    }
    if (path.endsWith('.js')) {
        res.set({
            'Cache-Control': 'public, max-age=31536000',
            'Content-Type': 'application/javascript'
        });
    } else if (path.endsWith('.html')) {
        res.set({
            'Cache-Control': 'no-store',
            'Content-Type': 'text/html'
        });
    }
    const response = fs.readFileSync(path);
    res.status(200).send(response);
}
