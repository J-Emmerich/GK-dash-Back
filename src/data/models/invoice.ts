/* eslint-disable no-param-reassign */
import { Schema, Types, model } from "mongoose";

import { formatDate } from "@utilities";

const invoiceSchema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  invoiceOwners: [{ type: Schema.Types.ObjectId, ref: "Customer" }],
  invoiceNumber: String,
  invoiceDate: Date,
  orderNumber: String,
  articles: [
    {
      articleId: String,
      articleName: String,
      pricePerUnit: Types.Decimal128,
      isIncludedIVA: Boolean,
      quantity: Number,
      totalPrice: Types.Decimal128,
      vat: Number,
    },
  ],
  invoiceTotal: Types.Decimal128,
  invoiceSubTotal: Types.Decimal128,
  invoiceTax: Types.Decimal128,
  customerNameOnInvoice: String,
  pathToInvoiceFile: String,
});

invoiceSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.articles = returnedObject.articles.map((article) => {
      article.totalPrice = article.totalPrice
        ? article.totalPrice.toString()
        : "";
      article.pricePerUnit = article.pricePerUnit
        ? article.pricePerUnit.toString()
        : "";
      return article;
    });
    returnedObject.invoiceTotal = returnedObject.invoiceTotal
      ? returnedObject.invoiceTotal.toString()
      : "";
    returnedObject.invoiceSubTotal = returnedObject.invoiceSubTotal
      ? returnedObject.invoiceSubTotal.toString()
      : "";
    returnedObject.invoiceTax = returnedObject.invoiceTax
      ? returnedObject.invoiceTax.toString()
      : "";
    returnedObject.invoiceTax = returnedObject.invoiceTax
      ? returnedObject.invoiceTax.toString()
      : "";
    returnedObject.invoiceDate = formatDate(returnedObject.invoiceDate);
  },
});

export const Invoice = model("Invoice", invoiceSchema);
