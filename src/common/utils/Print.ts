import { API_URL } from "../constants/AppConstants"

export const printReservation = (reservationId, mode=1, tc?:boolean) => {
  if(mode = 1) window.open(API_URL + "/reservations/exportpdf/" + reservationId+"/"+tc, "_blank");
  else location.href = API_URL + "/reservations/exportpdf/"+reservationId
}