import PropTypes from "prop-types";

const GridCell = ({type, pos, handleClick}) => {
    const colors = {
        start: 'bg-orange-600',
        end: 'bg-orange-600',
        visited: 'bg-slate-600',
        wall: 'bg-white',
        path: 'bg-green-600',
        notfound: 'bg-red-600',
        '': '',
    }

    return (
        <div className={`${colors[type]} aspect-square border border-white cursor-pointer`} onClick={() => handleClick(pos)}></div>
    )
}

GridCell.propTypes = {
    type: PropTypes.string,
    pos: PropTypes.array.isRequired,
    handleClick: PropTypes.func
}

export default GridCell