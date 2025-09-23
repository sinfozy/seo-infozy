import axios, { AxiosError } from "axios";

import { toast } from "sonner";

export const sendError = (err: AxiosError | Error) => {
  if (axios.isAxiosError(err)) {
    toast.error(err.response?.data.message || err.message);
  } else {
    toast.error(err.message);
  }
};
