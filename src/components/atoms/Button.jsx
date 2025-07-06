import React from 'react';

function Button({ children, onClick }) {
    return (
        <button onClick={onClick} style={{ padding: '8px 16px', fontSize: '16px' }}>
            {children}
        </button>
    );
}

export default Button;
