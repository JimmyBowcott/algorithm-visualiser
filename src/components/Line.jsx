import PropTypes from "prop-types";

const Line = ({highlighted}) => {

    return (
        <svg height="11" width="25" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="10" x2="250" y2="10" className={`stroke-2 ${highlighted ? 'stroke-orange-600' : 'stroke-white'}`} />
      </svg> 
    )
}

Line.propTypes = {
    highlighted: PropTypes.bool.isRequired
}

export default Line