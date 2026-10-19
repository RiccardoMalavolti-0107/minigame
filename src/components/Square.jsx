export const PLAYER_X = "X";
export const PLAYER_O = "O";

export function Square({ value, onSquareClick }) {
    function handleContextMenu(event) {
        event.preventDefault();
        onSquareClick(PLAYER_O);
    }

    return (
        <button className="square" onClick={() => onSquareClick(PLAYER_X)} onContextMenu={handleContextMenu}>
            {value}
        </button>
    );
}
