import React from 'react';
import Foto from "../../img/Jhon.jpg"
import Foto2 from "../../img/guillermo.jpg"
import Foto3 from "../../img/Johnny.jpg"

function  HomePage(props) {
    return(
        <React.Fragment>
            <h1>Tutoria de Desarrollo Basado en Plataformas</h1>
            <br></br>

            <div className="card-group">
                <div className="card">
                    <img src={Foto} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title">Jhon Peña</h5>
                        <p className="card-text">Estudiante de la Carrera de Computacion UCSG</p>
                    </div>
                    <div className="card-footer">
                        <small className="text-muted">7mo Semestre</small>
                    </div>
                </div>
                <div className="card">
                    <img src={Foto2} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title">Guillermo Mora</h5>
                        <p className="card-text">Estudiante de la Carrera de Computacion UCSG</p>
                    </div>
                    <div className="card-footer">
                        <small className="text-muted">6to Semestre</small>
                    </div>
                </div>
                <div className="card">
                    <img src={Foto3} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title">Johnny Romo</h5>
                        <p className="card-text">Estudiante de la Carrera de Computacion UCSG</p>
                    </div>
                    <div className="card-footer">
                        <small className="text-muted">5to Semestre/6to Semestre</small>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default HomePage;
