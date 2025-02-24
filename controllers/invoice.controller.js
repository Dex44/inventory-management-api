const { Op } = require("sequelize");
const InvoiceService = require("../services/invoice.service");
const ProductService = require("../services/product.service");

exports.createInvoice = async (req, res) => {  
    try {
      const invoiceData = {
        created_by: req.body.created_by,
        amount: req.body.amount,
        client_id: req.body.client_id,
        products: req.body.products,
      approved_by: req.body.approved_by,
        is_approved: req.body.is_approved || false,
      };
  
      const invoice = await InvoiceService.createInvoice(invoiceData);
  
      return res.json({
        data: invoice,
        message: "invoice created successfully.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Error creating invoice.",
      });
    }
  };

  exports.updateInvoice = async (req, res) => {
    const isExist = await InvoiceService.findById(req.body.id);
    if (!isExist) {
      return res.status(400).json({
        message: "Invoice does not exists.",
      });
    }
    const invoiceData = {
      amount: req.body.amount,
      approved_by: req.body.approved_by,
      is_approved: req.body.is_approved,
      products: req.body.products,
    };
  
    await InvoiceService.updateInvoice(invoiceData, req.body.id);
    return res.json({
      message: "Invoice updated successfully.",
    });
  };

  exports.getInvoice = async (req, res) => {
    try {
        const { clientId, page = 1, limit = 10 } = req.body;
        
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (clientId) whereClause.client_id = clientId;
        
        const invoices = await InvoiceService.findAndCountAll(whereClause,limit,offset)

        const productIds = await invoices.rows.flatMap(inv => inv.products || []);

        const products = await ProductService.findAll({ product_id: { [Op.in]: productIds } })
        
        const productMap = {};
        products.forEach(product => {
          productMap[product.product_id] = product;
        });
        
        const response = invoices.rows.map(inv => ({
          ...inv.toJSON(),
          products: (inv.products || []).map(id => productMap[id] || null).filter(p => p)
        }));

        return res.json({
            data: response,
            total: invoices.count,
            currentPage: page,
            totalPages: Math.ceil(invoices.count / limit),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching invoices." });
    }
  };