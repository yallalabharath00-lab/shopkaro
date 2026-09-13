import express from "express";
import jwt from "jsonwebtoken";
import Cart from "../models/Cart.js";

const router = express.Router();

// ===============================
// AUTHENTICATION MIDDLEWARE
// ===============================

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;

    next();
  } catch (error) {
    console.error("JWT ERROR:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// ===============================
// GET USER CART
// ===============================

router.get("/", protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.userId,
    }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({
        user: req.userId,
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("GET CART ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get cart",
    });
  }
});

// ===============================
// ADD PRODUCT TO CART
// ===============================

router.post("/add", protect, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    let cart = await Cart.findOne({
      user: req.userId,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.userId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
      });
    }

    await cart.save();

    cart = await cart.populate("items.product");

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    console.error("ADD CART ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
});

// ===============================
// UPDATE CART ITEM QUANTITY
// ===============================

router.put("/update", protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
      });
    }

    const cart = await Cart.findOne({
      user: req.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) =>
        item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    if (Number(quantity) <= 0) {
      cart.items = cart.items.filter(
        (item) =>
          item.product.toString() !== productId
      );
    } else {
      item.quantity = Number(quantity);
    }

    await cart.save();

    const updatedCart = await Cart.findOne({
      user: req.userId,
    }).populate("items.product");

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("UPDATE CART ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
});

// ===============================
// REMOVE PRODUCT FROM CART
// ===============================

router.delete("/remove/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        item.product.toString() !== productId
    );

    await cart.save();

    const updatedCart = await Cart.findOne({
      user: req.userId,
    }).populate("items.product");

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("REMOVE CART ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove product",
    });
  }
});

// ===============================
// CLEAR CART
// ===============================

router.delete("/clear", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart,
    });
  } catch (error) {
    console.error("CLEAR CART ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
});

export default router;