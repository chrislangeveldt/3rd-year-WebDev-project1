import { useState, useEffect } from 'react'
import Header from './Other/Header'
import Contracts from './Other/Contracts'
import AddContract from './Other/AddContract'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Menu from './Other/Menu'


function ContractPage() {
  const [showAddContract, setShowAddContract] = useState(false)
  const [contracts, setContracts] = useState([])
  const [showAllContracts, setShowAllContracts] = useState(true)
  const [showOpenContracts, setShowOpenContracts] = useState(false)
  const [showClosedContracts, setShowClosedContracts] = useState(false)

  useEffect(() => {
    const getContracts = async () => {
      const contractsFromServer = await fetchContracts()
      setContracts(contractsFromServer)
    }

    getContracts()
  }, [])

  //Fetch Contracts
  const fetchContracts = async () => {
    const res = await fetch('http://localhost:5000/contracts')
    const data = await res.json()

    return data
  }

  const fetchContract = async (id) => {
    const res = await fetch(`http://localhost:5000/contracts/${id}`)
    const data = await res.json()

    return data
  }

  //Add Contract
  const addContract = async (contract) => {
    let data = null
    const requestOpt = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
          'contract_name':contract.contractName,
          'contract_length':contract.contractLength,
          'contract_value':contract.contractValue,
          'contract_description':contract.contractDes,
          'programming_language':contract.contractLan,
          'location':contract.location
      }),
    }
    async function fetchFunc() {
        return await fetch('http://127.0.0.1:5000/createContract', requestOpt)
        .then(response => response.json())
        .catch(error => console.log(error));
    }
    (async () => {
        data = await fetchFunc();
    })()

    setContracts([...contracts, data])
  }


  // Delete Contract
  const deleteContract = async (id) => {
    await fetch(`http://localhost:5000/contracts/${id}`, {
      method: 'DELETE',
    })
    setContracts(contracts.filter((contract) => contract.id !== id))
  }

  // Expand Contract
  const expandContract = async (id) => {
    const contractToExpand = await fetchContract(id)
    const updContract = {
      ...contractToExpand,
      expandContract: !contractToExpand.expandContract
    }

    const res = await fetch(`http://localhost:5000/contracts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updContract)
    })

    const data = await res.json()

    setContracts(contracts.map((contract) => contract.id === id ? { ...contract, expandContract: data.expandContract } : contract))
  }

  const showDevelopers = async (id) => {
    const devsToShow = await fetchContract(id)
    const showDev = {
      ...devsToShow,
      showDevs: !devsToShow.showDevs
    }

    const res = await fetch(`http://localhost:5000/contracts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(showDev)
    })

    const data = await res.json()

    setContracts(contracts.map((contract) => contract.id === id ? { ...contract, showDevs: data.showDevs } : contract))
  }

  // Toggle Reminder
  const toggleExpand = async (id) => {
    const contractToToggle = await fetchContract(id)
    const updContract = {
      ...contractToToggle,
      expandContract: !contractToToggle.expandContract
    }

    const res = await fetch(`http://localhost:5000/contracts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updContract)
    })

    const data = await res.json()

    setContracts(contracts.map((contract) => contract.id === id ? { ...contract, expandContract: data.expandContract } : contract))
  }

  return (
    <Router>

      
    </Router>
  )
}

export default ContractPage;
