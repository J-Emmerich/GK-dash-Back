export class ErrorResponse extends Error {
  route: string;
  statusCode: number;
  message: string;
  constructor(message: string, statusCode: number, route = "not defined") {
    super(message);
    this.statusCode = statusCode;
    this.route = route;
  }
}
