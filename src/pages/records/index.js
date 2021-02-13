import React from 'react';
import TablaRecords from '../../components/TablaRecords';


function  RecordsPage(props) {
    return(
        <React.Fragment>
            <h1>Registros</h1>
            <div className="container">
                <TablaRecords></TablaRecords>
            </div>
        </React.Fragment>
    );
}

export default RecordsPage;