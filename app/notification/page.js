"use client";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  memo,
  useRef,
} from "react";
import { GetDate } from "../services/DateTimeService";
import Link from "next/link";
import { SwalAlert } from "../UtilsComponent/SwalDialog";
import toast from "react-hot-toast";
import { AgGridReact } from "ag-grid-react";
// import 'ag-grid-community/dist/styles/ag-grid.css';
// import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
// import { paginationRows } from '../../../config/CommonVariables';
import {
  exportToCsv,
  loadingTemplate,
  notFoundTemplate,
  ActionButtonJsx,
  actionButtonObject,
} from "../services/FormCommon";
import {
  useSortBy,
  useTable,
  usePagination,
  useGlobalFilter,
  useRowSelect,
} from "react-table";
import { MyLoader } from "../UtilsComponent/MyLoader";
import axios from "axios";
import Header from "../components/header";
import Sidebar from "../components/sidebar";

//Deposit_Expense
const List = () => {
  var header = {
    // Authorization: `Bearer ${getToken()}`,
    ["Content-type"]: "application/json",
  };
  const [plans, setPlans] = useState([]);

  const [loading, setLoading] = useState(false);

  const hname = {
    title: "Title",
    description: "Description",
    send_to: "Send To",
    created_at: "Date",
    action: "action",
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "id",
        accessor: "id",
      },
      {
        Header: "Title",
        accessor: `${hname.title}`,
      },
      {
        Header: "Description",
        accessor: `${hname.description}`,
      },
      {
        Header: "Send To",
        accessor: `${hname.send_to}`,
      },
      {
        Header: "Date",
        accessor: `${hname.created_at}`,
      },

    ],
    []
  );

  const tableHooks = (hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: "Edit",
        Header: "",
        Cell: ({ row }) => (
          <React.Fragment>
            <div class="dropdown">
              <button
                class="btn btn-secondary btn_action_menu"
                type="button"
                id="dropdownMenu2"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <b>
                  <ActionButtonJsx />
                </b>
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
                <Link
                  className="dropdown-item"
                  href={`/addnotification/${row?.values?.id}`}
                  
                >
                  {actionButtonObject.edit}
                </Link>
             
              </ul>
            </div>
          </React.Fragment>
        ),
      },
    ]);
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    page,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data: plans,
      initialState: { hiddenColumns: ["id"], pageIndex: 0, pageSize: 10 },
    },
    tableHooks,
    useGlobalFilter,
    useSortBy,
    usePagination
  );



  function formatTimestamp(timestamp) {
    var date = new Date(timestamp);
    var day = date.getDate();
    var month = date.toLocaleString('default', { month: 'short' });
    var year = date.getFullYear();
    var hour = date.getHours();
    var minute = date.getMinutes();

    // Add leading zero if necessary
    minute = minute < 10 ? '0' + minute : minute;

    return `${day}-${month}-${year} ${hour}:${minute}`;
}



  
  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await axios.get("/api/notification");
            console.log("res---->",response)

            if (response.data?.result?.length > 0) {
                const rows = response.data.result[0]?.map((plans) => ({
                    id: plans.id,
                    [hname.title]: plans.title, // Map first_name to Customer_name
                    [hname.description]: plans.description, // Map last_name to firm_name
                    [hname.created_at]: plans.created_at? formatTimestamp(plans?.created_at) : "-",
                    [hname.send_to]: plans.send_to == 1 ? "All User" : "Customer",
                }));
           

                setPlans(rows);
            } else {
                setPlans([]); // No data, set an empty array
            }
        } catch (error) {
            console.error("Error fetching options:", error);
        }
    };

    fetchData();
}, []);






  return (
    <>
         <Header />
      <Sidebar />
    <div className="content__wrapper">
      <section className="page-content">
        <div className="page-title mobile-title">
          <h1 className="h4 mb-0">Notification</h1>
          {/*<p className="mb-4">Online Process</p>*/}
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="zed__table card">
              <h5 className="text-shadow-yellow px-2 mb-4">All Notification</h5>
              <div className="row">
                <div className="col-lg-3 col-12">
                  <GlobalFilter
                    filter={globalFilter}
                    setFilter={setGlobalFilter}
                  />
                </div>
              </div>
              <div className="table-responsive">
                {loading ? (
                  <MyLoader value={false} />
                ) : (
                  <table className="table datatable" {...getTableProps()}>
                    <thead>
                      {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map((column) => (
                            <th
                              {...column.getHeaderProps(
                                column.getSortByToggleProps()
                              )}
                            >
                              {column.render("Header")}
                              <span>
                                {column.isSorted
                                  ? column.isSortedDesc
                                    ? " 🔽"
                                    : " 🔼"
                                  : ""}
                              </span>
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                      {/* {rows.map(row => { */}
                      {page.map((row) => {
                        prepareRow(row);
                        return (
                          <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                              return (
                                <td {...cell.getCellProps()}>
                                  {cell.render("Cell")}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <td colSpan={5}>
                        <div className="pagination justify-content-end align-items-center">
                          <button
                            className="pagination_button"
                            onClick={() => gotoPage(0)}
                            disabled={!canPreviousPage}
                          >
                            {"<<"}
                          </button>
                          <button
                            className="pagination_button"
                            onClick={() => previousPage()}
                            disabled={!canPreviousPage}
                          >
                            {"<"}
                          </button>
                          <span>
                            Page{" "}
                            <strong>
                              {pageIndex + 1} of {pageOptions.length}
                            </strong>
                          </span>
                          <button
                            className="pagination_button"
                            onClick={() => nextPage()}
                            disabled={!canNextPage}
                          >
                            {">"}
                          </button>
                          <button
                            className="pagination_button"
                            onClick={() => gotoPage(pageCount - 1)}
                            disabled={!canNextPage}
                          >
                            {">>"}
                          </button>
                        </div>
                      </td>
                    </tfoot>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default List;

const GlobalFilter = ({ filter, setFilter }) => {
  return (
    <span>
      <input
        className="form-control"
        type={"search"}
        style={{ margin: "5px" }}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search"
      />
    </span>
  );
};
