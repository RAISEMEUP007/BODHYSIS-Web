import { API_URL } from "../constants/AppConstants"

export const printReservation = (reservationId) => {
  location.href = API_URL + "/reservations/exportpdf/"+reservationId
}