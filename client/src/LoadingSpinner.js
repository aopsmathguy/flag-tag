import React from 'react';

const LoadingSpinner = () => {
    return (
        <div style={{
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh'}}>
            <div style={{ 
                border: '16px solid #f3f3f3',
                borderRadius: '50%',
                borderTop: '16px solid #3498db',
                width: '120px',
                height: '120px',
                animation: 'spin 2s linear infinite'}}>
            </div>
        </div>
    );   
};

export default LoadingSpinner;