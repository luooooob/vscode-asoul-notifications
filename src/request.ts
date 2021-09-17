
import axios from "axios";
import type { RequstOptions } from "./types";

export const request = async <R>({ url }: RequstOptions): Promise<R> => {
  return axios.get(url).then(res => res.data);
};

