import { Model } from "mongoose";

export async function cleanAndLog(model : Model<any>) {
    const result = await model.deleteMany({});
    const found = await model.find({});
    console.log(found);
    console.log(result);
  }
  