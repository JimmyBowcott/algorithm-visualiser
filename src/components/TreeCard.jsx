import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import Line from "./Line";

const TreeCard = ({title, index, to, nHovered, highlightN, line=false}) => {

    return (
        <Link to={`/tree?type=${to}`}>
            <button className="flex flex-row items-center"
            onMouseEnter={() => highlightN(index)} onMouseLeave={() => highlightN(-1)}>
                <div className={`rounded-full w-40 h-40 bg-slate-700 shadow-xl border-2
                ${nHovered >= index ? 'text-orange-600 border-orange-600' : 'border-white'}
                flex items-center justify-center relative transition-colors`}>
                    <h2 className="card-title text-xl font-semibold">{title}</h2>
                </div>
                { line && <Line highlighted={nHovered > index} /> }
            </button>
        </Link>
    )
}

TreeCard.propTypes = {
    title: PropTypes.string.isRequired,
    to: PropTypes.string,
    index: PropTypes.number.isRequired,
    nHovered: PropTypes.number.isRequired,
    highlightN: PropTypes.func.isRequired,
    line: PropTypes.bool
};

export default TreeCard