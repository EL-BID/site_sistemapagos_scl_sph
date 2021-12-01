import axios from "axios";

export async function getPaymentsCount(data: any): Promise<any> {
  try {
    const response = await axios.get(`/payments/count`, {
      params: { where: data }
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error.data);
    }
  }
}

export async function generatePayments(data: any): Promise<any> {
  try {
    const response = await axios.post(`/payments/generate`, data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error.data);
    }
  }
}
