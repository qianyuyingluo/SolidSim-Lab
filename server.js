const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 10001;

const server = http.createServer((req, res) => {
    console.log(`请求: ${req.url}`);
    
    let filePath;
    
    // 处理根路径
    if (req.url === '/') {
        // 尝试多个可能的首页文件
        const possibleIndexFiles = ['index.html', 'index.htm', 'index', 'main.html', 'home.html'];
        
        function tryIndexFile(index) {
            if (index >= possibleIndexFiles.length) {
                // 如果没有找到首页文件，显示当前目录列表
                fs.readdir(__dirname, (err, files) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Server Error');
                        return;
                    }
                    
                    const fileList = files.map(file => {
                        const isDir = fs.statSync(path.join(__dirname, file)).isDirectory();
                        return `<li><a href="/${file}${isDir ? '/' : ''}">${file}${isDir ? '/' : ''}</a></li>`;
                    }).join('');
                    
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>文件列表</title>
                            <style>
                                body { font-family: monospace; margin: 40px; }
                                a { text-decoration: none; color: #0066cc; }
                                a:hover { text-decoration: underline; }
                            </style>
                        </head>
                        <body>
                            <h1>📁 文件列表</h1>
                            <ul>${fileList}</ul>
                            <hr>
                            <p>请点击上面的文件访问</p>
                        </body>
                        </html>
                    `);
                });
                return;
            }
            
            const testPath = path.join(__dirname, possibleIndexFiles[index]);
            fs.access(testPath, fs.constants.F_OK, (err) => {
                if (err) {
                    tryIndexFile(index + 1);
                } else {
                    serveFile(testPath, res);
                }
            });
        }
        
        tryIndexFile(0);
    } else {
        // 处理其他路径
        filePath = path.join(__dirname, req.url);
        serveFile(filePath, res);
    }
});

function serveFile(filePath, res) {
    fs.stat(filePath, (err, stats) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <h1>404 - 文件未找到</h1>
                <p>请求路径: ${filePath}</p>
                <p><a href="/">返回首页</a></p>
            `);
            return;
        }
        
        if (stats.isDirectory()) {
            // 如果是目录，尝试找该目录下的index文件
            const indexPath = path.join(filePath, 'index');
            fs.access(indexPath, fs.constants.F_OK, (err) => {
                if (err) {
                    res.writeHead(404);
                    res.end('Directory listing not allowed');
                } else {
                    fs.readFile(indexPath, (err, data) => {
                        if (err) {
                            res.writeHead(500);
                            res.end('Server Error');
                        } else {
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(data);
                        }
                    });
                }
            });
        } else {
            // 读取文件
            const ext = path.extname(filePath);
            const contentTypes = {
                '.html': 'text/html',
                '.css': 'text/css',
                '.js': 'application/javascript',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.gif': 'image/gif',
                '.txt': 'text/plain',
                '': 'text/html'  // 无扩展名文件当作HTML
            };
            
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end('读取文件错误');
                } else {
                    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
                    res.end(data);
                }
            });
        }
    });
}

function getLocalIP() {
    const os = require('os');
    const interfaces = os.networkInterfaces();
    
    for (let name in interfaces) {
        for (let iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

server.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log('\n=================================');
    console.log('✅ 静态文件服务器已启动');
    console.log('=================================');
    console.log(`📱 本机访问: http://localhost:${PORT}`);
    console.log(`🌐 局域网访问: http://${localIP}:${PORT}`);
    console.log('=================================');
    console.log('提示：如果看到404，请访问 http://localhost:10001/ 查看文件列表');
    console.log('按 Ctrl+C 停止服务器\n');
});