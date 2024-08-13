import {Link} from "react-router-dom";
import PropTypes from "prop-types";

const Card = ({title, to}) => {
    return (
        <Link to={to}>
            <button className="flex flex-col items-center justify-center gap-4 rounded-2xl w-44 h-44 bg-slate-100 dark:bg-slate-700 shadow-xl
            hover:animate-pulse">
                <h2 className="card-title text-2xl font-semibold">{title}</h2>
            </button>
        </Link>
    )
}

Card.propTypes = {
    title: PropTypes.string.isRequired,
    to: PropTypes.string
};

export default Card