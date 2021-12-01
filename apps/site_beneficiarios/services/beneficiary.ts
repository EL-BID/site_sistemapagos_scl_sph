import axios from "axios";
import { Beneficiary } from "~/types/beneficiary";

export async function getBeneficiaries(data: any): Promise<any> {
  try {
    const response = await axios.post(`/beneficiaries2`, data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error.data);
    }
  }
}


export async function getBeneficiariesCount(data: any): Promise<any> {
  try {
    const response = await axios.post(`/beneficiaries/count`, data);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error.data);
    }
  }
}

export async function getBeneficiariesById(
  id: any,
  filter: any
): Promise<Beneficiary | undefined> {
  try {
    const response = await axios.get(`/beneficiaries/` + id, {
      params: { filter: filter }
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

export async function updateBeneficiariesById(
  id: any,
  formData: any
): Promise<any> {
  try {
    const response = await axios.patch(`/beneficiaries/` + id, formData);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(error.data);
    }
  }
}
