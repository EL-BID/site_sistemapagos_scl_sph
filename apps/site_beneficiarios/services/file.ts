import axios from "axios";
import { StatusFile } from "~/types/statusFile";
import { File } from "../types/file";

export async function postFile(formData: any): Promise<StatusFile | undefined> {
  try {
    const response = await axios.post(`/files`, formData);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error.data);
    }
  }
}

export async function getFileById(id: any): Promise<File | undefined> {
  try {
    const response = await axios.get(`/files/` + id);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error.data);
    }
  }
}

export async function getDownloadFileByBank(
  bankname: any,
  data: any
): Promise<File | undefined> {
  try {
    const response = await axios.post(`/download/banks`,  data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error.data);
    }
  }
}

export async function getDownloadFileCentralBank(
  data: any
): Promise<File | undefined> {
  try {
    const response = await axios.post(`/download/centralbank`,  data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error.data);
    }
  }
}
