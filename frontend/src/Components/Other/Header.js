import PropTypes from 'prop-types';
import Button from './Button'

const Header = ({ title, onAdd , showAdd }) => {
  return (
    <header className='Header'>
        <h1>{title}{' '}
        <Button  text={showAdd ? 'Close' : 'Add Contract'} onClick = {onAdd}/>
        </h1>
    </header>
  )
}

Header.defaultProps = {
    title: 'Company Contracts',
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
}

export default Header