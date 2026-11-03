import { useRef, useState } from "react";
import { PLAYER_O, PLAYER_X, Square } from "./Square";

const BOARD_SIDES = 3;
const BOARD_INDICES = [...Array(BOARD_SIDES).keys()];
const CELL_COUNT = BOARD_SIDES * BOARD_SIDES;
const AVATAR_SEGMENTER = new Intl.Segmenter(undefined, { granularity: "grapheme" });

const WIN_POSITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

export function Board() {
    const [status, setStatus] = useState(new Array(CELL_COUNT).fill(undefined));
    const [winner, setWinner] = useState();
    const [gameOver, setGameOver] = useState(false);
    const [lastCell, setLastCell] = useState();
    const [playerPoints, setPlayerPoints] = useState({
        [PLAYER_X]: 0,
        [PLAYER_O]: 0,
    });
    const [avatarInputs, setAvatarInputs] = useState({
        [PLAYER_X]: "",
        [PLAYER_O]: "",
    });
    const [avatars, setAvatars] = useState({
        [PLAYER_X]: PLAYER_X,
        [PLAYER_O]: PLAYER_O,
    });
    let lastPlayer = useRef();

    function handleClick(idx, player) {
        if (player !== PLAYER_O && player !== PLAYER_X) return;
        if (lastPlayer.current === player) return;

        if (status[idx]) return;

        if (winner) return;

        lastPlayer.current = player;
        const newStatus = status.map((value, index) => (index === idx ? player : value));
        win_check(newStatus, player);
        console.log(newStatus);
        setStatus(newStatus);
        setLastCell(idx);
    }

    function win_check(newStatus, player) {
        const win_array = WIN_POSITIONS.map((pos) => {
            const c1 = newStatus[pos[0]];

            const c2 = newStatus[pos[1]];
            const c3 = newStatus[pos[2]];
            return c1 && c1 === c2 && c1 === c3 ? true : false;
        });
        console.log(newStatus, win_array);
        const isGameOver = win_array.some((value) => value);
        if (isGameOver) {
            setWinner(player);
            setPlayerPoints((points) => ({
                ...points,
                [player]: points[player] + 1,
            }));
            setGameOver(true);
            return;
        }
        if (newStatus.every((cell) => cell)) {
            setGameOver(true);
        }
    }

    function handlePlayAgain() {
        setStatus(new Array(CELL_COUNT).fill(undefined));
        setWinner(undefined);
        setGameOver(false);
        setLastCell(undefined);
        lastPlayer.current = undefined;
    }
    function setXOavatar() {
        function getAvatar(value, currentAvatar) {
            const avatar = value.trim();
            return [...AVATAR_SEGMENTER.segment(avatar)].length === 1 ? avatar : currentAvatar;
        }

        setAvatars((currentAvatars) => ({
            ...currentAvatars,
            [PLAYER_X]: getAvatar(avatarInputs[PLAYER_X], currentAvatars[PLAYER_X]),
            [PLAYER_O]: getAvatar(avatarInputs[PLAYER_O], currentAvatars[PLAYER_O]),
        }));
    }

    return (
        <div className="board">
            <button id="night-mode-toggle" onClick={() => document.documentElement.classList.toggle("night-mode")}>
                Éjszakai mód
            </button>
            {BOARD_INDICES.map((rowIndex) => (
                <div className="board-row" key={rowIndex}>
                    {BOARD_INDICES.map((columnIndex) => {
                        const index = rowIndex * BOARD_SIDES + columnIndex;
                        return (
                            <Square
                                key={index}
                                value={status[index] ? avatars[status[index]] : status[index]}
                                highlight={index === lastCell}
                                onSquareClick={(player) => handleClick(index, player)}
                            />
                        );
                    })}
                </div>
            ))}
            <input
                type="text"
                id="XPlayerAvatar"
                placeholder="X játékos avatara"
                value={avatarInputs[PLAYER_X]}
                onChange={(event) => setAvatarInputs((inputs) => ({ ...inputs, [PLAYER_X]: event.target.value }))}
            />
            <input
                type="text"
                id="OPlayerAvatar"
                placeholder="O játékos avatara"
                value={avatarInputs[PLAYER_O]}
                onChange={(event) => setAvatarInputs((inputs) => ({ ...inputs, [PLAYER_O]: event.target.value }))}
            />
            <br />
            <button id="set-avatar" onClick={setXOavatar}>
                Avatar beállítása
            </button>{" "}
            {gameOver && <button onClick={handlePlayAgain}>Ujra</button>}
            {gameOver && winner && (
                <div>{`Vége. ${avatars[winner]} győzött. Állás:${avatars[PLAYER_X]}: ${playerPoints[PLAYER_X]} ${avatars[PLAYER_O]}: ${playerPoints[PLAYER_O]}`}</div>
            )}
            {gameOver && !winner && <div>Döntetlen! Nincs győztes.</div>}
        </div>
    );
}
