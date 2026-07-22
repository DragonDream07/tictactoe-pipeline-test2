import React from 'react';

interface StatusProps {
  message: string;
}

function Status({ message }: StatusProps): React.ReactElement {
  return (
    <p
      className="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {message}
    </p>
  );
}

export default Status;
