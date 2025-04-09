const Laptop = require('../models/Laptop');

// Create new laptop with image URLs from Cloudinary
exports.createLaptop = async (req, res) => {
  try {
    if (!req.body.images || req.body.images.length === 0) {
      return res.status(400).json({
        message: 'Please provide at least one image URL'
      });
    }
    
    const laptop = await Laptop.create({
      ...req.body,
      addedBy: req.user._id
    });

    res.status(201).json({
      status: 'success',
      data: { laptop }
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating laptop',
      error: error.message
    });
  }
};

// Get all laptops
exports.getAllLaptops = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build filter query
        const query = {};

        // Search functionality
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { manufacturer: { $regex: req.query.search, $options: 'i' } },
                { categories: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } },
                { brand: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Filter by brand
        if (req.query.brand) {
            query.brand = { $regex: req.query.brand, $options: 'i' };
        }

        // Filter by price range
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
        }

        // Filter by category
        if (req.query.category) {
            query.category = { $regex: req.query.category, $options: 'i' };
        }

        // Filter by processor
        if (req.query.processor) {
            query.processor = { $regex: req.query.processor, $options: 'i' };
        }

        // Filter by RAM range
        if (req.query.minRam || req.query.maxRam) {
            query.ram = {};
            if (req.query.minRam) query.ram.$gte = parseInt(req.query.minRam);
            if (req.query.maxRam) query.ram.$lte = parseInt(req.query.maxRam);
        }

        // Filter by stock status
        if (req.query.inStock === 'true') {
            query.inStock = true;
        }

        const [laptops, total] = await Promise.all([
            Laptop.find(query).skip(skip).limit(limit),
            Laptop.countDocuments(query)
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                laptops,
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

// Get single laptop
exports.getLaptop = async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id)
      .populate('addedBy', 'email');

    if (!laptop) {
      return res.status(404).json({
        message: 'Laptop not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: { laptop }
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error fetching laptop',
      error: error.message
    });
  }
};

// Update laptop with image URLs support
exports.updateLaptop = async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);
    if (!laptop) {
      return res.status(404).json({
        message: 'Laptop not found'
      });
    }

    // Check if user has permission to update
    if (req.user.role !== 'master' && 
        laptop.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You do not have permission to update this laptop'
      });
    }
    
    // Validate images if provided
    if (req.body.images && (!Array.isArray(req.body.images) || req.body.images.length === 0)) {
      return res.status(400).json({
        message: 'Please provide at least one image URL'
      });
    }

    // Update laptop
    Object.assign(laptop, req.body);
    await laptop.save();

    res.status(200).json({
      status: 'success',
      data: { laptop }
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating laptop',
      error: error.message
    });
  }
};

// Delete laptop
exports.deleteLaptop = async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);
    if (!laptop) {
      return res.status(404).json({
        message: 'Laptop not found'
      });
    }

    // Check if user has permission to delete
    if (req.user.role !== 'master' && 
        laptop.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You do not have permission to delete this laptop'
      });
    }

    await laptop.deleteOne();

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error deleting laptop',
      error: error.message
    });
  }
};