import express from "express";
import logger from "./logger.js";
import morgan from "morgan";

const app = express();

const port = 3000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Sever started at port number ${port}`);
});

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

let teaCollection = [];

// Get All Teas
app.get("/teas", (req, res) => {
  logger.info("Get request is made!");
  res.status(200).send(teaCollection);
});

// Get A Tea
app.get("/teas/:id", (req, res) => {
  logger.info("Get request is made!");
  const teaId = parseInt(req.params.id);
  if (teaId < 0 || teaId > teaCollection.length) {
    return res.status(404);
  }
  console.log(teaCollection[teaId]);

  res.status(200).send(teaCollection[teaId]);
});

// Add tea
app.post("/teas", (req, res) => {
  logger.info("Tea is added!");
  const { name, price } = req.body;
  const tea = {
    name,
    price,
  };
  if (!tea) {
    return res.status(404);
  }
  teaCollection.push(tea);
  res.status(201).send(tea);
});

// Update Tea
app.put("/teas/:id", (req, res) => {
  logger.info("Tea is updated!");
  const teaId = parseInt(req.params.id);
  if (teaId < 0 || teaId >= teaCollection.length) {
    return res.status(404);
  }
  const { name, price } = req.body;
  const tea = {
    price,
    name,
  };
  if (name === undefined && price === undefined) {
    return res.status(400);
  }
  teaCollection[teaId] = tea;
  res.status(200).send(tea);
});

// Delete Tea
app.delete("/teas/:id", (req, res) => {
  logger.warn("Tea is deleted!");
  const teaId = parseInt(req.params.id);
  if (teaId < 0 || teaId >= teaCollection.length) {
    return res.status(404);
  }
  teaCollection.splice(teaId, 1);
  res.status(200).send(teaCollection[teaId]);
});
