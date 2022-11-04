import { FaAngleDown, FaRegUser, FaAngleUp } from 'react-icons/fa'
import React from 'react';
import '../CSS/ContractR.css';
import Modal from './Modal.js'

const Contract = ({ contract, onExpand }) => {

  return (
    <div className={'contract'}>
      {contract.expandContract ? (
        <><h3>
          {contract.contractName}{' '}
          <FaAngleUp style={{ color: 'grey', cursor: 'pointer' }}
            onClick={() => onExpand(contract.id)} />
        </h3>
          <p>Contract Length: {contract.contractLength}</p>
          <p>Contract Value: {contract.contractValue}</p>
          <p>Contract Description: {contract.contractDes}</p>
          <p>Contract Language/s: {contract.contractLan}</p>
          {contract.office ? (<p>Location: office</p>) : (<p>Location: remote</p>)}
          <p>Date Posted: {contract.contractDate}</p>
          {contract.open ? (
            <>
              {contract.contractDev.length > 0 ? 
                 <Modal trigger={<button> Trigger</button>} position="right center">
                   </Modal>
            :
              <FaRegUser style={{ color: 'black', cursor: 'pointer' }}/>}
            </>
          ) : (
            <p>Developer assigned to contract:</p>
          )}
        </>
      ) : (
        <><h3>
          {contract.contractName}{' '}
          <FaAngleDown style={{ color: 'grey', cursor: 'pointer' }}
            onClick={() => onExpand(contract.id)} />
        </h3>
          {contract.open ? (<p>Open</p>) : (<p>Closed</p>)}
        </>
      )}
    </div>
  )
}

export default Contract