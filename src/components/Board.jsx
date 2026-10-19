import { useRef, useState } from "react";
import { PLAYER_O, PLAYER_X, Square } from "./Square";

export function Board() {
    const [status, setStatus] = useState(new Array(3).fill(undefined));
    let lastPlayer = useRef();

    function handleClick(idx, player) {
        if (player !== PLAYER_O && player !== PLAYER_X) return;

        if (lastPlayer.current === player) return;

        lastPlayer.current = player;
        const newStatus = status.map((value, index) => (index === idx ? player : value));
        setStatus(newStatus);
    }

    return (
        <div className="board">
            <div className="board-row">
                <Square value={status[0]} onSquareClick={(mouseButton) => handleClick(0, mouseButton)} />
                <Square value={status[1]} onSquareClick={(mouseButton) => handleClick(1, mouseButton)} />
                <Square value={status[2]} onSquareClick={(mouseButton) => handleClick(2, mouseButton)} />
            </div>
        </div>
    );
}
