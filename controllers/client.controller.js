const ClientService = require("../services/client.service");


exports.createClient = async (req, res) => {
    const isExist = await ClientService.findClient(req.body.name);
    if (isExist) {
      return res.status(400).json({
        message: "Same client already exists.",
      });
    }
  
    try {
      const clientData = {
        name: req.body.name,
        mobile: req.body.mobile,
        email: req.body.email,
        address: req.body.address,
      };
  
      const client = await ClientService.createClient(clientData);
  
      return res.json({
        data: client,
        message: "Client created successfully.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Error creating client.",
      });
    }
  };

  exports.updateClient = async (req, res) => {
    const isExist = await ClientService.findClientById(req.body.id);
    if (!isExist) {
      return res.status(400).json({
        message: "Client does not exists.",
      });
    }
    const clientData = {
      name: req.body.name,
      mobile: req.body.mobile,
      email: req.body.email,
      address: req.body.address,
    };
  
    await ClientService.updateClient(clientData, req.body.id);
    return res.json({
      message: "Client updated successfully.",
    });
  };

  exports.deleteClient = async (req, res) => {
    const isExist = await ClientService.findClientById(req.body.id);
    if (!isExist) {
      return res.status(400).json({
        message: "Client does not exists.",
      });
    }
  
    await ClientService.deleteClient(req.body.id);
    return res.json({
      message: "Client deleted successfully.",
    });
  };

  exports.listClients = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.body; // Default values: page 1, 10 users per page
      const offset = (page - 1) * limit;
  
      const clients = await ClientService.getClientDetailsWithPagination(limit, offset);
  
      if (!clients) {
        return res.status(400).json({
          message: "No clients found.",
        });
      }
  
      const totalClients = await ClientService.getTotalClientCount();
  
      return res.json({
        data: clients,
        pagination: {
          total: totalClients,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalClients / limit),
        },
        message: "Success.",
      });
    } catch (error) {
      console.error("Error fetching clients:", error);
      return res.status(500).json({ message: "Internal Server Error." });
    }
  };