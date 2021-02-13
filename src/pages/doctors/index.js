import React from 'react';
import TablaDoctors from '../../components/TablaDoctors';


function  DoctorsPage(props) {
    return(
        <React.Fragment>
            <h1>Doctores</h1>
            <div className="container">
                <TablaDoctors></TablaDoctors>
            </div>
        </React.Fragment>
    );
}

export default DoctorsPage;