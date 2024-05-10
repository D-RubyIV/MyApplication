import React, { Fragment, useEffect, useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import CloseIcon from '@mui/icons-material/Close';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import MyAxios from "../../../axios/CustomAxios";
import { select } from "@material-tailwind/react";
import Select from 'react-select';
import toast from 'react-hot-toast';
import PaginateComponet from "./Paginate"
import { Link, json } from "react-router-dom";
import { Skeleton } from "@mui/material";
import 'react-loading-skeleton/dist/skeleton.css'
const Table = ({ tableName, labelHeaders, config, buttonExpand, signalReload }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [offset, setOffset] = useState(1)
    const [limit, setLimit] = useState(10)
    const [countItems, setCountItems] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [listModel, setListModel] = useState([]);
    const [listModelVisiable, setListModelVisiable] = useState([]);
    const [showDetailIndex, setShowDetailIndex] = useState(null); // Trạng thái để theo dõi việc hiển thị chi tiết
    const [countValidLabel, setCountValidLabel] = useState(0)
    const [openDialog, setOpenDialog] = useState(false)
    const [action, setAction] = useState()
    const [myItem, setmyItem] = useState()
    const [foreignObject, setForeignObject] = useState([])
    const [intersection, setIntersection] = useState()
    const baseApi = config["indexApi"]

    useEffect(() => {
        loadInitSetup();
    }, [signalReload])


    const handleArrayModel = (list) => {
        setListModel(list);
        setListModelVisiable(list.slice((offset - 1) * limit, offset * limit))
        setTotalPages(parseInt(Math.ceil(list.length / limit)))
    }
    const loadInitSetup = async () => {
        await MyAxios.get(`${baseApi}`)
            .then(function (response) {
                if (response.status === 200 && response.data && Array.isArray(response.data)) {
                    handleArrayModel(response.data);
                    setCountItems(response.data.length);
                    setTimeout(() => {
                        setIsLoading(true)
                    }, 200)
                }
            })
            .catch(function (error) {
                console.error("Error loading initial setup:", error);
            });
    }
    const onPageChange = (pageNumber) => {
        console.log(pageNumber)
        setOffset(pageNumber)
        setListModelVisiable(listModel.slice((pageNumber - 1) * limit, pageNumber * limit))
    }
    const handleSubmit = async () => {
        if (action === "CREATE") {
            await MyAxios.post(baseApi, myItem).then(function (response) {
                setOpenDialog(false);
                console.log(response);
                if (response.status == 200) {
                    toast("CREATE SUCCESS")
                    setTimeout(() => {
                        loadInitSetup();
                    }, 100);
                }
            })
        }
        else if (action === "UPDATE") {
            await MyAxios.put(`${baseApi}/${myItem.id}`, myItem).then(function (response) {
                setOpenDialog(false);
                console.log(response);
                if (response.status == 200) {
                    toast("UPDATE SUCCESS")
                    setTimeout(() => {
                        loadInitSetup();
                    }, 100);
                }
            })
        }
        else if (action === "DELETE") {
            await MyAxios.delete(`${baseApi}/${myItem.id}`).then(function (response) {
                setOpenDialog(false);
                console.log(response);
                if (response.status == 200) {
                    toast("DELETE SUCCESS")
                    setTimeout(() => {
                        loadInitSetup();
                    }, 100);
                }
            })
        }

    }

    const reloadTypeItem = (myItem) => {
        console.log("BG: ")
        console.log(myItem)
        const itemKeys = myItem ? Object.keys(myItem) : []
        const foreignKeys = labelHeaders
            .filter(header => header.type === 'object') // Filter for objects with type "object"
            .map(header => header.nameAttribute); // Extract the nameAttribute
        console.log("ItemKeys:")
        console.log(itemKeys)
        console.log("ForeignKeys:")
        console.log(foreignKeys)

        const intersection = foreignKeys.filter(value => itemKeys.includes(value));
        console.log("Intersection:")
        console.log(intersection)
        setIntersection(intersection)

        const temporaryData = {};
        intersection.map(label => {
            temporaryData[label.replace("Model", "Id")] = myItem[label].id;
        })
        setmyItem({ ...myItem, ...temporaryData })
    }

    useEffect(() => {
        console.log(myItem)
    }, [myItem])

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        const labelSelect = labelHeaders.filter(s => (s.nameAttribute === name || s.nameAttribute.replace("Id", "Model") === name.replace("Id", "Model")))[0]
        if (labelSelect.type === "object") {
            const modelSelect = foreignObject[labelSelect.nameAttribute].filter(s => s.id === parseInt(value))[0]
            setmyItem(prevItem => ({
                ...prevItem,
                [name]: parseInt(value),
                [name.replace("Id", "Model")]: modelSelect
            }));
        }

        else {
            setmyItem({ ...myItem, [name]: value });
        }
    };

    const handleDialog = (isOpen, action, id) => {
        setOpenDialog(isOpen);
        setAction(action)
        if (action === "CREATE") {
            console.log("CREATE: " + id);
            setmyItem();
        }
        else if (action === "DETAIL") {
            console.log("DETAIL: " + id);
            setmyItem(listModelVisiable.filter(model => model.id === id)[0]);
            reloadTypeItem(listModelVisiable.filter(model => model.id === id)[0])
        }
        else if (action === "UPDATE") {
            console.log("UPDATE: " + id)
            setmyItem(listModelVisiable.filter(model => model.id === id)[0]);
            reloadTypeItem(listModelVisiable.filter(model => model.id === id)[0])
        }
        else if (action === "DELETE") {
            console.log("DELETE: " + id)
            setmyItem(listModelVisiable.filter(model => model.id === id)[0]);
            reloadTypeItem(listModelVisiable.filter(model => model.id === id)[0])
        }

    }
    const handleForeignObject = async () => {
        const temporaryData = {};
        for (const fore of config.foreignModel) {
            try {
                const response = await MyAxios.get(fore.apiUrl);
                temporaryData[fore.nameAttribute] = response.data;
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        const updatedObject = { ...foreignObject, ...temporaryData };
        setForeignObject(updatedObject);
    }

    const handleResize = () => {
        setScreenWidth(window.innerWidth);
        var countValid = 0
        labelHeaders.map(label => {
            if (isValidLabel(label)) {
                countValid += 1
            }
        })
        setCountValidLabel(countValid)
    };

    useEffect(() => {
        handleResize();
        handleForeignObject();
        loadInitSetup();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const isValidLabel = (label) => {
        return screenWidth > label.media;
    };

    const toggleDetail = (index) => {
        setShowDetailIndex(showDetailIndex === index ? null : index);
    };

    const isDisable = (label) => {
        return ((!label.allowEdit || action === "DETAIL") && action !== "CREATE")
    }

    const renderInputRow = (label) => {
        const classNameInput = `text-[16px] block w-full rounded-md border-0 py-1 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 border-2 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${isDisable(label) ? "bg-blue-100" : ""}`
        if (label.type === "string") {
            return (
                <div>
                    <label htmlFor={label.nameAttribute} className='text-sm'>{label.nameColumn}:</label>
                    <input disabled={isDisable(label)} onChange={handleOnChange} name={label.nameAttribute} value={myItem ? myItem[label.nameAttribute] || "" : ""} type="text" className={classNameInput} />
                </div>
            )
        }
        // else if (label.type === "link") {
        //     return (
        //         <div>
        //             <label htmlFor={label.nameAttribute} className='text-sm'>{label.nameColumn}:</label>
        //             <div><Link to={myItem ? myItem[label.nameAttribute] :""} className={`${classNameInput} border-none text-blue-600 underline`}>Download</Link></div>
        //         </div>
        //     )
        // }
        else if (label.type === "integer") {
            if (label.nameAttribute === "id" && action !== "CREATE") {
                return (
                    <div>
                        <label htmlFor={label.nameAttribute} className='text-sm'>{label.nameColumn}:</label>
                        <input disabled={isDisable(label)} onChange={handleOnChange} name={label.nameAttribute} value={myItem ? myItem[label.nameAttribute] || "" : ""} type="int" className={classNameInput} />
                    </div>
                )
            }
            if (label.nameAttribute !== "id" && action === "CREATE") {
                return (
                    <div>
                        <label htmlFor={label.nameAttribute} className='text-sm'>{label.nameColumn}:</label>
                        <input disabled={isDisable(label)} onChange={handleOnChange} name={label.nameAttribute} value={myItem ? myItem[label.nameAttribute] || "" : ""} type="int" className={classNameInput} />
                    </div>
                )
            }
        }
        else if (label.type === "boolean") {
            return (
                <div>
                    <label htmlFor={label.nameAttribute} className='text-sm'>{label.nameColumn}:</label>
                    <select
                        title="select"
                        disabled={isDisable(label)}
                        name={label.nameAttribute}
                        onChange={handleOnChange}
                        className={classNameInput}
                    >
                        <option>Please select your option</option>
                        <option value={true} selected={myItem && myItem[label.nameAttribute] === true}>True</option>
                        <option value={false} selected={myItem && myItem[label.nameAttribute] === false}>False</option>
                    </select>
                </div>
            )
        }
        else if (label.type === "object") {
            return (
                <div>
                    <label htmlFor={label.nameAttribute} className='text-sm'>{label.nameColumn}:</label>
                    <select
                        title="select"
                        disabled={isDisable(label)}
                        name={label.nameAttribute.replace("Model", "Id")}
                        onChange={handleOnChange}
                        className={classNameInput}
                    >
                        <option>Please select your option</option>
                        {
                            Array.isArray(foreignObject[label.nameAttribute]) && foreignObject[label.nameAttribute].map((item, index) => (
                                <option key={index} value={item.id} selected={myItem && myItem[label.nameAttribute.replace("Model", "Id")] === item.id}>{item.hasOwnProperty("name") ? item.name : item.hasOwnProperty("username") ? item.username : item.id}</option>
                            ))
                        }

                    </select>
                </div>
            )
        }
    }

    const renderLongString = (chuoi, length) => {
        const chuoiJavaScript = chuoi.toString();
        if (chuoiJavaScript.length <= length) {
            return chuoiJavaScript;
        } else {
            return chuoiJavaScript.substring(0, length) + '...';
        }
    }

    const renderValueCol = (data) => {
        if (data && typeof data === "string" && data.includes("download/uuid")) {
            return (<Link to={import.meta.env.VITE_SERVERURI + data} className="text-blue-500 underline">Download</Link>)
        }
        else if (data && typeof data === "boolean") {
            return data ? "True" : "False"
        }
        else if (data && typeof data === "object") {
            return data.hasOwnProperty("name") ? data.name : data.hasOwnProperty("username") ? data.username : data.id
        }
        else if (data) {
            return renderLongString(data, 24)
        }
        else {
            return "null"
        }
    }

    return (
        <Fragment>
            <div className="relative">
                <div className="flex justify-between items-center">
                    <div>
                        <div><span className="text-md font-semibold">Manage {tableName}</span></div>
                    </div>
                    <div className="flex gap-2">
                        {buttonExpand}
                        <button className="py-1 bg-indigo-400 px-2 rounded-md text-sm hover:text-gray-200" onClick={() => handleDialog(true, "CREATE", null)}>Create</button>
                    </div>
                </div>
                <div className="mt-2 overflow-y-scroll h-auto" >
                    <table className="table-fixed w-full overflow-scroll">
                        <thead className="shadow tracking-tighter">
                            <tr className="text-center">
                                <th className={`w-1/12 py-2 tracking-tighter text-[14.5px] text-gray-600`}>.No</th>
                                {labelHeaders.map((label, index) => (
                                    isValidLabel(label) && (
                                        <th className={`py-2 tracking-tighter text-[14.5px] text-gray-600`} key={index}>{label.nameColumn}</th>
                                    )
                                ))}
                                <th className={`w-2/12 py-2 tracking-tighter text-[14.5px] text-gray-600 hidden md:inline`}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listModelVisiable.length == 0 && isLoading == true ? (
                                <tr>
                                    <td colSpan={window.innerWidth >= 768 ? countValidLabel + 2 : countValidLabel + 1}>
                                        <div className="text-center">
                                            <p className="text-[13.5px] font-semibold py-10">No have any object</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : isLoading == false ? (
                                <>
                                    {[...Array(limit)].map((_, index) => (
                                        <tr key={index} >
                                            <td colSpan={countValidLabel + 1} className="py-[15px] text-center tracking-tighter text-xs md:text text-gray-700">
                                                <Skeleton/>
                                            </td>
                                        </tr>
                                    ))}
                                </>

                            ) : (
                                <>
                                    {listModelVisiable.map((item, index) => (
                                        <Fragment key={index}>
                                            <tr className="shadow-md relative">
                                                <td className="py-[15px] text-center tracking-tighter text-xs md:text text-gray-700">
                                                    <div className="flex items-center justify-center">
                                                        <button className="flex text-blue-400 md:invisible" onClick={() => toggleDetail(index)}>
                                                            {showDetailIndex === index ? <RemoveCircleOutlineIcon sx={{ fontSize: 16 }} /> : <ControlPointIcon sx={{ fontSize: 16 }} />}
                                                        </button>
                                                        <span>{index + 1}</span>
                                                    </div>
                                                </td>
                                                {labelHeaders.map((label, j) => (
                                                    isValidLabel(label) && (
                                                        <td className="py-2 text-center tracking-tighter text-[13px] md:text text-gray-700" key={j}>{renderValueCol(item[label.nameAttribute])}</td>
                                                    )
                                                ))}
                                                <td className="h-full hidden md:block py-2">
                                                    <div className="flex justify-center items-center gap-4">
                                                        <button onClick={() => handleDialog(true, "DETAIL", item.id)} className="text-gray-500"><VisibilityIcon sx={{ fontSize: 18 }} /></button>
                                                        <button onClick={() => handleDialog(true, "UPDATE", item.id)} className="text-gray-500"><EditIcon sx={{ fontSize: 18 }} /></button>
                                                        <button onClick={() => handleDialog(true, "DELETE", item.id)} className="text-gray-500"><DeleteIcon sx={{ fontSize: 18 }} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Render detail row if showDetailIndex is equal to index */}
                                            {showDetailIndex === index && (
                                                <tr className="shadow py-3 text-center tracking-tighter text-xs md:text text-gray-700 bg-gray-100 rounded-md">
                                                    <td className="p-2" colSpan={countValidLabel + 1}>
                                                        {labelHeaders.map((label, index) => (
                                                            <div className='grid grid-cols-8 text-left py-1 px-2' key={index}>
                                                                <div className='col-span-3'>
                                                                    <span className="py-2 text-left tracking-tighter text-[12px] md:text text-gray-900">{label.nameColumn}:</span>
                                                                </div>
                                                                <div className="col-span-5">
                                                                    <span className="text-[13px] tracking-tighter">{renderValueCol(item[label.nameAttribute])}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className='flex gap-3 mt-1'>
                                                            <button onClick={() => handleDialog(true, "UPDATE", item.id)} className='text-xs py-0.5 text-blue-500 underline'>Edit</button>
                                                            <button onClick={() => handleDialog(true, "DELETE", item.id)} className='text-xs py-0.5 text-red-500 underline'>Delete</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    ))}
                                </>
                            )}

                        </tbody>
                    </table>
                </div>
                <div className="">
                    <div className={`rounded-md bg-white shadow-2xl fixed w-5/6 md:w-2/5 2xl:w-2/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${openDialog ? "block" : "hidden"}`}>
                        <div>
                            <div className='py-1.5 px-3'>
                                <div className="py-1.5 text-right ">
                                    <div className='flex justify-between'>
                                        <div><span className='font-semibold'>Dialog</span></div>
                                        <button onClick={() => setOpenDialog(false)}><CloseIcon /></button>
                                    </div>
                                </div>
                                <div>
                                    {action !== "DELETE" && labelHeaders.map((label, index) => (
                                        <div className='' key={index}>

                                            {
                                                renderInputRow(label)
                                            }
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4">
                                    {
                                        action !== "DETAIL" ? <button className='p-2 bg-indigo-500 w-full rounded-md text-white' onClick={() => handleSubmit()}>Submit</button> : ""
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center border-t border-gray-200 py-3 justify-center">
                    <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div className="text-center sm:text-left">
                            <p className="text-sm text-gray-600">
                                Showing <span className="text-gray-900 text-xs font-semibold">{(offset - 1) * limit + 1}</span> to <span className="text-gray-900 text-xs font-semibold">{countItems > offset * limit ? offset * limit : countItems}</span> of {" "}
                                <span className="text-gray-900 text-xs font-semibold">{countItems}</span> results
                            </p>
                        </div>
                        <div className="">
                            <nav className="rounded-md shadow-sm" aria-label="Pagination">
                                <PaginateComponet totalPages={totalPages} currentPage={offset} onPageChange={onPageChange} />
                            </nav>
                        </div>
                    </div>
                </div>
                <div>

                </div>
            </div>

        </Fragment >
    );
}

export default Table;
