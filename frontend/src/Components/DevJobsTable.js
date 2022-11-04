import React, { useState } from 'react'
import "./CSS/Table.css"
import moment from 'moment'
import Swal from 'sweetalert2'
import Modal from './Other/Modal';


function DevContractTable() {

    const [data, setData] = useState([]);
    const [order, setOrder] = useState('DSC');
    const [onceOff, setOnceOff] = useState(true);

    if (onceOff) {
        fetch(`http://127.0.0.1:5000/getAvailableContracts/date/DSC`, {
        'method': 'GET',
        headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(response => setData(response))
            .catch(error => console.log(error));
        setOnceOff(false);
    }

    const sorting = (column) => {
        let search = document.querySelector('input').value;
        if (order === 'ASC') {
            setOrder('DSC');
            if (search !== '') {
                fetch(`http://127.0.0.1:5000/searchCompany/${search}/${column}/ASC`, {
                'method': 'GET',
                headers: { 'Content-Type': 'application/json' }
                })
                .then(response => response.json())
                .then(response => setData(response))
                .catch(error => console.log(error));
            } else {
                fetch(`http://127.0.0.1:5000/getAvailableContracts/${column}/ASC`, {
                'method': 'GET',
                headers: { 'Content-Type': 'application/json' }
                })
                .then(response => response.json())
                .then(response => setData(response))
                .catch(error => console.log(error));
            }
        }
        if (order === 'DSC') {
            setOrder('ASC');
            if (search !== '') {
                fetch(`http://127.0.0.1:5000/searchCompany/${search}/${column}/DSC`, {
                'method': 'GET',
                headers: { 'Content-Type': 'application/json' }
                })
                .then(response => response.json())
                .then(response => setData(response))
                .catch(error => console.log(error));
            } else {
                fetch(`http://127.0.0.1:5000/getAvailableContracts/${column}/DSC`, {
                'method': 'GET',
                headers: { 'Content-Type': 'application/json' }
                })
                .then(response => response.json())
                .then(response => setData(response))
                .catch(error => console.log(error));
            }
        }
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

    const handleChange = () => {
        let search = document.querySelector('input').value;
        if (search === '') {
            search = '@';
        } 
        fetch(`http://127.0.0.1:5000/searchCompany/${search}/date/DSC`, {
        'method': 'GET',
        headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(response => setData(response))
        .catch(error => console.log(error));
    }

    const routeViewComProfile = (company_id) => {
        localStorage.setItem("ComID", company_id);
        window.location.pathname="/viewComProfile";
    }

    const applyContract = async (id) => {
        const requestOpt = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'}
          }
    
        fetch(`http://127.0.0.1:5000/applyContract${id}`, requestOpt)
        .then(response => response.json())
        .catch(error => console.log(error));

        Swal.fire(
            'Successfully Applied!',
            '',
            'success',
          )
      }

    return (
        <div className="tbl-container">
            <div>
                <button onClick={()=>handleDevTable("available")} className="btn view-av">Available Contracts</button>
                <button onClick={()=>handleDevTable("pending")} className="btn view-pen">Pending Contracts</button>
                <button onClick={()=>handleDevTable("accepted")} className="btn view-ac">Accepted Contracts</button>
            </div>

            <table id="myTable" className="table table-available">

                <thead >
                    <input type="text" placeholder="Search Company Name..." onChange={() => handleChange()}/>
                    <tr>
                        <th title="CLICK TO SORT" onClick={() => sorting("company_name")}>Company Name</th>
                        <th title="CLICK TO SORT" onClick={() => sorting("length")}>Contract Length (Months)</th>
                        <th title="CLICK TO SORT" onClick={() => sorting("value")}>Contract Value</th>
                        <th >Contract Description</th>
                        <th title="CLICK TO SORT" onClick={() => sorting("programming_language")}>Programming Language</th>
                        <th title="CLICK TO SORT" onClick={() => sorting("location")}>Location</th>
                        <th title="CLICK TO SORT" onClick={() => sorting("date")}>Date</th>
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
                            <td className="link-apply" onClick={() => applyContract(d.id)}>APPLY</td>
                        </tr>//<Modal text = { <td title="CLICK TO VIEW PROFILE" className="link">{d.company_name}</td>}> </Modal>

                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default DevContractTable;