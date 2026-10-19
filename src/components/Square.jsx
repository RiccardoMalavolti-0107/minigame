export const PLAYER_X = "X";
export const PLAYER_O = "O";

export function Square({ value, highlight, onSquareClick }) {
    function handleContextMenu(event) {
        event.preventDefault();
        onSquareClick(PLAYER_O);
    }

    return (
        <button
            className={"square" + (highlight ? " lastcell" : "")}
            onClick={() => onSquareClick(PLAYER_X)}
            onContextMenu={handleContextMenu}
        >
            {value}
        </button>
    );
}
