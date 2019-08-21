import { AppError } from "./app-error";
export class NotFoundError extends AppError {
  constructor() {
    window.location.href = "index.html";
    super();
  }
}
