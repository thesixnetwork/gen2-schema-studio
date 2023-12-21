import Swal from "sweetalert2";
import { useState } from "react";

interface ConfirmModalProps {
  Texthead: string;
}

// import ENV from "@/utils/ENV";
// import axios from "axios";
// import { ISchemaInfo, ItokenAttributes } from "@/type/Nftmngr";

export async function ConfirmModal(
  Texthead: string,
) {
  const result = await Swal.fire({
    title: Texthead,
    width: 600,
    padding: "3em",
    color: "#716add",
    background: "#000",
    backdrop: `
      rgba(0,0,123,0.4)
      url("https://sweetalert2.github.io/images/nyan-cat.gif")
      left top
      no-repeat
    `,
    showCancelButton: true,
  });

  // Handle the result (user confirmation)
  if (result.isConfirmed) {
    return true;
  } else {
    return false;
  }
}
