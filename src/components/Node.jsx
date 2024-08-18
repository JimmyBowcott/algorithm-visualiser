import PropTypes from "prop-types";
import TreeConnection from "./TreeConnection";

const PARENT_IDs = {
  0: null,
  1: 0,
  2: 0,
  3: 1,
  4: 1,
  5: 2,
  6: 2,
  7: 3,
  8: 3,
  9: 4,
  10: 4,
  11: 5,
  12: 5,
  13: 6,
  14: 6,
}

const Node = ({ value, n }) => {
    const maxRows = 4;
    const row = Math.ceil(Math.log2(n + 2));
    const col = n-(2**(row-1))+2; // Index in row (1-based)
    const gridPos = [row, 2**(maxRows-row)+2**(maxRows-row+1)*(col-1)] // CSS grid position

    if (!value) return null;

    return (
      <>
      <div className="z-10 flex items-center relative justify-center border-2 bg-slate-800 border-white w-full aspect-square rounded-full shadow-md mb-4 text-xs sm:text-md md:text-lg lg:text-xl transition-colors 1s ease" style={{gridRow: gridPos[0], gridColumn: gridPos[1]}} id={`node-${n}`}>
        {value}
      </div>
      {n !== 0 &&<TreeConnection from={`node-${n}`} to={`node-${PARENT_IDs[n]}`} />}
      </>
    );
  };

Node.propTypes = {
  value: PropTypes.number,
  n: PropTypes.number.isRequired,
};

export default Node;