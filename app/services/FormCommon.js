import { GetDate, todayDate } from "./DateTimeService";
import { checkFile } from "./ValidationService";
// import { AgGridReact } from "ag-grid-react";
// import { getToken } from "../services/useLocalstorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

export const previewImage = (
  fileData,
  selector,
  extension_arr = ["jpg", "jpeg", "png"]
) => {
  try {
    const file = fileData;
    const preview = document.querySelector(`${selector}`);
    if (file && selector && checkFile(file?.name, extension_arr)) {
      //Preview the image
      console.log("File previewed");
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => {
          preview.src = reader?.result;
        },
        true
      );
      reader.readAsDataURL(file);
      return true;
    } else {
      //Don't preview the image
      console.log("File preview rejected");
      preview.src = "";
      return false;
    }
  } catch (err) {
    console.log(err);
    preview.src = "";
    return false;
  }
};

export const removeImage = (selector) => {
  try {
    document.querySelector(`${selector}`).src = "";
    return true;
  } catch (err) {
    console.log(`${err}`);
    return false;
  }
};

export const isValidJson = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const exportToCsv = (myref) => {
  try {
    myref?.current?.api?.exportDataAsCsv();
  } catch (err) {
    console.log(err);
  }
};

export const showOverlay = (myRef) => {
  try {
    myRef?.current?.api?.showLoadingOverlay();
  } catch (err) {
    console.log(err);
  }
};

// export const AuthHeader = (additional_header_object = null) => {
//   try {
//     const header = { ["authorization"]: `bearer ${getToken()}` };
//     if (additional_header_object) {
//       const new_header = { ...header, ...additional_header_object };
//       return new_header;
//     } else {
//       return header;
//     }
//   } catch (err) {
//     console.log(err);
//     return "";
//   }
// };

export const loadingTemplate = (value = "Loading...") =>
  `<span class="ag-overlay-loading-center">${value}</span>`;
export const notFoundTemplate = (value = "Not found") => `Not found`;

export const ActionButtonJsx = () =>    <FontAwesomeIcon icon={faEllipsisVertical} />;

export const actionButtonObject = {
  file_details: "File Details",
  project_details: "Project Details",
  file_expense: "File Expense",
  file_todo: "Todo",
  delete: "Remove",
  edit: "Edit",
  preview_expense: "Preview Expense",
  
  preview_emp :"Preview"
};

  export const PdfStyleSheet = {
    body: {
      // position: "relative",

      // paddingTop: 35,
      paddingBottom: 65,
      // paddingHorizontal: 35,
    },
    myPageStyle: {
      paddingHorizontal: 35,
    },
    header: {
      fontSize: 12,
      marginBottom: 10,
      textAlign: "center",
      color: "grey",
    },
    pageNumber: {
      position: "absolute",
      fontSize: 5,
      bottom: 40,
      left: 0,
      right: 0,
      textAlign: "center",
      color: "grey",
    },
    pageNumberText: {
      bottom: 15,
      fontSize: 10, // Adjust the font size as needed
    },
    // table: {
    //     display: "table",
    //     width: "100%",
    //     borderRightWidth: 0,
    //     borderBottomWidth: 0,
    //     marginBottom: 30,
    // },
    table: {
      display: "table",
      width: "100%",
      borderRightWidth: 0,
      borderBottomWidth: 0,
      marginBottom: 30,
      tableLayout: "fixed",
      position: "relative",
      zIndex: 1,
      borderLeftWidth: 1,
      // borderTopWidth: 1,

    },
  
  

    tableRow: {
      display: "table-row",
      flexDirection: "row",
      // borderStyle: "solid",
      // borderLeftWidth: 1,
      borderTopWidth: 0.8,
      width: "100%",
      // clear: "both",
      // Remove the pageBreakInside property
    },

    // tableRow: {
    //     display: "table-row",
    //     flexDirection: "row",
    //     borderStyle: "solid",
    //     borderLeftWidth: 1,
    //     borderTopWidth: 1,
    //     width: "100%",
    //     clear: "both",
    //     pageBreakInside: "avoid",
    //   },

    tableCol: {
      width: "25%",
      // borderStyle: "solid",    
      borderWidth: 0.8,
      borderLeftWidth: 0,
      marginBottom: 1,
      borderTopWidth: 0,
      float: "left",
      padding:0.5,
      // fontWeight:"bold"
      // display: "table-column",
    },
    tableCell: {
      margin: "auto",
      // marginTop: 1,
      width: "auto",
      marginBottom: 5,
      fontSize: 10,
      padding:1,
    
    },
    imageHeaderBorder: {
      width: "100%",
      left: 0,
      top: 0,
      right: 0,
      marginBottom: 5,
    },
    imageHeader: {
      height: "52px",
      width: "100px",
      marginBottom: 5,
      // marginTop: 10,
      left: 0,
      right: 0,
      textAlign: "center",
    },
    imageFooter: {
      // position: "fixed",
      position: 'absolute',
      // bottom: 50,
      bottom:40,
      left: 0,
      right: 0,
      textAlign: "center",
      zIndex: 2,
      pageBreakBefore: "always",
    },

    // imageFooter: {
    //     position: 'absolute',
    //     bottom: 30,
    //     left: 0,
    //     right: 0,
    //     textAlign: 'center',
    // },
    PdfInfoSection: {
      marginBottom: 8,
      display: "flex",
      justifyContent: "space-between",
    },
    
  };

export const displayFormData = (formData) => {
  try {
    if (typeof formData == "object") {
      console.log("Displaying formData:");
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}-${pair[1]}`);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const SanitizeDate = (date_value, format = "YYYY-MM-DD") => {
  try {
    return date_value ? GetDate(date_value, format) : todayDate();
  } catch (err) {
    console.log(err);
    return todayDate();
  }
};

export const subtractTwoDates = (d1, d2) => {
  try {
    const date1 = new Date(d1);
    const date2 = new Date(d2);

    var diff = date2 - date1;
    var diffInDays = diff / (1000 * 3600 * 24);

    return parseInt(Math.abs(diffInDays));
  } catch (err) {
    console.log(err);
    return "-";
  }
};
