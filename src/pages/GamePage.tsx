import React, { useState, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type Marker = 'X' | 'O';
type CellValue = Marker | null;
type Board = [CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue, CellValue];
type GameStatus = 'playing' | 'winner' | 'draw';

// ─── Constants ───────────────────────────────────────────────────────────────

const WINNING_COMBINATIONS: [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const EMPTY_BOARD: Board = [null, null, null, null, null, null, null, null, null];

// ─── Utilities ───────────────────────────────────────────────────────────────

function detectWinner(board: Board): Marker | null {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a] as Marker;
    }
  }
  return null;
}

function isBoardFull(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

function getCurrentPlayer(board: Board): Marker {
  const filled = board.filter((c) => c !== null).length;
  return filled % 2 === 0 ? 'X' : 'O';
}

// ─── useGame hook ────────────────────────────────────────────────────────────

interface UseGameReturn {
  board: Board;
  status: GameStatus;
  currentPlayer: Marker;
  winner: Marker | null;
  isDraw: boolean;
  playMove: (index: number) => void;
  reset: () => void;
}

function useGame(): UseGameReturn {
  const [board, setBoard] = useState<Board>(() => [...EMPTY_BOARD] as Board);

  const winner = detectWinner(board);
  const isDraw = !winner && isBoardFull(board);
  const status: GameStatus = winner ? 'winner' : isDraw ? 'draw' : 'playing';
  const currentPlayer = getCurrentPlayer(board);

  const playMove = useCallback(
    (index: number) => {
      // VR-05, VR-06: no moves after game over
      if (status !== 'playing') return;
      // VR-01: no overwriting occupied cells
      if (board[index] !== null) return;

      const next = [...board] as Board;
      next[index] = currentPlayer; // VR-02, VR-04
      setBoard(next);
    },
    [board, currentPlayer, status],
  );

  const reset = useCallback(() => {
    setBoard([...EMPTY_BOARD] as Board);
  }, []);

  return { board, status, currentPlayer, winner, isDraw, playMove, reset };
}

// ─── Cell component ──────────────────────────────────────────────────────────

interface CellProps {
  value: CellValue;
  index: number;
  isDisabled: boolean;
  onClick: () => void;
}

function Cell({ value, index, isDisabled, onClick }: CellProps): React.ReactElement {
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  const valueLabel = value ?? 'empty';
  const ariaLabel = `Row ${row}, Column ${col}, ${valueLabel}`;

  const classNames = [
    'board__cell',
    value ? `board__cell--filled` : '',
    value === 'X' ? 'board__cell--x' : '',
    value === 'O' ? 'board__cell--o' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classNames}
      onClick={onClick}
      disabled={isDisabled || value !== null}
      aria-label={ariaLabel}
      tabIndex={0}
    >
      {value ?? ''}
    </button>
  );
}

// ─── Board component ─────────────────────────────────────────────────────────

interface BoardProps {
  board: Board;
  isDisabled: boolean;
  onCellClick: (index: number) => void;
}

function Board({ board, isDisabled, onCellClick }: BoardProps): React.ReactElement {
  return (
    <section className="board" role="grid" aria-label="Tic-Tac-Toe board">
      {board.map((value, index) => (
        <Cell
          key={index}
          value={value}
          index={index}
          isDisabled={isDisabled}
          onClick={() => onCellClick(index)}
        />
      ))}
    </section>
  );
}

// ─── Status component ────────────────────────────────────────────────────────

interface StatusProps {
  status: GameStatus;
  currentPlayer: Marker;
  winner: Marker | null;
}

function Status({ status, currentPlayer, winner }: StatusProps): React.ReactElement {
  let message: string;
  let statusClass = 'status';

  if (status === 'winner' && winner) {
    message = `Player ${winner} wins!`;
    statusClass = 'status status--win';
  } else if (status === 'draw') {
    message = "It's a draw!";
    statusClass = 'status status--draw';
  } else {
    message = `${currentPlayer}'s turn`;
  }

  return (
    <p className={statusClass} role="status" aria-live="polite">
      {message}
    </p>
  );
}

// ─── ResetButton component ───────────────────────────────────────────────────

interface ResetButtonProps {
  onReset: () => void;
}

function ResetButton({ onReset }: ResetButtonProps): React.ReactElement {
  return (
    <button type="button" className="reset-button" onClick={onReset}>
      Reset
    </button>
  );
}

// ─── Styles (injected as a <style> tag via a helper) ─────────────────────────
// All values sourced from design-tokens.json

