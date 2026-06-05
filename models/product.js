// In-memory store — holds all Product instances for the lifetime of the server process
const products = [];
const rootDir = require('../util/path')
const fs = require('fs')
const path = require('path');
const Cart = require('./cart');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
        const content = fileContent.toString().trim();
        cb(content ? JSON.parse(content) : []);
    }
  });
};

module.exports = class Product {

    // products = []
    // Creates a new Product instance and assigns the title property
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }



    // Persists the current product instance to products.json.
    // Reads the existing file first to preserve previously saved products,
    // then appends this instance and writes the updated array back.
    // If the file is missing or empty, it starts fresh with an empty array.
    save() {
        getProductsFromFile(products => {
            console.log('this.id', this.id);
            
            if (this.id) {
                const existingProductIndex = products.findIndex(
                    prod => prod.id === this.id
                );
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                    console.log(err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), err => {
                    console.log(err);
                });
            }
        });
    }

    static deleteById(productId) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === productId);
            const filteredProducts = products.filter(p => p.id !== productId)
            console.log('filteredProducts',filteredProducts);
            fs.writeFile(p, JSON.stringify(filteredProducts), err => {
                if (!err) {
                    Cart.deleteProduct(productId, product.price);
                }
            });
        })
    }

    // Reads all products from products.json and passes them to the callback.
    // Called as Product.fetchAll(cb) — static means no instance is needed.
    // If the file is missing or empty, the callback receives an empty array
    // so the rest of the app never has to handle a null/undefined products list.
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    // Loads entire product list from disk on every call; no caching or indexing.
    // Uses callback instead of Promise — cb receives undefined if id is not found.
    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        })
    }
}
