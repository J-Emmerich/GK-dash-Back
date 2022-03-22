const path = require("path");
const {
  fetchInvoices,
  fetchInvoice,
  saveInvoice,
  editInvoice,
  deleteInvoice,
} = require("../use-cases/invoice-use-cases");

const saveToPdf = require("../helpers/save-to-pdf");
const { dayjsFormat } = require("../helpers/format-date");

const root = path.join(__dirname, "../../client/output");

module.exports = (methods) => {
  async function fetchOne(req, res, next) {
    try {
      const { user } = req;
      const { id } = req.params;
      const invoice = await fetchInvoice(methods, id, user);
      res.status(200).json({ success: true, data: invoice });
    } catch (err) {
      next(err);
    }
  }

  async function fetchAll(req, res, next) {
    try {
      const { user } = req;
      const invoices = await fetchInvoices(methods, user);
      res.status(200).json({ success: true, data: invoices });
    } catch (err) {
      console.log("fetchAll");
      next(err);
    }
  }

  async function saveOne(req, res, next) {
    try {
      const { user } = req;
      const newInvoice = req.body;
      const date = dayjsFormat(newInvoice.invoiceDate);
      newInvoice.invoiceDate = date;
      newInvoice.projectId = user.currentProject;
      const invoice = await saveInvoice(methods, newInvoice, user);
      res.status(204).json({ success: true, data: invoice });
    } catch (err) {
      next(err);
    }
  }
  async function editOne(req, res, next) {
    try {
      const { user } = req;
      const { id } = req.params;
      const newInvoice = req.body;

      const editedInvoice = await editInvoice(methods, newInvoice, id, user);
      res.status(200).json({ success: true, data: editedInvoice });
    } catch (err) {
      next(err);
    }
  }

  async function deleteOne(req, res, next) {
    try {
      const { user } = req;
      const { id } = req.params;
      await deleteInvoice(methods, id, user);
      res.status(200).json({ success: true, data: "deleted" });
    } catch (err) {
      next(err);
    }
  }

  async function fetchPdf(req, res, next) {
    try {
      const { user } = req;
      const { id } = req.params;
      const invoice = await fetchInvoice(methods, id, user);
      await saveToPdf(id, invoice.invoiceNumber, req.token); // File System
      res.download(`${root}/${invoice.invoiceNumber}.pdf`);
    } catch (err) {
      next(err);
    }
  }
  return { fetchAll, fetchOne, saveOne, editOne, deleteOne, fetchPdf };
};