const GAME_STYLES = `
  :root {
    --color-bg-app: #0f172a;
    --color-bg-surface: #1e293b;
    --color-bg-board: #111827;
    --color-bg-cell: #1f2937;
    --color-bg-cell-hover: #374151;
    --color-text-primary: #f8fafc;
    --color-text-secondary: #94a3b8;
    --color-text-muted: #64748b;
    --color-marker-x: #38bdf8;
    --color-marker-o: #fb7185;
    --color-accent-primary: #6366f1;
    --color-accent-primary-hover: #4f46e5;
    --color-accent-focus-ring: #818cf8;
    --color-border-default: #334155;
    --color-border-strong: #475569;
    --color-state-win: #22c55e;
    --color-state-win-bg: #14532d;
    --color-state-draw: #eab308;
    --radius-board: 1rem;
    --radius-cell: 0.5rem;
    --radius-button: 0.5rem;
    --shadow-board: 0 12px 32px rgba(0, 0, 0, 0.45);
    --shadow-focus: 0 0 0 3px rgba(129, 140, 248, 0.6);
    --transition-cell: background-color 120ms ease-out, transform 120ms ease-out;
    --transition-button: background-color 180ms ease-out, box-shadow 180ms ease-out;
    --font-base: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
    --board-size: min(90vw, 420px);
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: var(--font-base);
    background: var(--color-bg-app);
    color: var(--color-text-primary);
    min-height: 100vh;
  }

  .game-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 1.5rem;
    background: var(--color-bg-app);
  }

  .game-page__header {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .game-page__title {
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-text-primary);
    line-height: 1.1;
  }

  .game-page__subtitle {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }

  .game-page__main {
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .status {
    font-size: 1.25rem;
    font-weight: 600;
    min-height: 1.75rem;
    text-align: center;
    color: var(--color-text-primary);
  }

  .status--win {
    color: var(--color-state-win);
  }

  .status--draw {
    color: var(--color-state-draw);
  }

  .board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    width: var(--board-size);
    aspect-ratio: 1 / 1;
    background: var(--color-bg-board);
    padding: 0.5rem;
    border-radius: var(--radius-board);
    box-shadow: var(--shadow-board);
  }

  .board__cell {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-cell);
    border: 1px solid var(--color-border-default);
    border-radius: var(--radius-cell);
    font-size: 3rem;
    font-weight: 700;
    aspect-ratio: 1 / 1;
    cursor: pointer;
    color: var(--color-text-primary);
    transition: var(--transition-cell);
    line-height: 1;
    font-family: var(--font-base);
  }

  .board__cell:hover:not(:disabled) {
    background: var(--color-bg-cell-hover);
    transform: scale(1.03);
  }

  .board__cell:focus-visible {
    outline: none;
    box-shadow: var(--shadow-focus);
  }

  .board__cell:disabled {
    cursor: default;
  }

  .board__cell--x {
    color: var(--color-marker-x);
  }

  .board__cell--o {
    color: var(--color-marker-o);
  }

  .reset-button {
    background: var(--color-accent-primary);
    color: #ffffff;
    border: none;
    border-radius: var(--radius-button);
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    font-family: var(--font-base);
    transition: var(--transition-button);
  }

  .reset-button:hover {
    background: var(--color-accent-primary-hover);
  }

  .reset-button:focus-visible {
    outline: none;
    box-shadow: var(--shadow-focus);
  }

  .game-page__footer {
    margin-top: 2rem;
    color: var(--color-text-muted);
    font-size: 0.75rem;
    text-align: center;
  }

  @media (max-width: 480px) {
    .game-page__title {
      font-size: 2rem;
    }

    .board__cell {
      font-size: 2.25rem;
    }
  }
`;

// ─── StyleInjector helper ────────────────────────────────────────────────────

function StyleInjector({ css }: { css: string }): null {
  if (typeof document !== 'undefined') {
    const id = 'game-page-styles';
    if (!document.getElementById(id)) {
      const tag = document.createElement('style');
      tag.id = id;
      tag.textContent = css;
      document.head.appendChild(tag);
    }
  }
  return null;
}

// ─── GamePage ────────────────────────────────────────────────────────────────

export default function GamePage(): React.ReactElement {
  const { board, status, currentPlayer, winner, isDraw, playMove, reset } = useGame();

  const isGameOver = status === 'winner' || status === 'draw';

  const handleCellClick = useCallback(
    (index: number) => {
      playMove(index);
    },
    [playMove],
  );

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <>
      <StyleInjector css={GAME_STYLES} />
      <div className="game-page">
        <header className="game-page__header">
          <h1 className="game-page__title">Tic-Tac-Toe</h1>
          <p className="game-page__subtitle">Two-player · pass and play</p>
        </header>

        <main className="game-page__main">
          <Status
            status={status}
            currentPlayer={currentPlayer}
            winner={winner}
          />

          <Board
            board={board}
            isDisabled={isGameOver}
            onCellClick={handleCellClick}
          />

          <ResetButton onReset={handleReset} />
        </main>

        <footer className="game-page__footer">
          <p>Two players · take turns · first to three wins</p>
        </footer>
      </div>
    </>
  );
}
