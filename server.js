const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./database");

const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

/* Swagger Setup */

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Product API",
            version: "1.0.0",
            description: "Product Management API"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: ["./server.js"]
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/products:
 *  get:
 *    summary: Get all products
 */
app.get("/api/products", (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        res.json(rows);
    });
});

/**
 * @swagger
 * /api/products:
 *  post:
 *    summary: Create product
 */
app.post("/api/products", (req, res) => {

    const { name, price, description } = req.body;

    db.run(
        "INSERT INTO products(name,price,description) VALUES(?,?,?)",
        [name, price, description],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({ id: this.lastID });
        }
    );
});

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *    summary: Update product
 */
app.put("/api/products/:id", (req, res) => {

    const { name, price, description } = req.body;
    const id = req.params.id;

    db.run(
        "UPDATE products SET name=?,price=?,description=? WHERE id=?",
        [name, price, description, id],
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({ message: "Product updated" });
        }
    );
});

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *    summary: Delete product
 */
app.delete("/api/products/:id", (req, res) => {

    const id = req.params.id;

    db.run(
        "DELETE FROM products WHERE id=?",
        id,
        function (err) {
            if (err) return res.status(500).json(err);
            res.json({ message: "Product deleted" });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server running http://localhost:${PORT}`);
});