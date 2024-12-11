import * as dayjs from "dayjs";
import * as advancedFormat from "dayjs/plugin/advancedFormat";

export function formatDate(dateToParse) {
  const date = new Date(dateToParse);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const dateAsString = `${day}/${month}/${year}`;
  return dateAsString;
}

dayjs.extend(advancedFormat);

export const dayjsFormat = (dateAsString) =>
  dayjs(dateAsString, "DD/MM/YYYY").format();
