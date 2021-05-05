const http = require('http');  //sama dengan import pada react js
const fs = require('fs')  // untuk memanipulasi file
const url = require('url')
const PORT = 2022

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        // Jika param = / atau home
        if (req.method == "GET") {
            res.writeHead(200, { "Content-Type": "text/html" })
            res.end("<h2>Hello Intro</h2>")
        }
    } else if (req.url.includes('/products')) {
        let products = JSON.parse(fs.readFileSync('./data/products.json'))
        // console.log(JSON.parse(products)) // JSON.parse = merubah format data string atau buffer menjadi format data object
        console.log(url.parse(req.url, true).query.idproduct)
        // mengelola data products
        if (req.method == "GET") {
            // mencari data berdasarkan idproduct
            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify(products)) //JSON.stringify = merubah format data object menjadi format data string/buffer
        } else if (req.method == "POST") {
            let body = []
            req.on('data', (chunk) => {
                console.log("data dari FE :", chunk)
                body.push(chunk)
            }).on('end', () => {
                console.log(body)
                body = Buffer.concat(body).toString()
                console.log(body)
                products.push(JSON.parse(body))
                fs.writeFileSync('./data/products.json', JSON.stringify(products))
                res.writeHead(201, { "Content-Type": "application/json" })
                res.end(fs.readFileSync('./data/products.json'))
            })
        } else if (req.method == "PUT") {
            let queryId = url.parse(req.url, true).query.idproduct
            if (queryId) {
                let body = []
                req.on('data', (chunk) => {
                    body.push(chunk)
                }).on('end', () => {
                    body = JSON.parse(Buffer.concat(body).toString())
                    let idx = products.findIndex(item => item.id == queryId)
                    if (idx < 0) {
                        res.writeHead(500, { "Content-Type": "text/html" })
                        res.end("Product Tidak Ada")
                    }
                    products[idx] = body
                    fs.writeFileSync('./data/products.json', JSON.stringify(products))

                    res.writeHead(200, { "Content-Type": "application/json" })
                    // mengirim data terbaru dari file json
                    res.end(fs.readFileSync('./data/products.json'))
                })
            } else {
                res.writeHead(500, { "Content-Type": "text/html" })
                res.end("Idproduct undefined")
            }
        } else if (req.method == "PATCH") {
            let queryId = url.parse(req.url, true).query.idproduct
            if (queryId) {
                let body = []
                req.on('data', (chunk) => {
                    body.push(chunk)
                }).on('end', () => {
                    body = JSON.parse(Buffer.concat(body).toString())
                    let idx = products.findIndex(item => item.id == queryId)
                    if (idx < 0) {
                        res.writeHead(500, { "Content-Type": "text/html" })
                        res.end("Product Tidak Ada")
                    }
                    // mengecek properti data yg sama menggunakan looping object
                    for (let prop in products[idx]) {
                        for (let bodyProp in body) {
                            console.log("property products",prop, " property body:", bodyProp)
                            if (prop == bodyProp) {
                                products[idx][prop] = body[bodyProp]
                            }
                        }
                    }
                    fs.writeFileSync('./data/products.json', JSON.stringify(products))

                    res.writeHead(200, { "Content-Type": "application/json" })
                    // mengirim data terbaru dari file json
                    res.end(fs.readFileSync('./data/products.json'))
                })
            } else {
                res.writeHead(500, { "Content-Type": "text/html" })
                res.end("Idproduct undefined")
            }
        } else if (req.method == "DELETE") {
            let queryId = url.parse(req.url, true).query.idproduct
            if (queryId) {
                let idx = products.findIndex(item => item.id == queryId)
                if (idx < 0) {
                    res.writeHead(500, { "Content-Type": "text/html" })
                    res.end("Product Tidak Ada")
                }
                products.splice(idx, 1)
                // menulis ulang data pada file products.json
                fs.writeFileSync('./data/products.json', JSON.stringify(products))

                res.writeHead(200, { "Content-Type": "application/json" })
                // mengirim data terbaru dari file json
                res.end(fs.readFileSync('./data/products.json'))
            } else {
                res.writeHead(500, { "Content-Type": "text/html" })
                res.end("Idproduct undefined")
            }
        }
    } else {
        if (req.method == "GET") {
            res.writeHead(404, { "Content-Type": "text/html" })
            res.end("<h2>Page Not Found</h2>")
        }
    }

})

server.listen(PORT, () => console.log(`Server Running at ${PORT}`))


/*
Latihan API
1. Buat API untuk register user, dengan data yang disimpan adalah email, password dan status 'Active'
2. Jika ada email yg sama maka registrasi gagal, dan user akan mendapat pesan jika email sudah ada
3. Buat API untuk login user, dimana nantinya data email dan password akan dikirim melalui query url
4. Buat API untuk delete akun, jika dihapus makan status akun berubah menjadi 'Non-Active'
*/ 