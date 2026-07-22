import { Link } from 'react-router-dom';

import '../styles/about-page.css';

function AboutPage() {
  return (
    <div className="about">
      <header className="about__header">
        <h1 className="about__title">About Tic-Tac-Toe</h1>
        <p className="about__subtitle">Two-player · pass and play</p>
      </header>

      <main className="about__main">
        <section className="about__section">
          <h2 className="about__section-title">What is Tic-Tac-Toe?</h2>
          <p className="about__text">
            Tic-Tac-Toe is a classic two-player strategy game played on a 3×3
            grid. Players take turns marking a cell with their symbol — one
            player uses <span className="about__marker about__marker--x">X</span>
            {' '}and the other uses{' '}
            <span className="about__marker about__marker--o">O</span>. The first
            player to place three of their marks in a horizontal, vertical, or
            diagonal row wins the game.
          </p>
        </section>

        <section className="about__section">
          <h2 className="about__section-title">How to Play</h2>
          <ol className="about__list">
            <li className="about__list-item">
              Player <span className="about__marker about__marker--x">X</span>{' '}
              always goes first.
            </li>
            <li className="about__list-item">
              Players alternate turns — click any empty cell to place your
              marker.
            </li>
            <li className="about__list-item">
              The first player to complete a row, column, or diagonal wins.
            </li>
            <li className="about__list-item">
              If all 9 cells are filled with no winner, the game is a draw.
            </li>
            <li className="about__list-item">
              Press <strong>Reset</strong> at any time to start a new game.
            </li>
          </ol>
        </section>

        <section className="about__section">
          <h2 className="about__section-title">Winning Combinations</h2>
          <p className="about__text">
            There are 8 ways to win — 3 rows, 3 columns, and 2 diagonals:
          </p>
          <ul className="about__list">
            <li className="about__list-item">Row 1: top three cells</li>
            <li className="about__list-item">Row 2: middle three cells</li>
            <li className="about__list-item">Row 3: bottom three cells</li>
            <li className="about__list-item">Column 1: left three cells</li>
            <li className="about__list-item">Column 2: center three cells</li>
            <li className="about__list-item">Column 3: right three cells</li>
            <li className="about__list-item">Diagonal: top-left to bottom-right</li>
            <li className="about__list-item">Diagonal: top-right to bottom-left</li>
          </ul>
        </section>

        <section className="about__section">
          <h2 className="about__section-title">Credits</h2>
          <p className="about__text">
            Built with React and TypeScript. Designed to be accessible,
            keyboard-navigable, and screen-reader friendly.
          </p>
        </section>

        <div className="about__nav">
          <Link to="/" className="about__back-link">
            ← Back to Game
          </Link>
        </div>
      </main>

      <footer className="about__footer">
        <p>Tic-Tac-Toe — Two-player pass-and-play</p>
      </footer>
    </div>
  );
}

export default AboutPage;
