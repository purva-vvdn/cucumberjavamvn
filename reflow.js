import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ResponseConfig from "../../api/responseConfig";
import ApiConfig from "../../api/apiConfig"; // Import the API configuration
import ApiService from "../../api/apiService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Reflow() {
  const navigate = useNavigate();
  const responseConfig = new ResponseConfig();
  const apiService = new ApiService();
  const username = sessionStorage.getItem("username");
  const [operatorid, setOperator_id] = useState("");
  const [serialno, setSerialno] = useState("");
  const [status, setStatus] = useState("");
  const [reworkType, setReworkType] = useState("Correction");
  const [reworkDetailnew, setReworkDetailnew] = useState([]);
  const [failedStage, setfailedStage] = useState("");

  const [errors, setErrors] = useState({
    jarID: "",
    operatorid: "",
    status: "",
    dl: "",
    dt: "",
    component: "",
    description: "",
    reworkType: "",
    batchno: "",
    qrCode: "",
  });
  const [validation, setValidation] = useState(false);
  const [defectlocation, setDefectlocation] = useState("");
  const [defectType, setdefectType] = useState("");
  const [component, setComponent] = useState("");
  const [description, setDescription] = useState("");
  const [reworkDetail, setReworkDetail] = useState({});
  const [details, setDetails] = useState({});
  const [errorMsg, setError] = useState("");
  const [batchNo, setBatchno] = useState("");
  const [stageList, setStageList] = useState([])
  const [form, setForm] = useState({
    qrCode: "",
    partNo: "",
    qty: "",
    batchNo: "",
  });
  const [stage, setStage] = useState("")
  const regexPattern = /^[a-zA-Z0-9]+@[^@]+@[a-zA-Z0-9]+$/;
  const [fields, setFields] = useState(
    { defectLocation: "", defectType: "", description: "-" },
  );
  const [bomDetails,setBomDetails] = useState([])
  const [isAdded, setIsAdded] = useState(false)
  const handleDescriptionChange = (e, index) => {
    console.log("e, index :", e, index);
    const { name, value } = e.target;
    const updatedStages = [...reworkDetailnew];
    updatedStages[index][name] = value;
    setReworkDetailnew(updatedStages);
    console.log("reworkDetail 2 :", reworkDetailnew);
  };

  const handleRemoveField = (item, index) => {
    console.log("handleRemoveField :", item , "index :", index)
    console.log("handleRemoveField rework :",reworkDetailnew)
    setReworkDetailnew(reworkDetailnew.filter((_, i) => i !== index))
    setIsAdded(false)
  }
  const handleAddField = (item, index) => {
    console.log("handleAddField :", item, "index :", index)
    console.log("handleAddField rework :",reworkDetailnew)
    setReworkDetailnew([...reworkDetailnew, fields])
    setIsAdded(true)
  }

  const getBom = () => {
    const payload = {
      "product_id":sessionStorage.getItem('selectedProductID'),
      "stage_id":sessionStorage.getItem("onlineStageId")
    }
    apiService.postRequest(ApiConfig.BOM_GET_STAGEWISE,payload)
      .then((response) => {
        setBomDetails(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const isRowData = (index) => {
    console.log("isRowData :", index , reworkDetailnew.length, reworkDetailnew.length - 1, index == reworkDetailnew.length -1)
    if (isAdded && index > reworkDetailnew.length){
      return isAdded
    }else {
      return isAdded
    }
  }

  useEffect(() => {
    getStageList();
   },[])
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "qrCode") {
      if (value.trim() === "") {
        setErrors({ ...errors, qrCode: "QR Code is required" });
      } else {
        setErrors({ ...errors, qrCode: "" });
      }
      if (regexPattern.test(value)) {
        setErrors({ ...errors, qrCode: "" });
        const details = value.split("@");
        setForm({
          ...form,
          qrCode: value,
          partNo: details[1],
          qty: details[2].replace(/^0+/, ""),
          batchNo: details[0],
        });
      } else {
        setErrors({ ...errors, qrCode: "QR Code is Invalid" });
      }
    }
    // if (name === 'batchno') {
    //   if (value.trim() === '') {
    //     setErrors({ ...errors, batchno: 'Batch No is required' });
    //   } else {
    //     setErrors({ ...errors, batchno: '' });
    //   }
    //   setBatchno(value)
    // }
    if (name === "OperatorID") {
      if (value.trim() === "") {
        setErrors({ ...errors, operatorid: "Scan Jar ID is required" });
      } else {
        setErrors({ ...errors, operatorid: "" });
      }
      setOperator_id(value);
    }
    if (name === "serialno") {
      if (value.trim() === "") {
        setErrors({ ...errors, serialno: "Serial No is required" });
      } else {
        setErrors({ ...errors, serialno: "" });
      }
      setSerialno(value);
      setValidation(false);
    }
    if (name === "status") {
      if (value.trim() === "") {
        setErrors({ ...errors, status: "Status is required" });
      } else {
        setErrors({ ...errors, status: "" });
      }
      setStatus(value);
    }
    if (name === "defectLocation") {
      if (value.trim() === "") {
        setErrors({ ...errors, dl: "Defect Location is required" });
      } else {
        setErrors({ ...errors, dl: "" });
      }
      setDefectlocation(value);
    }
    if (name === "defectType") {
      if (value.trim() === "") {
        setErrors({ ...errors, dt: "Defect Type is required" });
      } else {
        setErrors({ ...errors, dt: "" });
      }
      setdefectType(value);
    }
    if (name === "component") {
      if (value.trim() === "") {
        setErrors({ ...errors, component: "Component is required" });
      } else {
        setErrors({ ...errors, component: "" });
      }
      setComponent(value);
    }
    if (name === "description") {
      if (value.trim() === "") {
        setErrors({ ...errors, description: "Description is required" });
      } else {
        setErrors({ ...errors, description: "" });
      }
      setDescription(value);
    }
    if (name == "reworkType") {
      if (value.trim() === "") {
        setErrors({ ...errors, reworkType: "Rework Type is required" });
      } else {
        setErrors({ ...errors, reworkType: "" });
      }
      setReworkType(value);
    }
    if ( name == "stage") {
      setStage(value)
    }
  };

  const getStageList = () => {
     apiService.getRequest(ApiConfig.LIST_STAGES).then((response) => {
      const filteredData = response.filter(item => !item.offline_stages && !item.name.startsWith("Label Placement & PCB loader") && item.id !== 5 && item.id !== 9);
        setStageList(filteredData)
     })
     .catch((error) => console.log("error :", error))
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (operatorid.trim() === "") {
      newErrors.operatorid = "Operator ID is required";
    }
    // if (description.trim() === "") {
    //   newErrors.description = "Description is required";
    // }
    // if (serialno.trim() === "") {
    //   newErrors.serialno = "Serial No is required";
    // }
    // if (reworkType == "Replace") {
    //   if (form.qrCode.trim() === "") {
    //     newErrors.qrCode = "QR Code is required";
    //   }
    // }
    if (status.trim() === "") {
      newErrors.status = "Status is required";
    }
    if (status == "0") {
      // if (defectlocation.trim() === "") {
      //   newErrors.dl = "Defect Location is required";
      // }
      // if (defectType.trim() === "") {
      //   newErrors.dt = "Defect Type is required";
      // }
      // if (description.trim() === '') {
      //   newErrors.description = 'Description is required';
      // }
      // if (component.trim() === '') {
      //   newErrors.component = 'Component is required';
      // }
    }
    if (Object.values(newErrors).some((error) => error !== "")) {
      setErrors(newErrors);
    } else {
      // var statusPayload;
      // if(status == 'true'){
      //   statusPayload = true
      // }else if(status == 'false'){
      //   statusPayload = false
      // }
      const payload = {
        stage_id: details.stage_id,
        stage_name: details.stage_name,
        product_id: sessionStorage.getItem("selectedProductID"),
        product_name: sessionStorage.getItem("selectProductName"),
        serial_no: serialno,
        status: status,
        operator_id: operatorid,
        created_by: username,
        description: description,
        product_id: details.product_id,
        product_name: details.product_name,
        line_name: details.line_name,
        details: reworkDetailnew,
        reset_stage : parseInt(stage)
        // part_no: form.partNo,
        // quantity: form.qty,
        // batch_no: form.batchNo,
      };
      payload.details.forEach((item) => {
        if (item.qrCode) {
          const qrCodeDetails = item.qrCode.split("@");
          item.partNo = qrCodeDetails[1];
          item.qty = qrCodeDetails[2].replace(/^0+/, "");
          item.batchNo = qrCodeDetails[0];
        }
      });
      apiService
        .postRequest(ApiConfig.createreflow, payload)
        .then((response) => {
          if (response.error) {
            setValidation(false);
            Swal.fire({
              title: response.error,
              icon: "error",
              timer: "2000",
              showConfirmButton: false,
            });
          } else {
            if (response.msg) {
              var successMsg = responseConfig.returnMessage(response.msg);
              Swal.fire({
                title: successMsg,
                icon: "success",
                timer: "2000",
                showConfirmButton: false,
              });
              formReset();
              setValidation(false);
            }
          }
        })
        .catch((error) => {
          Swal.fire({
            title: "Server Error",
            icon: "error",
            timer: "2000",
            showConfirmButton: false,
          });
        });
    }
  };
  const checkStatus = () => {
    var url = ApiConfig.previous_stage_result_reflow + serialno;
    apiService
      .getRequest(url)
      .then((response) => {
        if (response.error) {
          setValidation(false);
          setfailedStage(response.data.stage_name)
          Swal.fire({
            title: response.error,
            icon: "error",
            timer: "2000",
            showConfirmButton: false,
          });
          if (response.data.result == false) {
            setReworkDetailnew(response.data.details);
            console.log("reworkDetail 1:", reworkDetailnew)
            setDetails(response.data);
            setError(response.error);
            setValidation(true);
          }
        } else {
          if (response.msg) {
            if (
              response.data.next_stage_id ==
              sessionStorage.getItem("onlineStageId")
            ) {
              setValidation(true);
            } else {
              setValidation(false);
              Swal.fire({
                title: response.msg,
                icon: "error",
                timer: "4000",
                showConfirmButton: false,
              });
            }
          }
        }
      })
      .catch((error) => {
        console.error("Login Error:", error);
      });
  };

  const formReset = () => {
    // setOperator_id('');
    setSerialno("");
    setStatus("");
    setDefectlocation("");
    setdefectType("");
    setComponent("");
    setDescription("");
    setBatchno("");
    setOperator_id("");
  };
  return (
    <div className="content-area withbtn">
      <div className="page-title">
        <div className="title">
          <h1>Re-Work</h1>
        </div>
      </div>
      <hr></hr>
      <div className="newEntry-fields ">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 col-lg-4">
              <div className="form-group">
                <label>Serial No</label>
                <input
                  type="text"
                  name="serialno"
                  className="form-control floating-input"
                  placeholder="Serial No"
                  value={serialno}
                  onChange={handleInputChange}
                />
                {errors.serialno && (
                  <div className="error">{errors.serialno}</div>
                )}
              </div>
            </div>
            {serialno && !validation && (
              <>
                <div className="col-md-2 col-lg-2">
                  <i
                    class="IC fa fa-check"
                    aria-hidden="true"
                    onClick={checkStatus}
                  ></i>
                </div>
              </>
            )}
            {validation && (
              <>
                <div className="col-md-6 col-lg-4">
                  <div className="form-group">
                    <label>Operator ID</label>
                    <input
                      type="text"
                      name="OperatorID"
                      className="form-control floating-input"
                      placeholder="Scan Operator ID"
                      value={operatorid}
                      onChange={handleInputChange}
                    />
                    {errors.operatorid && (
                      <div className="error">{errors.operatorid}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="form-group">
                    <label>Move to Stage</label>
                    <select
                      name="stage"
                      className="form-control floating-input"
                      value={stage}
                      onChange={handleInputChange}
                    >
                      <option selected> Select Stage</option>
                      {stageList && stageList .slice(0, stageList.findIndex(value => value.name == failedStage) + 1).map((value) => (
                         <option key={value.id} value={value.id}>{value.name}</option>
                      ))}
                    </select>
                    {/* {errors.stage && (
                      <div className="error">{errors.stage}</div>
                    )} */}
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      className="form-control floating-input"
                      value={status}
                      onChange={handleInputChange}
                    >
                      <option selected value="">
                        Select Status
                      </option>
                      <option value="1">Pass</option>
                      <option value="0">Fail</option>
                      <option value="2">Scrap</option>
                    </select>
                    {errors.status && (
                      <div className="error">{errors.status}</div>
                    )}
                  </div>
                </div>
                <hr></hr>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Defect Location</th>
                      <th>Defect Type</th>
                      <th>Rework Type</th>
                      <th>Details of Rework Done</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reworkDetailnew.map((item, index) => (
                      <tr key={index}>
                        <td>
                        { isRowData(index) ?  ( 
                        <div className="form-group">
                          <select
                            name="defectLocation"
                            className="form-control floating-input"
                            value={item.defectLocation}
                            defaultValue=""
                            onChange={(e) =>
                              handleDescriptionChange(index, e)
                            }
                          >
                            <option value="" disabled>
                              Select Defect Location
                            </option>
                            {bomDetails.bom_data &&
                              bomDetails.bom_data.map((item) => (
                                <option key={item.id} value={item.reference}>
                                  {item.reference}
                                </option>
                              ))}
                          </select>
                          {errors.dl && (
                            <div className="error">{errors.dl}</div>
                          )}
                        </div>
                      ): (item.defectLocation)}
                        </td>
                      {/* {!isAdded && (<td>{item.defectLocation}</td>)} */}
{/* ---------------------------------------------------------------------------------- */}
                      {/* {isAdded && (
                         <div className="col-md-6 col-lg-3">
                         <div className="form-group">
                           <label>Defect Location</label>
                           <select
                             name="defectLocation"
                             className="form-control floating-input"
                             value={item.defectLocation}
                             defaultValue=""
                             onChange={(e) =>
                               handleDescriptionChange(index, e)
                             }
                           >
                             <option value="" disabled>
                               Select Defect Location
                             </option>
                             {bomDetails.bom_data &&
                               bomDetails.bom_data.map((item) => (
                                 <option key={item.id} value={item.reference}>
                                   {item.reference}
                                 </option>
                               ))}
                           </select>
                           {errors.dl && (
                             <div className="error">{errors.dl}</div>
                           )}
                         </div>
                       </div>
                      )} */}
{/* ---------------------------------------------------------------------------------- */}
                        <td>{item.defectType}</td>
                        <td>
                          <select
                            name="reworkType"
                            className="form-control floating-input"
                            value={item.reworkType}
                            onChange={(e) => handleDescriptionChange(e, index)}
                          >
                            <option value="Correction">Correction</option>
                            <option value="Replace">Replace</option>
                          </select>
                          {item.reworkType == "Replace" && (
                            <input
                              type="text"
                              name="qrCode"
                              className="form-control floating-input"
                              placeholder="Scan QR Code"
                              value={item.qrCode}
                              onChange={(e) =>
                                handleDescriptionChange(e, index)
                              }
                            />
                          )}
                        </td>
                        <td>
                          <input
                            type="text"
                            name="description"
                            className="form-control floating-input"
                            placeholder="Enter Details"
                            value={item.description}
                            onChange={(e) => handleDescriptionChange(e, index)}
                          />
                          {errors[index] && (
                            <div className="error">{errors[index]}</div>
                          )}
                        </td>
                        <td>
                        {reworkDetailnew.length == index + 1 && 
                         (
                          <i
                          className="fa fa-plus"
                          aria-hidden="true"
                          onClick={() => handleAddField(item, index)}
                          style={{ marginLeft: '10px', cursor: 'pointer' }}
                         ></i>
                         )
                        }
                        <i
                         className="fa fa-trash"
                         aria-hidden="true"
                         onClick={() => handleRemoveField(item, index)}
                         style={{ marginLeft: '10px', cursor: 'pointer' }}
                        ></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* {reworkType == 'Replace' && 
                    <>
                      <div  className="col-md-6 col-lg-4">
                          <div className="form-group">
                            <label>Scan QR Code <span class="red-star">*</span></label>
                            <input
                              type="text"
                              name="qrCode"
                              className="form-control floating-input"
                              placeholder="Scan QR Code"
                              value={form.qrCode}
                              onChange={handleInputChange}
                            />
                            {errors.qrCode && <div className="error">{errors.qrCode}</div>}
                          </div>
                      </div>
                      <div  className="col-md-6 col-lg-4">
              <div className="form-group">
                <label>Batch No</label>
                <input
                  type="text"
                  name="batchNo"
                  className="form-control floating-input"
                  placeholder="Batch No"
                  readOnly
                  value={form.batchNo}
                />
              </div>
                      </div>
                      <div  className="col-md-6 col-lg-4">
                        <div className="form-group">
                          <label>Part No</label>
                          <input
                            type="text"
                            name="partNo"
                            className="form-control floating-input"
                            placeholder="Part No"
                            readOnly
                            value={form.partNo}
                          />
                        </div>
                      </div>
                      <div  className="col-md-6 col-lg-4">
                        <div className="form-group">
                          <label>Quantity</label>
                          <input
                            type="text"
                            name="qty"
                            className="form-control floating-input"
                            placeholder="Quantity"
                            readOnly
                            value={form.qty}
                          />
                        </div>
                      </div>
                    </>} */}
              </>
            )}
          </div>
          {details.details && validation && (
            <>
              <hr></hr>
              <div className="page-title">
                <div className="title">
                  <h1>Rework Details of Serial No - {serialno}</h1>
                </div>
              </div>
              <div className="row">
                {/* <div className="col-md-4 col-lg-3 col-xl-3">
                            <div className="form-group">
                                <label>Defect Location : </label>
                                <div className="value" style={{'overflow-x': 'auto'}}>{details.details.defectLocation}</div>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-3 col-xl-3">
                            <div className="form-group">
                                <label>Defect Type : </label>
                                <div className="value">{details.details.defectType}</div>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-3 col-xl-3">
                            <div className="form-group">
                                <label>Description</label>
                                <div className="value">{details.details.description}</div>
                            </div>
                        </div> */}
                <div className="col-md-4 col-lg-3 col-xl-6">
                  <div className="form-group">
                    <label>Failed Stage Neme:</label>
                    <div className="value">{details.stage_name}</div>
                  </div>
                </div>
                <div className="col-md-4 col-lg-3 col-xl-6">
                  <div className="form-group">
                    <label>Message:</label>
                    <div className="value">{errorMsg}</div>
                  </div>
                </div>
              </div>
            </>
          )}
          {validation && (
            <div className="button-container">
              <button type="submit" className="modal-btn save-data">
                Save
              </button>
              <button
                type="button"
                className="modal-btn cancel-modal"
                onClick={formReset}
                data-dismiss="modal"
              >
                Reset
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

