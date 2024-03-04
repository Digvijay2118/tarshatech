"use client";
import React, { useEffect, useMemo, useState } from "react";

import Loader from "react-js-loader";
import toast from "react-hot-toast";
import {
  addDaysFromDays,
  GetDate,
  GetTime,
  parseDate,
  todayDate,
} from "../services/DateTimeService";
import NumberCounter from "number-counter";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import SupportTable from "../components/SupportTable";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import CountUp from "react-countup";
import {
  useSortBy,
  useTable,
  usePagination,
  useGlobalFilter,
  useRowSelect,
} from "react-table";
import Image from "next/image";
import WorkSvg from "../../public/icons/work.svg";
import ActivitySvg from "../../public/icons/activity.svg";
import FolderSvg from "../../public/icons/folder.svg";
import ProfileSvg from "../../public/icons/profile.svg";

const Dashboard = () => {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const [loading, setLoading] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(null);

  const navigate = useRouter();

  const [cardData, setCardData] = useState({
    TotalUsers: 0,
    TotalSupport: 0,
    totalEmployee: 0,
    totalFiles: 0,
  });
  const [sites, setSites] = useState([]);

  const [chartData, setChartData] = useState({
    labels: ["Free", "Plan A", "Plan B"],
    datasets: [
      {
        labels: "Free & Plan A & Plan B",
        data: [1, 1, 1],
        backgroundColor: ["#3D441F", "#887549", "nordic-dark-teal"],
      },
    ],
  });


  const hname = {
    created_at: "Date",
    full_name: "Plan Name",
    inspect: "Firm Name",
    site_incharge: "Mobile No.",
    type_name: "Email",
    title: "Message",
    action: "action",
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "id",
        accessor: "id",
      },
      {
        Header: "Date",
        accessor: `${hname.created_at}`,
      },
      {
        Header: "Plan Name",
        accessor: `${hname.full_name}`,
      },
      {
        Header: "Firm Name",
        accessor: `${hname.inspect}`,
      },
      {
        Header: "Mobile No.",
        accessor: `${hname.site_incharge}`,
      },
      {
        Header: "Email",
        accessor: `${hname.type_name}`,
      },
      {
        Header: "Message",
        accessor: `${hname.title}`,
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
            <div className="dropdown">
              <button
                className="btn btn-secondary btn_action_menu"
                type="button"
                data-toggle="dropdown"
                aria-expanded="false"
              >
                <b>{/* <ActionButtonJsx /> */}</b>
              </button>
              <div className="dropdown-menu">
                <Link
                  className="dropdown-item"
                  to={`/${SiteRoute.edit}/${row?.values?.id}`}
                >
                  {/* {actionButtonObject.edit} */}
                </Link>

                <a
                  className="dropdown-item"
                  role={"button"}
                  onClick={() => onRemovesites(row?.values?.id)}
                >
                  {/* {actionButtonObject.delete} */}
                </a>
              </div>
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
      data: sites,
      initialState: { hiddenColumns: ["id"], pageIndex: 0, pageSize: 10 },
    },
    tableHooks,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // const defaultUserImgPath = useMemo(() => `${host_name}/${defaultuserpic}`);

  const fetchChartData = async () => {
    try {
      const res = await axios.get("/api/dashboard");
      // console.log("res---->", res.data.responseData);

      if (!res?.data?.error) {
        const payload = res?.data?.responseData;
        var total_users = payload?.totalUsers ? payload?.totalUsers : 0;
        var total_expense = payload?.usersWithPlanStatus2
          ? payload?.usersWithPlanStatus2
          : 0;
        var total_status = payload?.usersWithPlanStatus3
          ? payload?.usersWithPlanStatus3
          : 0;
        // setCardData({
        const TotalSupport = payload?.totalSupport[0][0].Total_support
          ? payload?.totalSupport[0][0].Total_support
          : 0;
        const TotalUsers = payload?.totalUsersInSystem[0][0].Total_user
          ? payload?.totalUsersInSystem[0][0].Total_user
          : 0;
        // });

        setCardData((prevCardData) => {
          const updatedCardData = {
            ...prevCardData,
            TotalSupport: TotalSupport,
            TotalUsers: TotalUsers,
            // ... other properties
          };
          console.log("Updated Card Data:", updatedCardData);
          return updatedCardData;
        });

        setChartData((prevState) => {
          return {
            ...prevState,
            datasets: [
              {
                ...prevState?.datasets[0],
                data: [total_users, total_expense, total_status],
              },
            ],
          };
        });
      } else {
      }
    } catch (err) {
      console.log(err);
      toast.error(`${err?.response?.data?.message}`);
    }
  };

  const validJson = (jsonString) => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  useEffect(() => {
    // if (superAccess()) {
    fetchChartData();
    // }
    // fetchData();
    // notification();
    // if ([adminKey, empKey].includes(getRole())) {
    //   notificationTodo();
    // }
    // numberCounter();
    // image2svg();
  }, []);

  const previewLoader = () => {
    return (
      <>
        <Loader
          type="bubble-scale"
          bgColor={"#000000"}
          title={""}
          color={"#000000"}
          size={25}
        />
      </>
    );
  };

  const previewNumWithCounter = (val = 0) => {
    try {
      // console.log("Value inside previewNumWithCounter:", val);
      return (
        <>
          <h2 className="counter h1 text-white mb-0">{val}</h2>
          {/* <CountUp end={val} start={0} /> */}
          {/* </h2> */}
        </>
      );
    } catch (err) {
      console.log("errr--->", err);
      return (
        <>
          <h2 className="counter h1 text-white mb-0">
            <NumberCounter end={0} start={0} />
          </h2>
        </>
      );
    }
  };

  return (
    <>
    <Header/>
    <Sidebar/>
      <div className="content__wrapper">
        <section className="page-content">
          <div className="page-title mobile-title">
            <h1 className="h4 mb-4">Dashboard</h1>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div className="row">
                <div className="col-lg-12">
                  <div className="revenue-chart card">
                    <div className="row  align-items-center">
                      <div className="col-md-6">
                        {/* <canvas id="revenueChart"></canvas> */}
                        <Doughnut data={chartData} />
                      </div>
                      <div className="col-md-6">
                        <ul className="chart-info-list list-unstyled">
                          <li className="chart-info-item d-flex">
                            <span className="info-bg  turtle-green d-block"></span>
                            <div className="chart-info-des ml-2">
                              <h5 className="mb-2">Free</h5>
                              <p className="mb-0 small">
                                Rs{" "}
                                {new Intl.NumberFormat("en-IN", {
                                  maximumSignificantDigits: 3,
                                }).format(chartData?.datasets[0]?.data[0])}
                              </p>
                            </div>
                          </li>
                          <li className="chart-info-item d-flex">
                            <span className="info-bg shadow-yellow d-block"></span>
                            <div className="chart-info-des ml-2">
                              <h5 className="mb-2">Plan A</h5>

                              <p className="mb-0 small">
                                Rs{" "}
                                {new Intl.NumberFormat("en-IN", {
                                  maximumSignificantDigits: 3,
                                }).format(chartData?.datasets[0]?.data[1])}
                              </p>
                            </div>
                          </li>
                          <li className="chart-info-item d-flex">
                            <span className="info-bg nordic-dark-teal d-block"></span>
                            <div className="chart-info-des ml-2">
                              <h5 className="mb-2">Plan B</h5>

                              <p className="mb-0 small">
                                Rs{" "}
                                {new Intl.NumberFormat("en-IN", {
                                  maximumSignificantDigits: 3,
                                }).format(chartData?.datasets[0]?.data[2])}
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6">
                  <div className="dashboard__stats card turtle-green">
                    <div className="stats__icon text-right">
                      <Image src={WorkSvg} className="in__svg" alt="Work" />
                    </div>
                    <div className="stats__details">
                      
                   
                      <h2 className="counter h1 text-white mb-0">
                        <CountUp end={cardData.totalEmployee} start={0} />
                      </h2>

                      <p className="text-white mb-0">Storage Utilize</p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 col-md-6 col-sm-6">
                  <Link href="customer">
                    <div className="card dashboard__stats pine-tree-dark">
                      <div className="stats__icon text-right">
                        <Image
                          src={FolderSvg}
                          className="in__svg"
                          alt="Employees"
                        />
                      </div>
                      <div className="stats__details">
                        <h2 className="counter h1 text-white mb-0">
                          <CountUp end={cardData.totalFiles} start={0} />
                        </h2>

                        <p className="text-white mb-0">Total Customer</p>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6">
                  <Link href="customer">
                    <div className="card dashboard__stats nordic-dark-teal">
                      <div className="stats__icon text-right">
                        <Image
                          src={ProfileSvg}
                          className="in__svg"
                          alt="Employees"
                        />
                      </div>
                      <div className="stats__details">
                        {console.log("Total Employee:", cardData.TotalUsers)}
                        <h2 className="counter h1 text-white mb-0">
                          <CountUp end={cardData.TotalUsers} start={0} />
                        </h2>
                        <p className="text-white mb-0">Total User</p>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6">
                  <Link href="support">
                    <div className="card dashboard__stats shadow-yellow">
                      <div className="stats__icon text-right">
                        <Image
                          src={FolderSvg}
                          className="in__svg"
                          alt="Employees"
                        />
                      </div>
                      <div className="stats__details">
                        <h2 className="counter h1 text-white mb-0">
                          <CountUp end={cardData.TotalSupport} start={0} />
                        </h2>

                        <p className="text-white mb-0">Total Support Request</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Display the Map component here */}
            {/* <div className="row">
              <div className="col-lg-12">
                <Map />
              </div>
            </div> */}
            <div className="col-lg-12">
              {/* <div className="row"> */}
              <div >
                <section className="page-content">
                  <div className="page-title mobile-title">
                    <h1 className="h4 mb-0">Dashboard</h1>
                    {/*<p className="mb-4">Online Process</p>*/}
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="zed__table card justify-content-start">
                        <h5 className="text-shadow-yellow px-2 mb-4">
                          Last 5 Enquiry
                        </h5>
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
                            <table
                              className="table datatable"
                              {...getTableProps()}
                            >
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
                    <div className="col-md-6">
                      <SupportTable />
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;

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
