const asyncHandler = require("../middleware/async");
const Product = require("../models/Product");
const ErrorResponse = require("../utils/errorResponse");
const path = require("path");
const Seller = require("../models/Seller");
var fs = require("fs");

exports.getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({ success: true, count: products.length, products });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  if (req.params.sellerId) {
    const products = await Product.find({
      productOf: req.params.sellerId,
    });
    res.status(200).json({ message: true, count: products.length, products });
  } else {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorResponse("No such Product with the given id", 401));
    }
    res.status(200).json({ success: true, product });
  }
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.productOf = req.seller.id;
  const product = await Product.create(req.body);

  const seller = await Seller.findByIdAndUpdate(
    req.seller.id,
    {
      $push: { products: product._id },
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true, product, seller });
});

exports.editProduct = asyncHandler(async (req, res, next) => {
  const productFind = await Product.findById(req.params.id);
  if (!productFind) {
    return next(new ErrorResponse("No such Product with the given id", 401));
  }

  //Making sure it is the product seller making changes
  if (req.seller.id !== productFind.productOf.toString()) {
    return next(
      new ErrorResponse(
        `Seller id with id${req.seller.id} not authorised to delete`,
        401
      )
    );
  }
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, product });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorResponse("No such Product with the given id", 401));
  }

  //Making sure it is the product seller making changes
  if (req.seller.id !== product.productOf.toString()) {
    return next(
      new ErrorResponse(
        `Seller id with id${req.seller.id} not authorised to delete`,
        401
      )
    );
  }
  const seller = await Seller.findByIdAndUpdate(
    req.seller.id,
    {
      $pull: { products: product._id },
    },
    { new: true, runValidators: true }
  );

  product.remove();
  res.status(200).json({ success: true, data: {} });
});

exports.productPhotoUpload = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
    );
  }

  //Making sure it is the product seller making changes
  if (req.seller.id !== product.productOf.toString()) {
    return next(
      new ErrorResponse(
        `Seller id with id${req.seller.id} not authorised to upload photos`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${product._id}${path.parse(file.name).ext}`;
  // console.log(file);
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Product.findByIdAndUpdate(req.params.id, { picture: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

exports.productPhotoDelete = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorResponse("No product with this id", 404));
  }

  //Making sure it is the product seller making changes
  if (req.seller.id !== product.productOf.toString()) {
    return next(
      new ErrorResponse(
        `Seller id with id${req.seller.id} not authorised to upload photos`,
        401
      )
    );
  }
  const filePath = `./public/uploads/${product.picture}`;
  // console.log(path.basename(filePath, path.extname(filePath)));
  fs.unlinkSync(filePath);

  const ress = await Product.findById(
    req.params.id,
    {
      picture: "",
    },
    { new: true, runValidators: true }
  );
  res.status(200).json({ success: true, product: ress });
});
