import React, { useState } from 'react'
import "./CSS/Table.css"
import moment from 'moment'
import Modal from './Other/Modal';

function PendingContractTable() {

    const [data, setData] = useState([]);
    const [onceOff, setOnceOff] = useState(true)

    if (onceOff) {
        fetch(`http://127.0.0.1:5000/getPendingContracts`, {
            'method': 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(response => setData(response))
            .catch(error => console.log(error));
        setOnceOff(false);
    }

    const handleDevTable = (status) => {
        if (status === "available") {
            localStorage.setItem("table_status", "available");
            window.location.reload();
        }
        else if (status === "pending") {
            localStorage.setItem("table_status", "pending");
            window.location.reload();
        } else {
            localStorage.setItem("table_status", "accepted");
            window.location.reload();
        }
    }

    const routeViewComProfile = (company_id) => {
        localStorage.setItem("ComID", company_id);
        window.location.pathname="/viewComProfile";
    }

    return (
        <div className="tbl-container">
            <div>
                <button onClick={() => handleDevTable("available")} className="btn view-av">Available Contracts</button>
                <button onClick={() => handleDevTable("pending")} className="btn view-pen">Pending Contracts</button>
                <button onClick={() => handleDevTable("accepted")} className="btn view-ac">Accepted Contracts</button>
            </div>

            <table id="myTable" className="table table-pending">

                <thead >
                    <tr>
                        <th >Company Name</th>
                        <th >Contract Length (Months)</th>
                        <th >Contract Value</th>
                        <th >Contract Description</th>
                        <th >Programming Language</th>
                        <th >Location</th>
                        <th >Date</th>
                        <th> Status </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((d) => (
                        <tr key={d.id}>
                            <td title="CLICK TO VIEW PROFILE" className="link" onClick={() => routeViewComProfile(d.company_id)}>{d.company_name}</td>
                            <td>{d.length}</td>
                            <td>{d.value}</td>
                            <td>{d.description}</td>
                            <td>{d.programming_language}</td>
                            <td>{d.location}</td>
                            <td>{moment(d.date).format("MM/DD/YYYY")}</td>
                            <td>Pending</td>
                        </tr>

                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default PendingContractTable;