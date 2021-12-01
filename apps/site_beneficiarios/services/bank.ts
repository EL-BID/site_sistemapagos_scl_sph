import axios from "axios";

export async function getBanks(): Promise<any> {
  try {
    const response = await axios.get(`/bank-list`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error.data);
    }
  }
}

export async function getBeneficiariesById(id : any): Promise<any> {
  try {
    const response = await axios.get(`/beneficiaries/`  + id);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error.data);
    }
  }
}
