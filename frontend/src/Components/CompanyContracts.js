import React, { useState } from 'react'
import "./CSS/Table.css"
import moment from 'moment'
import Swal from 'sweetalert2'
import AddContract from './Other/AddContract'



function CompanyContractTable() {

    const [data, setData] = useState([]);
    const [order, setOrder] = useState('DSC');
    const [onceOff, setOnceOff] = useState(true);

    if (onceOff) {
        fetch(`http://127.0.0.1:5000/getCompanyContracts/open/DSC`, {
        'method': 'GET',
        headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(response => setData(response))
        .catch(error => console.log(error));
        setOnceOff(false);
    }

    const sorting = (column) => {
        if (order === 'ASC') {
            setOrder('DSC');
            fetch(`http://127.0.0.1:5000/getCompanyContracts/${column}/DSC`, {
            'method': 'GET',
            headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(response => setData(response))
            .catch(error => console.log(error));  
        }
        if (order === 'DSC') {
            setOrder('ASC');
            fetch(`http://127.0.0.1:5000/getCompanyContracts/${column}/ASC`, {
            'method': 'GET',
            headers: { 'Content-Type': 'application/json' }
            })
            .then(response => response.json())
            .then(response => setData(response))
            .catch(error => console.log(error));
        }
    }
    const routeChange = (status) => {
        alert(status);

    }

    const makeContract = () => {
        window.location.pathname = "/AddContract"
    }

    const viewApplicants = async (id, open) => {
        localStorage.setItem("table_status", 'applicants');
        localStorage.setItem('contract_id', id);
        localStorage.setItem('contract_open', open)
        window.location.reload();
      }

    return (
        <div className="tbl-container">
            <div>
                <button onClick={()=>makeContract()} className="btn view-av">Add Contract</button>
            </div>

            <table id="myTable" className="table table-available">

                <thead >
                    <tr>
                        <th title="CLICK TO SORT" onClick={() => sorting("name")}>Contract Name</th>
                        <th title="CLICK TO SORT" onClick={() => sorting("length")}>Contract Length</th>
                        <th title="CLICK TO SORT" onClick={() => sorting("value")}>Contract Value</th>
                        <th >Contract Description</th>
                        <th title="CLICK TO SORT" onClick={() => sorting("programming_language")}>Programming Language</th>
                        <th title="CLICK TO SORT" onClick={() => sorting("location")}>Location</th>
                        <th title="CLICK TO SORT" onClick={() => sorting("date")}>Date</th>
                        <th title="CLICK TO SORT" onClick={() => sorting("open")}>State</th>
                        <th>  </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((d) => (
                        <tr key={d.id}>
                            <td>{d.name}</td>
                            <td>{d.length}</td>
                            <td>{d.value}</td>
                            <td>{d.description}</td>
                            <td>{d.programming_language}</td>
                            <td>{d.location}</td>
                            <td>{moment(d.date).format("MM/DD/YYYY")}</td>
                            <td>{d.open ? ('open'):('closed')}</td>
                            <td className="link-apply" onClick={() => viewApplicants(d.id, d.open)}>{d.open ? ('Applicants'):('Accepted Applicant')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default CompanyContractTable;