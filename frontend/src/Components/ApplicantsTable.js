import React, { useState } from 'react'
import "./CSS/Table.css"
import moment from 'moment'
import Swal from 'sweetalert2'


function ApplicantsTable() {

    const [data, setData] = useState([]);
    const [order, setOrder] = useState('DSC');
    const [onceOff, setOnceOff] = useState(true);
    const open = localStorage.getItem('contract_open');

    if (onceOff) {
        fetch(`http://127.0.0.1:5000/getApplicants/${localStorage.getItem('contract_id')}`, {
        'method': 'GET',
        headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(response => setData(response))
        .catch(error => console.log(error));
        setOnceOff(false);
    }

    const routeChange = (status) => {
        alert(status);

    }

    const backToHome = () => {
        localStorage.setItem("table_status", 'companyContracts');
        localStorage.removeItem('contract_id');
        localStorage.removeItem('contract_open');
        window.location.reload();
    }

    const routeViewComProfile = (ComName) => {
        alert(ComName);
        localStorage.setItem("ComNameView", ComName);
    }

    const acceptApplicant = async (id) => {
        fetch(`http://127.0.0.1:5000/acceptDeveloper`, {
        'method': 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'developer_id':id,
            'contract_id':localStorage.getItem('contract_id')
            })
        })
        .then(response => response.json())
        .catch(error => console.log(error));
        localStorage.setItem("table_status", 'companyHome');
        localStorage.removeItem('contract_id');
        localStorage.removeItem('contract_open');
        alert('An Applicant has been Accepted!')
        window.location.reload();
      }

    return (
        <div className="tbl-container">
            <div>
                <button onClick={()=>backToHome()} className="btn view-av">Back to Home</button>
            </div>

            <table id="myTable" className="table table-available">

                <thead >
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Java Experience</th>
                        <th>Python Experience</th>
                        <th>C Experience</th>
                        <th>Go Experience</th>
                        <th>Open to Contracts</th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((d) => (
                        <tr key={d.id}>
                            <td>{d.name}</td>
                            <td>{d.email}</td>
                            <td>{d.scaleJava}</td>
                            <td>{d.scalePython}</td>
                            <td>{d.scaleC}</td>
                            <td>{d.scaleGo}</td>
                            <td>{d.open_to_contracts ? ('Yes') : ('No')}</td>
                            <td className={open === 'true' ? ("link-apply"):("")} onClick={open === 'true' ? (() => acceptApplicant(d.id)):("")}>{open === 'true' ? ('Accept'):('Accepted')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ApplicantsTable;