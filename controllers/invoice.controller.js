const InvoiceService = require("../services/invoice.service");

exports.createInvoice = async (req, res) => {  
    try {
      const invoiceData = {
        created_by: req.body.created_by,
        amount: req.body.amount,
        client_id: req.body.client_id,
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

  exports.updateClient = async (req, res) => {
    const isExist = await InvoiceService.findById(req.body.id);
    if (!isExist) {
      return res.status(400).json({
        message: "Invoice does not exists.",
      });
    }
    const invoiceData = {
      amount: req.body.amount,
      approved_by: req.body.approved_by,
      is_approved: true,
    };
  
    await InvoiceService.updateInvoice(invoiceData, req.body.id);
    return res.json({
      message: "Invoice updated successfully.",
    });
  };

  exports.getClient = async (req, res) => {
    try {
        const { clientId, page = 1, limit = 10 } = req.body;
        
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (clientId) whereClause.client_id = clientId;
        
        const invoices = await InvoiceService.findAndCountAll(whereClause,limit,offset)

        return res.json({
            data: invoices.rows,
            total: invoices.count,
            currentPage: page,
            totalPages: Math.ceil(invoices.count / limit),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching invoices." });
    }
  };