const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "API for Locazon",
    description:
      "This is the documentation for the Locazon API that is available to experiment with the common APIs for seller and users under the category default",
  },
  host: "localhost:3000",
  schemes: ["http"],
  tags: [
    {
      name: "Users",
      description:
        "This is the endpoint for all things related to user directly.",
    },
    {
      name: "Sellers",
      description:
        "This is the endpoint for all things related to sellers directly.",
    },
    {
      name: "Orders",
      description:
        "This is the endpoint for all things related to orders directly.",
    },
    {
      name: "Products",
      description:
        "This is the endpoint for all things related to products directly.",
    },
  ],
};

const outputFile = "./swagger_output.json";
const endpointsFiles = [
  "./routes/auth.js",
  "./routes/authSeller.js",
  "./routes/order.js",
  "./routes/product.js",
];

swaggerAutogen(outputFile, endpointsFiles, doc);
