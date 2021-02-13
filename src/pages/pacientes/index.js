import React from 'react';
import TablePatients from '../../components/TablePatients';

function  PacientesPage(props) {
    return(
        <React.Fragment>
            <h1 align="center">Pacientes</h1>
            <div className="container">
                <TablePatients></TablePatients>
            </div>
        </React.Fragment>
    );
}

export default PacientesPage;