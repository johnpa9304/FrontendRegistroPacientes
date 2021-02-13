import React from 'react';
import Navbar from '../Navbar';
import './style.css';

function TodoPage(props){
    return(
        <React.Fragment>
            <Navbar></Navbar>
            <div className="page">
                {props.children}
            </div>
        </React.Fragment>
    );
}

export default TodoPage;