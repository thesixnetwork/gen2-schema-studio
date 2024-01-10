import { useEffect } from "react";
import Swal, { SweetAlertIcon } from "sweetalert2";

const AlertModal = ({ title, type }: { title: string; type: string }) => {
  const showSuccessAlert = () => {
    Swal.fire({
      position: "center",
      title: title,
      showConfirmButton: false,
      timer: 1500,
      icon: type as SweetAlertIcon,
      background: "rgba(0, 0, 0, 0.6)",
      color: "#fff",
      iconColor: "#fff",
    });
  };

  useEffect(() => {
    showSuccessAlert();
    console.log(">>>", title);
  }, [title, type]);

  return null;
};

export default AlertModal;
