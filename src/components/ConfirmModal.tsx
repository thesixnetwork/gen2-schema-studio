import Swal from "sweetalert2";
import { useState } from "react";

interface ConfirmModalProps {
  Texthead: string;
}

// import ENV from "@/utils/ENV";
// import axios from "axios";
// import { ISchemaInfo, ItokenAttributes } from "@/type/Nftmngr";
//// action  {"Dploy Testnet","Dploy Mainnet", "Save"}
export async function ConfirmModal(Texthead: string, action: string) {
  console.log(action)
  if (action === "Deploy Testnet") {
    const result = await Swal.fire({
      title: "Are you sure to Deploy Testnet ?",
      width: 600,
      icon: "warning",
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

  if (action === "Deploy Mainnet") {
    const result = await Swal.fire({
      title: Texthead,
      width: 600,
      icon: "warning",
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


  if (action === "Save") {
    const result = await Swal.fire({
      title: Texthead,
      width: 600,
      icon: "warning",
      padding: "3em",
      color: "#fff",
      background: "#000",
      showCancelButton: true,
    });

    // Handle the result (user confirmation)
    if (result.isConfirmed) {
      return true;
    } else {
      return false;
    }
  }

  if (action === "Error") {
    Swal.fire({
      position: "center",
      icon: "error",
      title: Texthead || "Something went wrong",
      color: "#fff",
      background: "#000",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  if (action === "Cancle") {
    const result = await Swal.fire({
      position: "center",
      icon: "error",
      title: Texthead || "Something went wrong",
      color: "#fff",
      background: "#000",
      showCancelButton: true,
      showConfirmButton: true,
    });

    if (result.isConfirmed) {
      return true;
    } else {
      return false;
    }
  }
}
