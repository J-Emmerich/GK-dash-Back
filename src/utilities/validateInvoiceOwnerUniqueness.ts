import { Types } from "mongoose";

export const validateInvoiceOwnerUniqueness = (
  owners: Types.ObjectId[]
): Types.ObjectId[] => {
  let ownersArray: string[] | Types.ObjectId[] = owners.map((owner) =>
    owner.toString()
  );
  console.log(ownersArray);
  const ownersSet: Set<string> = new Set(ownersArray);
  console.log(ownersSet);
  ownersArray = Array.from(ownersSet).map((owner) => new Types.ObjectId(owner));
  return ownersArray;
};
